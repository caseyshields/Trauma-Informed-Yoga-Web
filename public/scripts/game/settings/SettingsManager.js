import Manager from "../../core/Manager/Manager.js";

/** Settings Manager
 * Controls input settings for all game related states relevant to runtime.
 * 
 * Contains a list of parameterized variables that detail how the runtime environment works.
 * 
 * Whenever game state is loaded, this manager should be checked for updates to instantiate any downstream variables.
 * 
 * CDS: Earlier I had mentioned making game objects and systems provide their own configuration templates.
 * The aim of which was to enable the automatic generation of config UI and validation.
 * It also has a design advantage for our small team; the default configuration and it's validation
 * is always in one place with the code it configures. You don't have to edit a config ui, 
 * and a validator, and the object interface, you just edit the object.
 * 
 * There are downsides; putting config values with validation info is a little unwieldy, making it 
 * awkward to use the values in the configured object. (You could introduce a config value object,
 * but I didn't want to introduce any transforms that might be hard to keep track of in program 
 * flow yet... but it might be a better solution...). Plus you have to learn the syntax for describing
 * these parameters. In this case it's not so bad; they are directly lifted from the attributes of
 * HTML input elements!
 * 
 * Anyways, If we're going this route, it does presuppose a registration, where all the configurable 
 * objects and systems get collated in a single list and we can handle Configuration change events.
 * The Settings manager is prob the best place for this!
 */
export default class SettingsManager extends Manager {

    //TODO: Audio

    //TODO: Visual

    //TODO: Mechanics
    //FORM
    
    //NARRATOR

    //TARGETS

    //DIAPHRAGM

    //SOUVENIR

    constructor(){
        super();
    }

    setup(){

    }

    update(){

    }

    //Settings Manager shouldn't render
    render(){

    }


}