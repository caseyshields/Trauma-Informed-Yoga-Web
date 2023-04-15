import VectorGameObject from "../core/VectorGameObject.js";

//TODO: CALIBRATION: How do we choose appropriate relative placement of target from center of mass?

export default class Target extends VectorGameObject {
	
	//point we'll use for rendering - RELATIVE FROM COM?!
	x = 0;
	y = 0;

	//reference to skeleton for easier management
	skeleton = {};

	//options
	requiredBone = {}; //if not null, require a specific bone or set of bones to be in target
	duration = 10; //in seconds, how long the target needs to be filled
	isCumulative = false; //if true, leaving target does not reset counter
	
	//used for managing how long the target has been filled
	counter = 0;

	//width/height of target
	style = {
		stroke: this.p5.color(3, 80, 150),
        fill: this.p5.color(3, 80, 150, 127),
		strokeWeight: 2,
        radius: 100
	};

	constructor(x, y, radius, requiredBone, duration, isCumulative, skeleton) {
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		this.x = x;
		this.y = y;
		this.style.radius = radius;
		this.duration = duration;
		this.requiredBone = requiredBone;
		this.isCumulative = isCumulative;
		this.skeleton = skeleton;

	}

	// Check if target has relevant bone within bounds
	checkTarget(){
		//see if requiredBone is assigned
		if(this.requiredBone){
			//get start/end point from vertices
			let inTarget = false;
			//what is the bone name?
			//what is the bone coordinates?
			//are those coordinates in target?
		} else {
			return false;
		}
	}

	// Return true if (x, y) is within the target radius, false otherwise.
	inTarget(x, y) {
		const r2 = Math.pow(this.style.radius, 2);
		const inside = Math.pow(x - this.pos.x, 2) + (y - this.pos.y, 2) < r2;
		return inside;
	}

	update(){

	}

	render(){
		if(this.skeleton.centerOfMass){
			this.p5.stroke(this.style.stroke);
			this.p5.strokeWeight(this.style.strokeWeight);
			//render relative to center of mass
			this.p5.ellipse(this.x + this.skeleton.centerOfMass.x, this.y + this.skeleton.centerOfMass.y, this.style.radius);
		}

	}
}
