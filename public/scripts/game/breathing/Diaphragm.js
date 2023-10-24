import GameObject from "../../core/GameObject/GameObject.js";

/** An GameObject that provides a target rate for breathing. 
 * I suspect we will add a lot more to the player avatar, so I'm not going crazy with the design right now.
 * This is more to give an example of how to make a game object that tracks breath.
*/
export default class Diaphragm extends GameObject{

    skeleton;
    style = {
		stroke: this.p5.color(255, 223, 0),
        emptyColor: this.p5.color(123, 234, 100),
        fullColor: this.p5.color(3, 80, 150),
		strokeWeight: 2,
        ellipseWidth: 50,
        ellipseHeight: 50
	};
    // Note: I just ran with the existing color scheme for now;
    // Bone color: this.p5.color(123, 234, 100),
    // Center color: this.p5.color(255, 223, 0),
    // Target color: this.p5.color(3, 80, 150, 127),

    /** @constructor  creates a breathing diaphragm around the center of mass.
     * @param {Skeleton} skeleton The diaphram uses a reference 
     * @param {Object} style a configuration object which overrides the Diaphragm's default appearance
     * @param {Color} style.stroke stroke color
     * @param {Color} style.emptyColor the color of the diaphragm when it is empty
     * @param {Color} style.fullColor the color of the diaphragm when it is full
     * etc.
    */
    constructor(skeleton, style){
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);
        this.skeleton = skeleton;
        // technically I could do;
        //this.skeleton = this.gameSession.skeleton.centerOfMass.getPosition();
        // however I like the dependency being explicit. not sure what's right.

        // if the user supplies a configuration object, overwrite our configuration with the fields the user provided.
        if(style)
            Object.assign(this.style, style);
    }

    update() {
        // we're just going to crib the position of the center of mass on render...

        // note: somewhat counterintuitively, we wouldn't want to update the position now.
        // because we have no idea whether this updates before or after the C.o.M.
        // that is up to the game state implementation.
    }

    /** Render a circle that vacillates in size and color in time with the breath meter */
    render(){
        // figure out the diaphragm's size, location and color
        let p = this.skeleton.centerOfMass.position;
        let value = this.gameSession.breathingManager.breath;
        let size = this.style.ellipseHeight * (1+value);
        let color = this.p5.lerpColor(this.style.emptyColor, this.style.fullColor, value);

        // set the p5 state and draw the diaphragm
        this.p5.stroke(this.style.stroke);
		this.p5.strokeWeight(this.style.strokeWeight);
        this.p5.fill( color );
		this.p5.ellipse( p.x, p.y, size, size );
    }

}