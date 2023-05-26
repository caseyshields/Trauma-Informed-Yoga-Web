import Manager from "../../Manager/Manager.js";
import Particle from "./Particle.js";
/** manages all particles on screen to prevent
 * 
 */

export default class ParticleManager extends Manager {

    //contains all particles
    particlePool = [];

    constructor() {
        super();
    }

    setup() {}

    update() {
        //update pool based on particle completion.
        for(let i = this.particlePool.length-1; i >= 0; i--){
            this.particlePool[i].update();
            if(this.particlePool[i].completed){
                this.particlePool.splice(i,1);
            }
        }
    }

    render() {
        for(let i = this.particlePool.length-1; i >= 0; i--){
            this.particlePool[i].render();
        }
    }

    //creates a particle based on passed-in settings, otherwise creates a default particle.
    //returns a reference to the particle being created.
    createParticle(particleSettings) {
        if(particleSettings){
            let style = {
                stroke: particleSettings.style.stroke,
                fill: particleSettings.style.fill,
                alpha: particleSettings.style.alpha,
                strokeWeight: particleSettings.style.strokeWeight
            };

            let newParticle = new Particle(
                particleSettings.startingX,
                particleSettings.startingY,
                particleSettings.radius,
                particleSettings.isRotating,
                particleSettings.rotationRate,
                particleSettings.duration,
                particleSettings.velocityX,
                particleSettings.velocityY,
                particleSettings.accelX,
                particleSettings.accelY,
                particleSettings.shape,
                style
            );

            this.particlePool.push(newParticle);
        } else {
            console.log("TODO: default particle creation.");
        }

    }

}