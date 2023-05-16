import VectorGameObject from "../../core/VectorGameObject.js";

//TODO: CALIBRATION: How do we choose appropriate relative placement of target from center of mass?

export default class Target extends VectorGameObject {

	//indicates if the target hit conditions are currently filled.
	targetHit = false;
	
	//point we'll use for rendering - RELATIVE FROM COM?!
	x = 0;
	y = 0;

	//absolute values used for global comparisons
	absoluteX = 0;
	absoluteY = 0;

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
		hitFill: this.p5.color(255, 215, 0),
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
	checkTargetHit(){
		let inTarget = false;
		//see if requiredBone is assigned
		if(this.requiredBone){
			//get start/end point from vertices
			inTarget = 
				this.inTarget(
					this.requiredBone.vertices[0].x, 
					this.requiredBone.vertices[0].y
				) || 
				this.inTarget(
					this.requiredBone.vertices[1].x, 
					this.requiredBone.vertices[1].y
				)
			;
			//what is the bone name?
			//what is the bone coordinates?
			//are those coordinates in target?
		} else {
			console.log("Bone initialization error.");
		}

		return inTarget;
	}

	// Return true if (x, y) is within the target radius, false otherwise.
	inTarget(x, y) {
		let r2 = Math.pow(this.style.radius, 2);
		let pointInTarget = Math.pow(x - this.absoluteX, 2) + Math.pow(y - this.absoluteY, 2) < r2;
		return pointInTarget;
	}

	update(){
		this.targetHit = this.checkTargetHit();
	}

	render(){
		if(this.skeleton.centerOfMass){
			this.p5.push();
			this.p5.stroke(this.style.stroke);
			this.p5.strokeWeight(this.style.strokeWeight);
			if(this.targetHit){
				this.p5.fill(this.style.hitFill);
			} else {
				this.p5.fill(this.style.fill);
			}
			//render relative to center of mass
			this.absoluteX = this.x + this.skeleton.centerOfMass.x;
			this.absoluteY = this.y + this.skeleton.centerOfMass.y;
			this.p5.ellipse(this.absoluteX, this.absoluteY, this.style.radius);
			this.p5.pop();
		}

	}

	//TODO: Resize and make sizing screen-size scaled
}
