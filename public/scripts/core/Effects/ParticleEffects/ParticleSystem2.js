/* 
ParticleSystem2 (to be renamed later)

Instantiates a particle system based on a game event's definition in JuiceSettings.js

Particle systems will eventually include multiple objects, also data-driven

*/



import GameSession from "../../GameSession.js";
import VectorParticleEffect from "./VectorParticleEffect.js";



export default class ParticleSystem2 {


	constructor( eventName, triggerObject ) {

        this.__gameSession = new GameSession();

        // these two fields are needed for updates in the juiceEventManager
        this.__effectName = "particles";
        this.__active = this.__gameSession.juiceSettings.container[eventName].particles.active;

        this.particleEffects = new Array();

		this.__definition = this.__gameSession.juiceSettings.particleSystems[eventName];
		this.__triggerObject = triggerObject;

		this.initiateSystem(eventName);

	}


	finished() {
		if( this.particleEffects.length <= 0 ) { 
			return true;
		}
		else {
			return false;
		}
	}

	// this isn't right because it needs to manage delayed or repeated spawns
	initiateSystem(eventName) {

        for( let particleName in this.definition ) {
        	let particleEffectObject = this.particleEffectFactory(particleName);
        		this.particleEffects.push(particleEffectObject);
        }

	}


	update() {

		for(let i = this.particleEffects.length - 1; i >=0; i-- ){
            if(this.particleEffects[i].finished()){
                this.particleEffects.splice(i, 1);
            }
            else{
                this.particleEffects[i].update();
            }
        }

	}

	render() {
		for(let i = this.particleEffects.length - 1; i >=0; i-- ){
            this.particleEffects[i].render();
        }
	}


	particleEffectFactory(effectName) {

		// should be a real factory eventually. For now it's a hard coded object

		return new VectorParticleEffect(this.definition,this.triggerObject);


		// add particle types here
		// pass a single object to the effect, it returns an array of particles single particle

	}



	get effectName () {
		return "particles";
	}

	get active() {
		return this.__active;
	}

	get definition () {
		return this.__definition;
	}

	get triggerObject() {
		return this.__triggerObject;
	}


}