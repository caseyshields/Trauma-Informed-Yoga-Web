import Particle from "../../core/GameObject/Particle/Particle.js";
import VectorGameObject from "../../core/GameObject/VectorGameObject.js";

//TODO: CALIBRATION: How do we choose appropriate relative placement of target from center of mass?

export default class Target extends VectorGameObject {

	//indicates if the target hit conditions are currently filled.
	targetHit = false;

	//indicates if the set target goals are completed
	targetComplete = false;

	//timer used to measure interaction
	targetHitTimeStart = 0;
	targetHitTimerRunning = false;
	
	//point we'll use for rendering - RELATIVE FROM COM?!
	x = 0;
	y = 0;

	//absolute values used for global comparisons
	absoluteX = 0;
	absoluteY = 0;

	//reference to skeleton for easier management
	skeleton = {};

	//particle test
	particleTest;

	//options

	//TODO: multiple required bones, or any bone
	requiredBone; //if not null, require a specific bone or set of bones to be in target
	goalHoldDuration; //in milliseconds, how long the target needs to be filled
	runningHoldDuration = 0; //in milliseconds, how close the target is to being fulfilled
	isConsecutive; //if true, leaving target resets timer
	cumulativeHoldDuration = 0;

	//width/height of target
	style = {
		stroke: this.p5.color(3, 80, 150),
        fill: this.p5.color(3, 80, 150, 127),
		hitFill: this.p5.color(255, 215, 0),
		completeFill: this.p5.color(123, 234, 100),
		strokeWeight: 2,
        radius: 100
	};

	constructor(
		x = 0, 
		y = 0, 
		radius = 100, 
		requiredBone = {}, 
		goalHoldDuration = 1000, 
		isConsecutive = false, 
		skeleton= {}
	) {
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		this.x = x;
		this.y = y;
		this.style.radius = radius;
		this.goalHoldDuration = goalHoldDuration;
		this.requiredBone = requiredBone;
		this.isConsecutive = isConsecutive;
		this.skeleton = skeleton;

	}

	particleSettings = {
		startingX : 0,
		startingY : 0,
		radius : 50,
		isRotating : false,
		rotationRate : 0,
		duration : 3000,
		velocityX : 1,
		velocityY : 1,
		accelX : 0,
		accelY : .01,
		shape : "CIRCLE",
		style : {
			stroke: this.p5.color(0, 0, 0),
			fill: this.p5.color(200, 200, 200),
			alpha: 1,
			strokeWeight: 1
		}
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
			
		} else {
			console.log("Bone initialization error.");
		}

		//trigger target hit
		if(inTarget){
			//TODO: determine velocity and acceleration based on hand hitting
			this.particleSettings.startingX = this.absoluteX;
			this.particleSettings.startingY = this.absoluteY;
			//pick random velocity
			this.particleSettings.velocityX = this.p5.random(-5, 5);
			this.particleSettings.velocityY = this.p5.random(-5, 5);
			//pick random accelerations
			this.particleSettings.accelX = this.p5.random(-.5, .5);
			this.particleSettings.accelY = this.p5.random(-.5, .5);
			//pick random colors
			this.particleSettings.style.fill = this.p5.color(this.p5.random(0,255),this.p5.random(0,255),this.p5.random(0,255));
			this.particleSettings.style.stroke = this.p5.color(this.p5.random(0,255),this.p5.random(0,255),this.p5.random(0,255));

			this.gameSession.particleManager.createParticle(this.particleSettings);

			this.gameSession.soundManager.sparkleSound.trigger();
			
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
		//confirm if target is hit.
		this.targetHit = this.checkTargetHit();
		//if hit, see if how our completion objectives are
		if(this.targetHit && !this.targetComplete){
			//check if we have a start time recorded.
			if(this.targetHitTimerRunning){
				//update running duration with current time
				this.runningHoldDuration = Date.now() - this.targetHitTimeStart;
				
				//check for completion
				if(this.isConsecutive){
					//only check running
					this.targetComplete = this.runningHoldDuration >= this.goalHoldDuration;
				} else {
					//check running plus past timers
					this.targetComplete = (this.cumulativeHoldDuration + this.runningHoldDuration) >= this.goalHoldDuration;
				}
			} else {
				//start a timer if we don't have one
				this.targetHitTimeStart = Date.now();
				this.targetHitTimerRunning = true;
			}
		} else {
			if(!this.isConsecutive){
				//add current timer to cumulative hold
				this.cumulativeHoldDuration += this.runningHoldDuration;
			}
			//reset timer
			this.runningHoldDuration = 0;
			this.targetHitTimerRunning = false;
		}
			
	}

	render(){
		if(this.skeleton.centerOfMass){
			this.p5.push();
			this.p5.stroke(this.style.stroke);
			this.p5.strokeWeight(this.style.strokeWeight);
			if(this.targetComplete){
				this.p5.fill(this.style.completeFill);
			} else if(this.targetHit){
				this.p5.fill(this.p5.lerpColor(this.style.hitFill, this.style.completeFill, (this.cumulativeHoldDuration + this.runningHoldDuration)/this.goalHoldDuration));
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
