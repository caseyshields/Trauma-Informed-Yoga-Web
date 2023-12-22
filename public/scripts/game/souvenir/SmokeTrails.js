import GameSession from "../GameSession.js";

const MaxParticles = 50;

/** Different parts of the pose emit smoke of different hues in time with breath */
export default class Smoke {

    
    static Default = [
        {index:0, small:16, large:32, fuzz:4, empty:[25,150,25,5], full:[100,100,100,1]},
        {index:20, small:16, large:32, fuzz:4, empty:[150,0,25,5], full:[100,100,100,1]},
        {index:19, small:16, large:32, fuzz:4, empty:[25,0,150,5], full:[100,100,100,1]}
    ]; // TODO trying to use a format that is easily compatible with JSON config files..
    
    /** @constructor 
     * @param {Trail[]} config An array  of smoke trail configurations
     * @param {Number} Trail.index index of a pose landmark in the current filtered GameSession pose
     * @param {Number} Trail.small size of smoke when breath is empty
     * @param {Number} Trail.large size of smoke when breath is full
     * @param {Number} Trail.fuzz amount to randomly perturb smoke
     * @param {Number[]} Trail.empty The rgb(a) color channels of the smoke when breath is empty
     * @param {Number[]} Trail.full The rgb(a) color channels of the smoke when breath is full
    */
    constructor( config = Smoke.Default ) {
        this._session = new GameSession();

        // create a separate graphics context where we render the smoke
        this._g = this._session.p5.createGraphics(
            this._session.canvasWidth, 
            this._session.canvasHeight);

        // set emitter configuration, elaborate on some raw color values
        this._trails = config;
        for(let t of this._trails) {
            t.empty = this._g.color(...t.empty);
            t.full = this._g.color(...t.full);
        }
    }

    // TODO handle resize events by resizing our graphics context too!

    /** Blend smoke trails into an offscreen buffer then draw it into the main context*/
    render() {
        // this._g.background(0,0,0,5);

        // general state machine styling
        this._g.noStroke();
        // this._g.blendMode(this._g.SCREEN); // BLEND // DIFFERENCE

        // for each valid configured pose landmark
        for(let e of this._trails) {
            let mark = this._session.pose.state[e.index];
            if (mark) {

                // set the color and size for the emitter using current breath volume
                let c = this._g.lerpColor(e.empty, e.full, this._session.breathingManager.breath);
                let d = e.small + (1-this._session.breathingManager.breath)*(e.large-e.small)
                this._g.fill(c);

                // draw a path of circles whose density is roughly proportional to the velocity
                let v = this._g.mag(mark.vx, mark.vy);
                if (v > MaxParticles) 
                    v = MaxParticles;
                for (let n=v; n>0; n--) {
                    let r = n/v
                    let x = mark.x - r*mark.vx + Math.random()*e.fuzz;
                    let y = mark.y - r*mark.vy + Math.random()*e.fuzz;
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

    /** 
     * @returns {Trail[]} an array of current smoke trial properties */
    get trails() {return this._trails;}
    // TODO is this sufficient for updating in-game? for example;
    // smoke.trail[2].fuzz = 8;

}
