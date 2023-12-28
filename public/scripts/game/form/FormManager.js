import Manager from "../../core/Manager/Manager.js";
import FormQueue from "./FormQueue.js";
import SeatedSunBreath from "./SeatedSunBreath.js";

/** Form Manager
 * 
 * Maintains a queue of forms to render during game state
 * 
 * 1. Initialize empty Form Queue
 */
export default class FormManager extends Manager {

    //

    constructor(){
        super();

        this.__formQueue = new FormQueue();
        this.__currentForm = {};
        this.__formLoaded = false;
    }

    setup(){
        //Load relevant forms into formQueue
        //for testing, hardcoding form loading here
        this.seatedSunBreathForm = new SeatedSunBreath();
        this.formQueue.enqueueForm(this.seatedSunBreathForm);

        if(!this.formLoaded) {
            this.currentForm = this.formQueue.dequeueForm();
            this.currentForm.setup();
            this.formLoaded = true;
        }

    }

    update(){
        this.currentForm.update();

    }

    //Settings Manager shouldn't render
    render(){
        this.currentForm.render();

    }

    get currentForm(){
        return this.__currentForm;
    }

    set currentForm(currentForm){
        this.__currentForm = currentForm;
    }

    get formLoaded(){
        return this.__formLoaded;
    }

    set formLoaded(formLoaded){
        this.__formLoaded = formLoaded;
    }

    get formQueue(){
        return this.__formQueue;
    }

    set formQueue(formQueue){
        this.__formQueue = formQueue;
    }

    get seatedSunBreathForm(){
        return this.__seatedSunBreathForm;
    }

    set seatedSunBreathForm(seatedSunBreathForm){
        this.__seatedSunBreathForm = seatedSunBreathForm;
    }


}