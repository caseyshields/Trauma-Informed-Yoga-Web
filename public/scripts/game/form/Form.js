import VectorGameObject from "../../core/VectorGameObject.js";
import Target from "./Target.js";

/**Abstract class used for arranging targets in sequence
 * 
 * A "layer" represents a collection of simultaneously active "chains" of targets.
 * A chain progresses linearly, checking if a target has its fulfillment conditions
 * complete before moving on.
 * 
 */
export default class Form extends VectorGameObject{

    layers = []; //array representing order of layers
    
    constructor(){
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

    }

    setup(){

    }

    render(){

    }

    update(){

    }
}