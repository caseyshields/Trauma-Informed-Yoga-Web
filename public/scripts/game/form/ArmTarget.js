import Target from "./Target.js";
//extends target to be specific to targets reached by an outstretched arm
//uses a constructor for angle to understand when/where to render target

export default class ArmTarget extends Target {

    constructor(

		angleFromCenterOfMass = 0, 
		radius = 100, 
		requiredBone = {}, 
		goalHoldDuration = 1000, 
		isConsecutive = false, 
		skeleton= {}
	) {
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

        this.angleFromCenterOfMass = angleFromCenterOfMass;
		this.x = 0;
		this.y = 0;
		this.style.radius = radius;
		this.goalHoldDuration = goalHoldDuration;
		this.requiredBone = requiredBone;
		this.isConsecutive = isConsecutive;
		this.skeleton = skeleton;

	}

    //update - update x and y to match armLength
	update(){
        this.x = Math.cos(this.angleFromCenterOfMass * Math.PI/180) * this.gameSession.skeleton.armLength;
        this.y = Math.sin(this.angleFromCenterOfMass * Math.PI/180) * this.gameSession.skeleton.armLength; 


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

		//trigger target hit
		if(this.targetHit){
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

	}

    //render - render at updated length

}