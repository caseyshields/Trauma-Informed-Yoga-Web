

import GameSession from "../../GameSession.js";
import VectorParticle2 from "./VectorParticle2.js";



export default class VectorParticleEffect {

    constructor(effectParameters, triggerObject) {

        //a particle effect gets an X/Y; its duration is based on
        //the lifespan of the actual particles

        this.__gameSession = new GameSession;

        this.__particles = new Array();

        this.__positionVector = this.__gameSession.p5.createVector(triggerObject.position.x,triggerObject.position.y);

        this.initiateEffect(effectParameters);

    }

    finished() {
        if( this.particles.length <= 1 ) { 
            return true;
        }
        else {
            return false;
        }
    }

    update() {

        for(let i = this.particles.length - 1; i >=0; i-- ){
            if(this.particles[i].finished()){
                this.particles.splice(i, 1);
            }
            else{
                this.particles[i].update();
            }
        }

    }

    render() {
        
        for(let i = this.particles.length - 1; i >=0; i-- ){
            this.particles[i].render();
        }

    }

    initiateEffect( effectParameters ) {

        let count = effectParameters.vectorParticle.count;

        for(let i=0; i<count; i++ ) {
            let tempObject = this.spawnParticle(effectParameters,i);
            this.particles.push(tempObject);
        }

    }


    spawnParticle( effectParameters, particleIndex ) {

        let size = effectParameters.vectorParticle.size;
        let shape = effectParameters.vectorParticle.shape;
        let particleVertices;
        
        switch( shape ) {
            case "square":
                particleVertices = [
                    { x: -size, y: size },
                    { x: size, y: size },
                    { x: size, y: -size },
                    { x: -size, y: -size },
                ];
            break;
            case "triangle" : 
                particleVertices = [
                    { x: -size, y: size/2 },
                    { x: size, y: size/2},
                    { x: 0, y: -size}
                ];
            break;
            case "line" : 
                particleVertices = [
                    { x: -size, y: size/2 },
                    { x: size, y: size/2},
                ];
            break;
            default: 
                particleVertices = [
                    {x:0, y:0},
                    {x:0, y:1},
                    {x:1, y:1},
                    {x:1, y:0}
                ];
        }

        let rotationSpeed = effectParameters.vectorParticle.rotationSpeed;
        if( effectParameters.vectorParticle.rotation === "random" ) {
            rotationSpeed = (Math.random()-0.5) * rotationSpeed;
        }

        let xVel;
        let yVel;
        if( effectParameters.vectorParticle.pattern === "radial") {
            let theta = 2*3.1415927 / effectParameters.vectorParticle.count;
            xVel = Math.sin(theta * particleIndex);
            yVel = Math.cos(theta * particleIndex); 
        }
        else {
            xVel = (Math.random()-0.5);
            yVel = (Math.random()-0.5);
        }

        let velocity = this.gameSession.p5.createVector(xVel, yVel);

        velocity.mult(effectParameters.vectorParticle.initialVelocity);


        if(effectParameters.vectorParticle.initialVelocityRandom === true ) {
            velocity.mult(Math.random()); //may want to tune this
        }

        let lifeSpan = effectParameters.vectorParticle.particleLife * 1000; //convert to milliseconds

//    constructor(duration, size, particleVertices, position, rotation, startVelocity, strokeWeight,fill)        

        return new VectorParticle2(shape,lifeSpan,1,this.positionVector,rotationSpeed,velocity, 1, 0, true,particleVertices);

    }


    get particles() {
        return this.__particles;
    }

    get positionVector() {
        return this.__positionVector;
    }

    get gameSession() {
        return this.__gameSession;
    }

}



