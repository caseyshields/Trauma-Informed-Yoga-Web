import VectorGameObject from "../../core/GameObject/VectorGameObject.js";
/**
 * 
 */

export default class TargetChain extends VectorGameObject {
    targets = []; //ordered list of targets in order of hitting them

    constructor(targets = []){
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

        this.targets = targets;
    }

    setup(){

    }

    render(){

    }

    update(){

    }

}