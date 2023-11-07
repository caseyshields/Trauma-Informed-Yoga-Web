import GameSession from "../../game/GameSession.js";

/** Provide a time averaged window with outlier rejection specifically for mediapipe's pose estimation.
 */
export default class Poser {

    landmarks = 33; // number of pose landmarks from MediaPipe
    size = 8; // number of frames in the time window that is filtered
    measurements = []; // [frame index] [pose index [x,y,z,w]] raw pose numbers
    sums = []; // [pose index] {x,y,z,w} // scratch space to reduce operations 

    // filter state
    position = []; // [pose index]
    // velocity = [];
    // acceleration = [];
    // v and a obtained using finite differences of the filtered measurements
    // TODO we might want to use a more sophisticated method of differentiation...

    // TODO add a way to discard outliers; confidence scores below .25 appear to be trash!
    // cutoff = 0.5; // measurements below this confidence score are discarded.

    // TODO consider weighting scheme biased to newer measurements to reduce perceived delay

    // TODO track max dimensions like height and width using an exponential filter
    //  - we might want the user to control variables using relative pose size and this is the best place to fashion a yardstick...

    // TODO add a configurable flag on whether we record the filtered poses in local storage
    // recordPoses = true;


    constructor(size=8) {
        this.session = new GameSession();
        this.p5 = this.session.p5;
        
        this.measurements = new Array(size);
        this.sums = new Float32Array(size*4);
        this.position = new Float32Array(size*4);
        this.velocity = new Float32Array(size*4);
        this.acceleration = new Float32Array(size*4);
    }

    add(pose) {
        // transcribe the measurements for this frame
        for( let i=0; i<this.landmarks; i++) {
            let m = new Float32Array(size*4);
            m[i*4] = this.session.poseLandmarks[i].x;
            m[i*4 + 1] = this.session.poseLandmarks[i].y;
            m[i*4 + 2] = this.session.poseLandmarks[i].z;
            m[i*4 + 3] = this.session.poseLandmarks[i].score;

            // update the measurement sum for each pose landmark
            this.sums[i*4] += m[i*4];
            this.sums[i*4 + 1] += m[i*4 + 1];
            this.sums[i*4 + 2] += m[i*4 + 2];
            this.sums[i*4 + 3] += m[i*4 + 3];
        }
        // add the measurements to the time window
        this.measurements.push( m );

        // after filtering down the pertinent info should we store a time series for playback or later rendering?
        // storeItem(time+id, state);

        // if the time window is getting too big, remove frames
        while (this.measurements.length>=size) {
            let r = this.measurements.shift();

            // update the running totals correspondingly
            for( let i=0; i<this.landmarks; i++) {
                this.sums[i*4] -= r[i*4];
                this.sums[i*4 + 1] -= r[i*4 + 1];
                this.sums[i*4 + 2] -= r[i*4 + 2];
                this.sums[i*4 + 3] -= r[i*4 + 3];
            }
            //TODO I should use a flyweight for all these float32 array rather than reallocating them...
        }
    }

    estimate() {
        for (let i=0; i<this.landmarks; i++) {
            this.position[i*4] = this.sums[i*4] / this.sums[i*4+3];
            this.position[i*4+1] = this.sums[i*4+1] / this.sums[i*4+3];
            this.position[i*4+2] = this.sums[i*4+2] / this.sums[i*4+3];

            // TODO velocity and acceleration...
        }
    }

    position() {
        return this.position;
    }

    clear() {
        while(this.measurements.size>0)
            this.measurements.pop();
    }
}