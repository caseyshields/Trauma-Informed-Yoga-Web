import GameSession from "../GameSession.js"; 

/** Different parts of the pose emit different hues, modified by breath
 * note: will have all the same architectural problems discussed in BodyTrace.
 */
export default class HandPath {

    // records the pose of the last frame
    posed = [];

    constructor() {
        this.session = new GameSession();
        this.p5 = this.session.p5
        this.w = this.session.canvasWidth;
        this.h = this.session.canvasHeight;
        this.g = this.p5.createGraphics(this.w,this.h);

        // style parameters
        this.thickness = 25;
        this.randomness = 5;
        this.transparent = this.p5.color(0,0,0,0);
        this.emitters = [
            {index:0, full:this.p5.color(25,150,25,5), empty:this.p5.color(25,150,25,1)},
            {index:20, full:this.p5.color(150,0,25,5), empty:this.p5.color(150,0,25,1)},
            {index:19, full:this.p5.color(25,0,150,5), empty:this.p5.color(25,0,150,1)}
        ];
    }

    update() {
        
    }

    /** */
    render() {
        // this.g.background(0,0,0,5);

        // skip first render so we can get a velocity
        if (this.posed.length) {

            this.g.noStroke();
            // this.g.blendMode(this.g.BLEND);
            // this.g.blendMode(this.g.DIFFERENCE);
            this.g.blendMode(this.g.SCREEN);

            for(let e of this.emitters)
                if (this.posed[e.index] && this.session.poseLandmarks[e.index]) {

                    // set the color for the emitter using breath
                    let c = this.g.lerpColor(e.empty, e.full, this.session.breathingManager.breath);
                    this.g.fill(c);

                    // determine velocity between frames
                    let vx = this.posed[e.index].x - this.session.poseLandmarks[e.index].x;
                    let vy = this.posed[e.index].y - this.session.poseLandmarks[e.index].y;
                    let v = Math.sqrt((vx*vx)+(vy*vy));
                    // TODO we should record more points so we can smoothly adjust emitter size...

                    // draw a path of circles
                    for (let t=v; t>0; t--) {
                        let r = t/v//this.thickness;
                        let s = 1 - r;
                        let x = r*this.posed[e.index].x + s*this.session.poseLandmarks[e.index].x;
                        let y = r*this.posed[e.index].y + s*this.session.poseLandmarks[e.index].y;
                        let dx = Math.random()*this.randomness;
                        let dy = Math.random()*this.randomness;
                        this.g.circle(x+dx,y+dy,this.thickness);
                    }
                }

            // draw it to the screen and return blend mode to normal
            this.p5.image(this.g, this.w/2, this.h/2);
            this.g.blendMode(this.g.BLEND);
        }

        // save previous pose
        for (let n=0; n<this.session.poseLandmarks.length; n++) {
            this.posed[n] = {};
            this.posed[n].x = this.session.poseLandmarks[n].x;
            this.posed[n].y = this.session.poseLandmarks[n].y;
            this.posed[n].z = this.session.poseLandmarks[n].z;
            this.posed[n].score = this.session.poseLandmarks[n].score;
        }
    }

    // TODO handle resize!

}
