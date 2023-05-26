import SparkleSound from "../../game/sounds/SparkleSound.js";
import Manager from "../Manager/Manager.js";

//Sound manager is event driven, meaning that other methods request for it
//to trigger sounds instead of it searching for events to pair to.
export default class SoundManager extends Manager {

    __bpm = 0;
    
    //references to internal tracks that can be triggered... TODO: refactor into some structure
    __sparkleSound = {};

    constructor(bpm){
        super();
        this.__bpm = bpm;
    }

    setup(){
        //setup tone
        Tone.Transport.bpm.value = this.bpm;
        Tone.Transport.start();

        //add necessary sounds for game
        this.sparkleSound = new SparkleSound(); //useful for particle effects
        this.sparkleSound.setup();
    }

    update(){

    }

    render(){

    }

    get bpm(){
        return this.__bpm;
    }

    set bpm(bpm){
        this.__bpm = bpm;
    }

    get sparkleSound(){
        return this.__sparkleSound;
    }

    set sparkleSound(sparkleSound){
        this.__sparkleSound = sparkleSound;
    }

}