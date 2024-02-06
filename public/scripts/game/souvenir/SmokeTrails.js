import GameSession from "../GameSession.js";

const MaxParticles = 50;
const landmarks = [
    'nose',
    'left eye (inner)',
    'left eye',
    'left eye (outer)',
    'right eye (inner)',
    'right eye',
    'right eye (outer)',
    'left ear',
    'right ear',
    'mouth (left)',
    'mouth (right)',
    'left shoulder',
    'right shoulder',
    'left elbow',
    'right elbow',
    'left wrist',
    'right wrist',
    'left pinky',
    'right pinky',
    'left index',
    'right index',
    'left thumb',
    'right thumb',
    'left hip',
    'right hip',
    'left knee',
    'right knee',
    'left ankle',
    'right ankle',
    'left heel',
    'right heel',
    'left foot index',
    'right foot index'
];

/** Different parts of the pose emit smoke of different hues in time with breath */
export default class Smoke {
    
    // TODO handle resize events by resizing our graphics context too!

    /** @constructor 
     * @param {Trail[]} settings An array  of smoke trail configurations
     * @param {Number} Trail.index index of a pose landmark in the current filtered GameSession pose
     * @param {Number} Trail.small size of smoke when breath is empty
     * @param {Number} Trail.large size of smoke when breath is full
     * @param {Number} Trail.fuzz amount to randomly perturb smoke
     * @param {Number[]} Trail.empty The rgb(a) color channels of the smoke when breath is empty
     * @param {Number[]} Trail.full The rgb(a) color channels of the smoke when breath is full
    */
    constructor( ) {
        // TODO config values in constructor args...
        this._session = new GameSession();

        // create a separate graphics context where we render the smoke
        this._g = this._session.p5.createGraphics(
            this._session.canvasWidth, 
            this._session.canvasHeight);

        let config = this._session.settingsManager.register('SmokeTrails', this);
        config.addSelect('landmark_1', landmarks, 'nose');
        config.addRange('exhale_size_1', 0, 64, 16);
        config.addRange('inhale_size_1', 0, 64, 32);
        config.addRange('fuzz_1', 0, 32, 4);
        config.addColor('exhale_color_1', '#199619');
        config.addColor('inhale_color_1', '#646464');
        config.addRange('exhale_opacity_1', 0, 255, 4);
        config.addRange('inhale_opacity_1', 0, 255, 4);
        
        config.addSelect('landmark_2', landmarks, 'left wrist');
        config.addRange('exhale_size_2', 0, 64, 16);
        config.addRange('inhale_size_2', 0, 64, 32);
        config.addRange('fuzz_2', 0, 32, 4);
        config.addColor('exhale_color_2', '#960019');
        config.addColor('inhale_color_2', '#646464');
        config.addRange('exhale_opacity_2', 0, 255, 4);
        config.addRange('inhale_opacity_2', 0, 255, 4);
        
        config.addSelect('landmark_3', landmarks, 'right wrist');
        config.addRange('exhale_size_3', 0, 64, 16);
        config.addRange('inhale_size_3', 0, 64, 32);
        config.addRange('fuzz_3', 0, 32, 4);
        config.addColor('exhale_color_3', '#190096');
        config.addColor('inhale_color_3', '#646464');
        config.addRange('exhale_opacity_3', 0, 255, 4);
        config.addRange('inhale_opacity_3', 0, 255, 4);
        // TODO we should probably just make this a singular smoke trail and add three to the game...
    
    }

    /** Blend smoke trails into an offscreen buffer then draw it into the main context*/
    render() {
        // this._g.background(0,0,0,5);

        // general state machine styling
        this._g.noStroke();
        // this._g.blendMode(this._g.SCREEN); // BLEND // DIFFERENCE
        // NOTE: enabling blend mode appears to be VERY expensive on some platforms...

        // for each valid configured pose landmark
        for(let i of [1,2,3]) {
            
            // find the emitter's landmark's index
            // let index = landmarks.indexOf(e.landmark.value);
            let index = landmarks.indexOf( this['landmark_'+i] );
            if (index==-1)
                continue;

            // lookup the corresponding filtered landmark
            let mark = this._session.pose.state[index];
            if (mark) {

                // set the color and size for the emitter using current breath volume
                let empty = this._g.color(this['exhale_color_'+i]);
                empty.setAlpha(this['exhale_opacity_'+i]);
                let full = this._g.color(this['inhale_color_'+i]);
                full.setAlpha( this['inhale_opacity_'+i]);
                let c = this._g.lerpColor(empty, full, this._session.breathingManager.breath);
                let d = this['exhale_size_'+i] + (1-this._session.breathingManager.breath)
                        * (this['inhale_size_'+i] - this['exhale_size_'+i]);
                this._g.fill(c);

                // draw a path of circles whose density is roughly proportional to the velocity
                let v = this._g.mag(mark.vx, mark.vy);
                if (v > MaxParticles) 
                    v = MaxParticles;

                for (let n=v; n>0; n--) {
                    let r = n/v
                    let fuzz = this['fuzz_'+i];
                    let x = mark.x - r*mark.vx + Math.random()*fuzz;
                    let y = mark.y - r*mark.vy + Math.random()*fuzz;
                    this._g.circle(x, y, d);
                }
            }
        }

        // draw it to the screen
        this._session.p5.image( this._g, 
            this._session.canvasWidth/2, 
            this._session.canvasHeight/2);
    }
    // TODO should this class even render? should it just expose an image?
    // I ask because just overlaying the image might not be what we want every time;
    // what if we want to use alpha masks and composite or something?

}
