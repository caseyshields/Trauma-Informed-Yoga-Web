import GameSession from "../../GameSession.js";
import VectorParticle from "./VectorParticle.js";



export default class ParticleSystem {

    /*
        tag is for reference in index.js; just use findByTag function to get the instance
        duration: set null means infinite duration
        rateOverTime: the amount of particles that emit generates for once
    */
    
    constructor(tag, duration, position, rotation, rateOverTime, intervalTime, loop) {
        this.__tag = tag;
        this.__gameSession = new GameSession();
        this.__p5 = this.__gameSession.p5;
        if (position === null) {
            position = this.__p5.createVector(0, 0);
        }
        if (rotation === null) {
            rotation = 0;
        }
        if (rateOverTime === null) {
            rateOverTime = 1;
        }
        this.__duration = duration;
        this.__timeManager = this.__gameSession.timeManager;
        this.__startTime = this.__timeManager.time;
        this.__position = this.__p5.createVector(position.x, position.y);
        this.__rotation = rotation;
        this.__particles = [];

        this.__isPlaying = true;
        // the amount of particles that particle system generates for once
        this.__rateOverTime = rateOverTime;

        // this is for counting the time of interval emission
        this.__timeCounter = 0;
        this.__intervalTime = intervalTime;
        this.__loop = loop;
        this.__playTimes = 1;
    }

    emission() {
        if (this.__loop) {
            if (this.__timeCounter > this.__intervalTime) {
                this.emit();
                this.__timeCounter = 0;
            }
        } else {
            if (this.__playTimes > 0) {
                if (this.__timeCounter > this.__intervalTime) {
                    this.emit();
                    this.__timeCounter = 0;
                    this.__playTimes--;
                }
            }
        }
    }

    emit() {
        for (let i = 0; i < this.__rateOverTime; i++) {
            var newVectorParticle = new VectorParticle(1000, 2, null, this.__position, this.__rotation, this.p5.createVector(1, 1).mult(0.01), this.p5.color(255, 204, 0));
            newVectorParticle.applyForce(this.p5.createVector(0.001, 0));
            this.__particles.push(newVectorParticle);
        }
    }

    finished() {
        if (this.__duration === null) {
            return false;
        }
        return (this.__timeManager.time - this.__startTime) >= this.__duration;
    }

    play() {
        this.__isPlaying = true;
    }

    stop() {
        this.__isPlaying = false;
    }

    follow(position, rotation) {
        this.__position.x = position.x;
        this.__position.y = position.y;
        this.__rotation = rotation;
    }

    update() {
        if (this.__isPlaying) {
            this.__timeCounter += this.__timeManager.deltaTime;
            for (let i = this.__particles.length - 1; i >= 0; i--) {
                if (this.__particles[i].finished()) {
                    this.__particles.splice(i, 1);
                } else {
                    this.__particles[i].update();
                }
            }
        } else {
            this.__particles = [];
        }
    }

    render() {
        for (let i = this.__particles.length - 1; i >= 0; i--) {
            this.__particles[i].render();
        }
    }

    get p5() {
        return this.__p5;
    }

    get intervalTime() {
        return this.__intervalTime;
    }

    set intervalTime(intervalTime) {
        this.__intervalTime = intervalTime;
    }

    get position() {
        return this.__position;
    }
    set position(newPosition) {
        this.__position = this.p5.createVector(newPosition.x, newPosition.y);
    }

    get rotation() {
        return this.__rotation;
    }

    set rotation(newRotation) {
        this.__rotation = newRotation;
    }

    get tag() {
        return this.__tag;
    }

    set tag(tag) {
        this.__tag = tag;
    }

}