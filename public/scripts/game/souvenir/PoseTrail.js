
import GameSession from "../../game/GameSession.js"; 

// I'd like to use the particle system and set initial velocity by the pose velocity. Maybe affect gravity by avatar position? Generate particles on accelerations.
// Have it all draw in a cumulative image like with the motion blur.
// Actually I think people would enjoy playing with that...
// The particles have to be jury rigged to draw in an arbitrary graphics context and I worry discrete differentiation might be noisy without smoothing...

/** just hacking out some image technique that produces a better cumulative image...
 * Basically will have all the same architectural problems discussed in BodyTrace.
 */
export default class PoseTrail {

    maxVelocity = 0;
    posed = [];

    constructor() {
        this.session = new GameSession();
        this.p5 = this.session.p5
        this.color = this.p5.color(0, 255, 255, 16);
        this.emptyColor = this.p5.color(123, 234, 100),
        this.fullColor = this.p5.color(3, 80, 150, 127),
        this.w = this.session.canvasWidth;
        this.h = this.session.canvasHeight;
        this.g = this.p5.createGraphics(this.w,this.h);
        // for(let n=0; n<32; n++)
        //     this.posed[n] = {x,y,z,score};
    }

    update() {
        
    }

    /** */
    render() {

        // skip first render so we can get a velocity
        if (this.posed.length) {

            // for each pose estimation
            for (let n=0; n<this.session.poseLandmarks.length; n++) { // TODO maybe just hands?
                
                // determine velocity between frames
                let vx = this.posed[n].x - this.session.poseLandmarks[n].x;
                let vy = this.posed[n].y - this.session.poseLandmarks[n].y;
                let v = Math.sqrt((vx*vx)+(vy*vy));

                // totally ignoring estimation confidence problems right now.

                // track max velocity on the screen right now?
                // use exponential filter to scale screen effects?

                // draw a circle at the estimate, whose radius is proportional to the velocity.
                // this.g.strokeWeight(0);
                // this.g.fill(this.color);
                // this.g.ellipse(this.session.poseLandmarks[n].x, 
                //     this.session.poseLandmarks[n].y,v);

                this.g.strokeWeight(v/2);
                let c = this.p5.lerpColor(this.emptyColor, this.fullColor, this.session.breathingManager.breath);
                this.g.stroke(c);
                this.g.line(this.posed[n].x, this.posed[n].y, 
                    this.session.poseLandmarks[n].x, this.session.poseLandmarks[n].y);
            }
            
            // draw it to the screen
            this.p5.image(this.g, this.w/2, this.h/2);
        }

        // save previous poses
        for (let n=0; n<this.session.poseLandmarks.length; n++) {
            this.posed[n] = {};
            this.posed[n].x = this.session.poseLandmarks[n].x;
            this.posed[n].y = this.session.poseLandmarks[n].y;
            this.posed[n].z = this.session.poseLandmarks[n].z;
            this.posed[n].score = this.session.poseLandmarks[n].score;
        }
    }

    // TODO handle resize!

    midpoint(p1, p2) {
        return [(p1.x+p2.x)/2, (p1.y+p2.y)/2];
    }
}