// Particle.js for vector particles 
// (we don't have a provision for bitmap particles)


import GameSession from "../../GameSession.js";
import VectorGameObject from "../../VectorGameObject.js";


export default class VectorParticle2 extends VectorGameObject {

    constructor(shape, duration, size, position, rotationSpeed, startVelocity, strokeWeight,fill,fade, particleVertices) {

        if (size === null) {
            size = 1;
        }
        if (particleVertices === null) {
            particleVertices = [
                { x: -size, y: size },
                { x: size, y: size },
                { x: size, y: -size },
                { x: -size, y: -size },
            ];
        }

        super(position.x, position.y, particleVertices, true, strokeWeight, fill, 0, 1, 255, shape);

        this.__gameSession = new GameSession;

        // set up time manager, and record start time
        this.__timeManager = this.__gameSession.timeManager;
        this.__startTime = this.__timeManager.time;

        // duration in milliseconds
        this.__duration = duration;

        // velocity is pixels/second, rotation is rotations (2pi radians)/sec

        startVelocity.mult(.005); // velocity is very large, needs to be scaled
        this.__velocity = startVelocity;
        this.__rotationSpeed = rotationSpeed * .005;
        this.__fade = fade;

        // acceleration vector
        this.__accelerationVector = this.p5.createVector(0, 0);

    }

    finished() {
        return (this.__timeManager.time - this.__startTime) >= this.__duration;
    }

    // something like gravity can change acceleration of particles in runtime
    applyForce(force) {
        this.__accelerationVector = force;
    }

    update() {

        // this changes the velocity by acceleration vector
        this.velocity.add(this.__accelerationVector);

        // this is for calculating deltaDistance using mult(), but not changing the original velocity
        let tmpVelocity = this.p5.createVector(this.velocity.x, this.velocity.y);
        let deltaDistance = tmpVelocity.mult(this.gameSession.timeManager.deltaTime);

        console.log
        
        this.position.add(deltaDistance);

        this.rotation += (this.rotationSpeed * this.gameSession.timeManager.deltaTime);

        if( this.fade === true) {
            let fadePercent = (this.__timeManager.time - this.__startTime) / this.__duration; 
            this.alpha = 255 - (255 * fadePercent);
        }

        //note that unlike other objects, particles do not wrap
        //super.wrap();

    }

    get gameSession() {
        return this.__gameSession;
    }

    get velocity() {
        return this.__velocity;
    }

    get rotationSpeed() {
        return this.__rotationSpeed;
    }

    get position() {
        return this.__position;
    }

    get rotation() {
        return this.__rotation;
    }

    set rotation(rotation) {
        this.__rotation = rotation;
    }

    get fade() {
        return this.__fade;
    }

}