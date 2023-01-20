/*

ScreenShakeEffector

    Set up as a generic screen shaker. Takes name of event, and looks up appropriate
    shake parameters from juiceSettings. 

    Supports sinusoidal, random and Perlin noise as shake functions.

    Formula and parameters are set up in constructor. 

    last modified by MJ 6/4/22

    TODO: Separating frequency from amplitude would be nice. 

*/

import GameSession from "../../GameSession.js";

export default class ScreenShakeEffector {

    constructor(eventName) {
        this.__gameSession = new GameSession();

        //construct this effector object using the juiceSettings object        
        this.__active = this.gameSession.juiceSettings.container[eventName].shake.active;
        this.__xAxis = this.gameSession.juiceSettings.container[eventName].shake.xAxis; // boolean
        this.__yAxis = this.gameSession.juiceSettings.container[eventName].shake.yAxis; // boolean
        this.__intensity = this.gameSession.juiceSettings.container[eventName].shake.intensity; // float 0.0 - 1.0
        this.__duration = this.gameSession.juiceSettings.container[eventName].shake.duration * 1000; //convert to milliseconds
        this.__form = this.gameSession.juiceSettings.container[eventName].shake.form; // string
        this.__fade = this.gameSession.juiceSettings.container[eventName].shake.fade; // string, typically "linear" or "exponential"

        this.__startTime = this.gameSession.timeManager.unscaledTime;
        this.__currentIntensity = this.__intensity;

    }

    finished(){
        if( (this.gameSession.timeManager.unscaledTime - this.startTime) >= this.duration) {
            return "screenShake";
        }
        else {
            return false;
        }
    }

    update(){

            this.shakeFader();

            let xOffset;
            let yOffset;

            xOffset = 0;
            yOffset = 0;

            // computes offsets using formula for each shake type
            if( this.xAxis) {
                xOffset = this.computeShake();
            }
            if( this.yAxis) {
                yOffset = this.computeShake();
            }

            // use p5 "translate" feature to offset the whole screen a bit
            this.gameSession.p5.translate(xOffset,yOffset);
    }

    //empty render function intentionally
    render() {
        
    }


    computeShake() {
    
        switch(this.form) {  
            case "sine":
                return this.sineShake();
                break;
            case "random":
                return this.randomShake();
                break;
            case "noise":
                return this.noiseShake();
                break;
            default:
                return this.randomShake();
        }

    }

    shakeFader() {
        
        if( this.fade === "linear" ) {
            let proportion = 1 - ((this.gameSession.timeManager.time - this.startTime ) / this.duration);
            this.currentIntensity = this.intensity * proportion;            
        }

        if( this.fade === "exponential" ) { 
            let timeElapsed = (this.gameSession.timeManager.time - this.startTime) / this.duration;
            let proportion = timeElapsed * timeElapsed;
            proportion = Math.pow(timeElapsed, 4);
            this.currentIntensity *=  1 - proportion;
            console.log(proportion);
        }

    }

    // math formulas for screen shake. Way too many magic numbers in here.
    sineShake() {
        return this.gameSession.p5.sin(this.gameSession.timeManager.time / 10) * this.currentIntensity * 10;
    }

    randomShake () {
        return this.gameSession.p5.random(-this.intensity * 20, this.intensity * 20);
    }

    noiseShake() {
        // use p5's built in function to return Perlin noise
        // uses time function to animate the noise
        return this.gameSession.p5.noise(this.gameSession.timeManager.time) * this.currentIntensity * 20;
    }   

    get gameSession(){
        return this.__gameSession;
    }

    get active() {
        return this.__active;
    }

    get intensity() {
        return this.__intensity;
    }

    get duration(){
        return this.__duration;
    }

    get form() {
        return this.__form;
    }

    get fade() {
        return this.__fade;
    }

    get startTime() {
        return this.__startTime;
    }

    get currentIntensity() {
        return this.__currentIntensity;
    }

    set currentIntensity(currentIntensity){
        this.__currentIntensity = currentIntensity;
    }

    get xAxis() {
        return this.__xAxis;
    }

    get yAxis() {
        return this.__yAxis;
    }

}