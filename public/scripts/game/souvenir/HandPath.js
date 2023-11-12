import GameSession from "../GameSession.js"; 

/** Different parts of the pose emit different hues, modified by breath */
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
        this.emitters = [
            {index:0, small:16, large:32, randomness:4,
                empty:this.p5.color(25,150,25,5), full:this.p5.color(100,100,100,1)},
            {index:20, small:16, large:32, randomness:4,
                empty:this.p5.color(150,0,25,5), full:this.p5.color(100,100,100,1)},
            {index:19, small:16, large:32, randomness:4,
                empty:this.p5.color(25,0,150,5), full:this.p5.color(100,100,100,1)}
        ];
    }

    update() {
        
    }

    /** */
    render() {
        // this.g.background(0,0,0,5);

        // general state machine styling
        this.g.noStroke();
        this.g.blendMode(this.g.SCREEN); // BLEND // DIFFERENCE

        // for each valid configured pose landmark
        for(let e of this.emitters) {
            let mark = this.session.pose.state[e.index];
            if (mark) {

                // set the color and size for the emitter using current breath volume
                let c = this.g.lerpColor(e.empty, e.full, this.session.breathingManager.breath);
                let d = e.small + (1-this.session.breathingManager.breath)*(e.large-e.small)
                this.g.fill(c);

                // draw a path of circles whose density is proportional to the velocity
                let v = this.g.mag(mark.vx, mark.vy);
                for (let t=v; t>0; t--) {
                    let r = t/v
                    let x = mark.x - r*mark.vx + Math.random()*e.randomness;
                    let y = mark.y - r*mark.vy + Math.random()*e.randomness;
                    this.g.circle(x, y, d);
                }
            }
        }

        // draw it to the screen
        this.p5.image(this.g, this.w/2, this.h/2);
    }

    // TODO handle resize!
}
