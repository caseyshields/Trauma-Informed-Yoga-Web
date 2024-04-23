import GameSession from "./GameSession.js";

/** Filters a stream of pose estimations from MediaPipe. */
export default class PoseFilter {

    landmarks = 33; // number of pose landmarks from MediaPipe
    measurements = []; // [frame index] [pose index [x,y,z,w]] raw pose numbers, 0-index is the oldest
    sums = []; // [pose index [x,y,z,w]] // scratch space to reduce operations 
    state = []; // filtered output state; [{x,y,z,name,score,vx,vy,ax,ay},...]
    record = false;
    count = 0;

    /**
     * @param {Number} buffer_size number of consecutive poses to weighted average
     * @param {Boolean} show_poses whether all sampled poses are drawn
     * @param {Boolean} show_confidence whether the filtered landmarks are drawn with an average confidence score color-coding
     * @param {Boolean} show_vectors whether the filtered landmarks' velocity and acceleration vectors are drawn
     */
    constructor(buffer_size=8, show_poses=true, show_confidence=true, show_vectors=true) {
        this._session = new GameSession();
        let config = this._session.settingsManager.register('PoseFilter', this);
        config.addRange('buffer_size', 1, 32, buffer_size);
        config.addCheck('show_poses', show_poses);
        config.addCheck('show_confidence', show_confidence);
        config.addCheck('show_vectors', show_vectors);
        // should we make the colors customizable?
    }

    // velocity and acceleration obtained using finite differences of the filtered measurements
    // TODO we might want to use a more sophisticated method of differentiation...

    // TODO add a way to discard outliers; confidence scores below .25 appear to be trash!
    // cutoff = 0.5; // measurements below this confidence score are discarded.

    // TODO consider weighting scheme biased to newer measurements to reduce perceived delay
    // I fear there is no way to do this without impairing the smoothing!

    // TODO track max dimensions like height and width using an exponential filter
    //  - we might want the user to control variables using relative pose size and this is the best place to fashion a yardstick...

    // TODO add a configurable flag on whether we record the filtered poses in local storage
    // recordPoses = true;

    // TODO add pose 'yardsticks'. For example, maybe the user needs to control the pitch of a sound
    // by how high they are holding their hand. We can't map hand position onto pitch
    // until we know how high they can reach!
    // Do we track the highest point seen after instructing them to reach high?
    // How do we adjust if they move closer or further away?

    // There are other architectural questions this module raises;
    // For example, the skeleton (which has game physics) is tied to the raw measurements;
    // Shouldn't it be tied to the filter instead? How?
    
    setup() {
        this.session = new GameSession();
        this.p5 = this.session.p5;
        this.newer = this.p5.color(200,100,100); // newest landmark measurement color
        this.older = this.p5.color(100,100,200); // oldest landmark measurement color
        this.inaccurate = this.p5.color(255,0,0); // landmarks with low confidence score
        this.accurate = this.p5.color(0,255,0); // landmarks with high confidence score
        this.record = false;
        this.measurements = [];
        this.sums = new Float32Array(this.landmarks*4); // I assume these float arrays will be better for the cache. Preoptimization?
        this.state = [];
    }

    record() {
        this.record = true;
        this.count = true;
        this.p5.clearStorage();
    }
    
    stop() {
        this.record = false;
    }

    /** Adds the current pose in the game session to the filter */
    update() {
        if (this.add(this.session.poseLandmarks))
            this.estimate();
    }

    /** Adds the given pose estimate from MediaPipe to the time window of measurements 
     * @returns {boolean} false when input is invalid */
    add(pose) {

        // guard against pose not being initialized since game session exists before mediapipe is initialized.
        if (!pose || !Array.isArray(pose) || pose.length!=this.landmarks)
            return false;

        // transcribe the measurements for this frame and add it to the time window
        let m = new Float32Array(pose.length*4);
        for( let i=0; i<this.landmarks; i++) {
            m[i*4] = pose[i].x;
            m[i*4 + 1] = pose[i].y;
            m[i*4 + 2] = pose[i].z;
            m[i*4 + 3] = pose[i].score;

            // update the measurement sum for each pose landmark
            this.sums[i*4] += pose[i].x * pose[i].score;
            this.sums[i*4 + 1] += pose[i].y * pose[i].score;
            this.sums[i*4 + 2] += pose[i].z * pose[i].score;
            this.sums[i*4 + 3] += pose[i].score;
        }
        this.measurements.push( m );

        // after filtering down the pertinent info should we store a time series for playback or later rendering?
        if (this.record)
            this.p5.storeItem('pose_'+this.count, m);
        // should we record the raw or the filtered pose?

        // if the time window is getting too big, remove frames
        while (this.measurements.length > this.buffer_size) {
            let r = this.measurements.shift();

            // update the running totals correspondingly
            for( let i=0; i<this.landmarks; i++) {
                this.sums[i*4] -= r[i*4] * r[i*4 + 3];
                this.sums[i*4 + 1] -= r[i*4 + 1] * r[i*4 + 3];
                this.sums[i*4 + 2] -= r[i*4 + 2] * r[i*4 + 3];
                this.sums[i*4 + 3] -= r[i*4 + 3];
            } //TODO I should use a flyweight or circular buffer for all these float32 arrays rather than reallocating them...
        }

        return true;
    }

    /** Computes the new weighted state and updates the derivatives. */
    estimate() {

        // TODO this should only be called once in a row, otherwise it will zero the derivatives...
        // how can I enforce that programatically?

        // for each pose landmark
        for (let i=0; i<this.landmarks; i++) {
            if (!this.state[i])
                this.state[i] = {name: this.session.poseLandmarks[i].name}
            let mark = this.state[i];

            // compute the new weighted measurement
            let x = this.sums[i*4] / this.sums[i*4+3];
            let y = this.sums[i*4+1] / this.sums[i*4+3];
            let z = this.sums[i*4+2] / this.sums[i*4+3];
            let score = this.sums[i*4+3] / this.buffer_size;
            // I'm not sure if the average score is misleading in low confidence situations... better than nothing?
            
            // compute new velocity & acceleration using finite differences
            let vx = (mark.x) ? x-mark.x : 0;
            let vy = (mark.y) ? y-mark.y : 0;
            let vz = (mark.z) ? z-mark.z : 0;
            let ax = (mark.vx) ? vx-mark.vx : 0;
            let ay = (mark.vy) ? vy-mark.vy : 0;
            let az = (mark.vz) ? vz-mark.vz : 0;

            // update the pose landmark
            mark.score = score;
            mark.x = x;
            mark.y = y;
            mark.z = z;
            mark.vx = vx;
            mark.vy = vy;
            mark.vz = vz;
            mark.ax = ax;
            mark.ay = ay;
            mark.az = az;
        }
    }

    state() { return this.state; }

    getLandmark(id) {
        if (typeof(id)==='number')
            return this.state[id];
         
        else if(typeof(id)==='string')
            return this.state.find((landmark)=>{
                return (landmark.name == id);
            });

        return null;
    }
    
    getCom( landmarks = [23, 24, 11, 12] ) {
        let count = 0;
        let com = {x:0, y:0, z:0, vx:0, vy:0, vz:0, ax:0, ay:0, az:0, score:0}
        for (let n of landmarks) {
            let landmark = this.state[n];
            if (!isNaN(landmark.x) && !isNaN(landmark.y)) {
                count++;
                for (let a in com)
                    com[a] += landmark[a];
            }
        }
        for (let a in com)
            com[a] /= count;
        return com;
    }
    
    getWingspan(landmarks = [16,14,12,11,13,15]) {
        let length = 0.0;
        for (let n=1; n<landmarks.length; n++) {
            let a = this.state[n-1];
            let b = this.state[n];
            let dx = a.x-b.x;
            let dy = a.y-b.y;
            length += Math.sqrt( (dx*dx) + (dy*dy) );
        }
        return length/2.0;
    } // TODO handle missing or low score points?

    /** empties the filter's time window */
    clear() {
        while(this.measurements.length>0)
            this.measurements.pop();
    }

    /** Draw all the measurement poses, then all the filtered landmarks with state vectors, 
     * color coded by confidence. */
    render() {
        
        // style for all the filter indicators
        this.p5.strokeWeight(1); 
        this.p5.noFill();
        this.p5.strokeCap(this.p5.ROUND);
        this.p5.strokeJoin(this.p5.ROUND);

        // draw all measured frames
        if (this.show_poses)
            for (let frame=0; frame<this.measurements.length; frame++) {
                let pose = this.measurements[frame];

                // shift color by frame age
                let c = this.p5.lerpColor(this.older, this.newer, frame/this.buffer_size);
                this.p5.stroke(c);
                
                this.renderPose(pose);
            }

        // For each filtered pose landmark
        for (const p of this.state) {

            // color code the indicator by confidence score
            let c = this.p5.lerpColor(this.inaccurate, this.accurate, p.score);
            this.p5.stroke(c);

            // draw the state vectors 4 times larger than actual magnitude
            if (this.show_vectors) {
                this.p5.line(p.x, p.y, p.x+(p.vx*4), p.y+(p.vy*4));
                this.p5.line(p.x, p.y, p.x+(p.ax*4), p.y+(p.ay*4));
            }

            // draw a circle around the landmark at a scaled magnitude of 1 pixel/frame
            if (this.show_confidence)
                this.p5.circle(p.x, p.y, 8);
        }
    }
    
    /** Render a pose wireframe from a raw measurement array.
     * Stored like; [P1x, P1y, P1z, P1score, P2x, P2y, ... ]
     * @param {Float32Array} pose A measurement array
    */
    renderPose(pose) {

        // TODO should I load landmark bone connectivity from the configuration? will it ever change?

        // draw face
        this.p5.beginShape();
        this.p5.vertex(pose[8*4], pose[8*4+1]);
        this.p5.vertex(pose[6*4], pose[6*4+1]);
        this.p5.vertex(pose[5*4], pose[5*4+1]);
        this.p5.vertex(pose[4*4], pose[4*4+1]);
        this.p5.vertex(pose[0*4], pose[0*4+1]);
        this.p5.vertex(pose[1*4], pose[1*4+1]);
        this.p5.vertex(pose[2*4], pose[2*4+1]);
        this.p5.vertex(pose[3*4], pose[3*4+1]);
        this.p5.vertex(pose[7*4], pose[7*4+1]);
        this.p5.vertex(pose[9*4], pose[9*4+1]);
        this.p5.vertex(pose[10*4], pose[10*4+1]);
        this.p5.endShape(this.p5.CLOSE);

        // draw right arm
        this.p5.beginShape();
        this.p5.vertex(pose[22*4], pose[22*4+1]);
        this.p5.vertex(pose[16*4], pose[16*4+1]);
        this.p5.vertex(pose[20*4], pose[20*4+1]);
        this.p5.vertex(pose[18*4], pose[18*4+1]);
        this.p5.vertex(pose[16*4], pose[16*4+1]);
        this.p5.vertex(pose[14*4], pose[14*4+1]);
        this.p5.vertex(pose[12*4], pose[12*4+1]);
        this.p5.endShape();
        
        // draw left arm
        this.p5.beginShape();
        this.p5.vertex(pose[21*4], pose[21*4+1]);
        this.p5.vertex(pose[15*4], pose[15*4+1]);
        this.p5.vertex(pose[19*4], pose[19*4+1]);
        this.p5.vertex(pose[17*4], pose[17*4+1]);
        this.p5.vertex(pose[15*4], pose[15*4+1]);
        this.p5.vertex(pose[13*4], pose[13*4+1]);
        this.p5.vertex(pose[11*4], pose[11*4+1]);
        this.p5.endShape();

        // torso
        this.p5.beginShape();
        this.p5.vertex(pose[12*4], pose[12*4+1]);
        this.p5.vertex(pose[11*4], pose[11*4+1]);
        this.p5.vertex(pose[23*4], pose[23*4+1]);
        this.p5.vertex(pose[24*4], pose[24*4+1]);
        this.p5.endShape(this.p5.CLOSE);

        // left leg
        this.p5.beginShape();
        this.p5.vertex(pose[23*4], pose[23*4+1]);
        this.p5.vertex(pose[25*4], pose[25*4+1]);
        this.p5.vertex(pose[27*4], pose[27*4+1]);
        this.p5.vertex(pose[29*4], pose[29*4+1]);
        this.p5.vertex(pose[31*4], pose[31*4+1]);
        this.p5.vertex(pose[27*4], pose[27*4+1]);
        this.p5.endShape();

        // right leg
        this.p5.beginShape();
        this.p5.vertex(pose[24*4], pose[24*4+1]);
        this.p5.vertex(pose[26*4], pose[26*4+1]);
        this.p5.vertex(pose[28*4], pose[28*4+1]);
        this.p5.vertex(pose[30*4], pose[30*4+1]);
        this.p5.vertex(pose[32*4], pose[32*4+1]);
        this.p5.vertex(pose[28*4], pose[28*4+1]);
        this.p5.endShape();
    }

}