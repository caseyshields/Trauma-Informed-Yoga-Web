import GameObject from "../../core/GameObject/GameObject.js";

export default class Diaphragm extends GameObject{
    
    skeleton;
    style = {
		stroke: this.p5.color(255, 223, 0),
        emptyColor: this.p5.color(0,128,64,255),
        fullColor: this.p5.color(0,255,255, 128),
		strokeWeight: 2,
        ellipseWidth: 50,
        ellipseHeight: 50
	};

    /** @constructor  creates a breathing diaphragm around the center of mass.
     * @param {Skeleton} skeleton
     * 
    */
    constructor(skeleton, style){
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);
        this.skeleton = skeleton;
        if(style)
            this.style = style;
    }

    update() {
        // we're just going to crib the C.o.M. of the Skeleton...
    }

    /** Render a circle that vacillates in size and color with the breath meter */
    render(){
        let p = this.skeleton.centerOfMass.position;
        let value = this.gameSession.breathingManager.breath;
        let size = this.style.ellipseHeight * (1+value);

        this.p5.stroke(this.style.stroke);
		this.p5.strokeWeight(this.style.strokeWeight);
        this.p5.fill( this.p5.lerpColor(
            this.style.emptyColor, 
            this.style.fullColor, 
            value));

		this.p5.ellipse( p.x, p.y, size, size );
    }

}