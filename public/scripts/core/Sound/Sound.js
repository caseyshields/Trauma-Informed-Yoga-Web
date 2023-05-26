/**
 * 
 * TODO: We should put a child class to split functionality between
 * synth-generated and sampled. But that's a later concern
 * 
 */
import GameSession from "../../game/GameSession.js";

export default class Sound {

    __isLooping = false;

    constructor(){
        this.__gameSession = new GameSession();
    }

    //establish and setup method of sound production
    setup(){}

    //trigger a discrete instance of sound production
    trigger(){}

    //start playing the continuous version of sound.
    startLoop(){
        this.isLooping = true;
    }

    //stop playing the continuous version of sound.
    stopLoop(){
        this.isLooping = false;
    }

    // GameSession getter
    get gameSession(){
        return this.__gameSession;
    }

    get isLooping(){
        return this.__isLooping;
    }

    set isLooping(isLooping){
        this.__isLooping = isLooping;
    }
}