import Target from "./Target.js";
import TargetQueue from "./TargetQueue.js";
import VectorGameObject from "../../core/GameObject/VectorGameObject.js";
import GameObject from "../../core/GameObject/GameObject.js";

/**Abstract class used for arranging targets in sequence
 * 
 * A "layer" represents a collection of simultaneously active "chains" of targets.
 * A chain progresses linearly, checking if a target has its fulfillment conditions
 * complete before moving on.
 * 
 * Target Queue = list of targets for form completion
 * 
 */
export default class Form extends GameObject {

    layers = []; //array representing order of layers
    
    constructor(){
        super();
        this.__targetQueue = new TargetQueue();
        this.__currentTargets = {};
        this.__isLoaded = false;

    }

    setup(){

    }

    render(){

    }

    update(){

        //Peek at current target Queue

        //if all targets are marked as complete, move to next set of targets

    }

    loadTargetQueue(){

    }

    get targetQueue(){
        return this.__targetQueue;
    }

    set targetQueue(targetQueue){
        this.__targetQueue = targetQueue;
    }

    get currentTargets(){
        return this.__currentTargets;
    }

    set currentTargets(currentTargets){
        this.__currentTargets = currentTargets;
    }

    get isLoaded(){
        return this.__isLoaded;
    }

    set isLoaded(isLoaded){
        this.__isLoaded = isLoaded;
    }
}