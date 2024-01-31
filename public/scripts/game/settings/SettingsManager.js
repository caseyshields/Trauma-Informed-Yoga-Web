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
 * 
 * ... Though I could see this being rolled in with the Config State! But that might complicate some 
 * lifecycle stuff. ie States need an instantiation order...
 * because this manager exists in the singleton GameSession, and should exist before 
 * any game state is created. 
 */

/**
 * oof, been trying to add 'load', 'save', and 'defaults' buttons to config page 
 * and the leaked state is kicking my ass. 
 * I need to re-think parts of it. What's driving me crazy is I allow Arrays of 
 * objects in the configuration. The thought being; I wanted the Smoke trail 
 * object to handle an arbitrary number of emitters that you could add and remove. 
 * This introduces a bunch of complications, including the need to add more UI for 
 * adding/removing these arrays of sub-objects. But the worst problem is reference 
 * assignments divvying up shared knowledge of the configuration state. IE; the
 * setting manager, the widget event handler, the object's local configuration,
 * etc, all pointing at a different config sub-objects. Esp. when performing a global 
 * update like a save or load.
 * 
 * One solution is, I can flesh out the setting manager to know how to handle 
 * deeper config objects. I think this would take 4 coordinates! (component, 
 * parameter, index, sub-parameter). ugh. All that work and it's not even a 
 * general solution; ie, arbitrary config object compositions.
 * 
 * Another route to flatten the config objects; break up the arrays of objects into 
 * multiple configuration objects. For example, registering a new object for each smoke emitter.
 * This fixes the Setting api complexity problem and makes it trivial to have a 
 * single mediator for all setting updates. Though handling the indices of object 
 * copies I don't see an intuitive solution for. And it makes a need to introduce
 * some sort of shared canvas objects for stuff like the smoke emitter whose 
 * sole purpose is to draw on a canvas.
 * 
 * Or I can double down on just exposing the state and make the Setting manager 
 * always do deep copies and assignments. Seems really easy for any component
 * to throw a booby trap in this design though... by just reassigning an array
 * internally. Then when the SettingsManager loads a saved config, it's updating 
 * the wrong reference!
 * 
 * Maybe the config object should never be local to the object they configure...
 * maybe the settingManager should be passed at construction, and registration
 * happens per-parameter... oof, then I'm starting to engineer a reactive framework 
 * but shittier, lol. maybe it's not so bad; I just need a single owner of the state.
 * all updates can simply be handled by polling.
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
        this._register = {};
    }


    // getContext(id) {
    //     if (register[id]===undefined)
    //         register[id] = {};
    //     // let component = register[id];
    //     // TODO resolve conflicts with any previous definitions?

    //     // TODO add undefined field guards...
    //     return {
    //         addRange: (name, min, max, value)=> {register[id][name] = {type:'range', min, max, value, default:value};},
    //         addSelect: (name, values, value)=> {register[id][name] = {type:'select', values, value, default:value};},
    //         addColor: (name, value)=> {register[id][name] = {type:'color', value, default:value};},
    //         addCheck: (name, value)=> {register[id][name] = {type:'checkbox', value, default:value};},
    //         get : (name) => {return register[id][name].value; },
    //         set : (name, value) => {register[id][name].value = value;},
    //         info: (name)=> {return register[id][name];}
    //         // getWidget: (name)=> {
    //         //     // instead of returning the validation metadata should we just create the UI here?
    //         //     // probably should stay in the more UI focused ConfigState...
    //         // }
            
    //     } // TODO add a way to set a validator function for the parameters...
    // }

    setup(){

    }

    update(){

    }

    // Settings Manager shouldn't render
    render(){

    }

    /** 
     * @param {String} name Name of the configurable object
     * @param {Object} A game object or system that implements get and set for it's 'configuration'.
     */
    register(name, configurable) {
        // let c = Object.assign({},configurable.configuration);
        this._register[name] = configurable;
    }

    unregister(name) {
        delete this._register[name];
    }

    /** @returns a shallow copy of every registered component's configuration in an object */
    getAll() {
        let configuration = {};
        for (let name in this._register)
            configuration[name] = this._register[name].settings;
        return configuration;
    }

    get(name) {
        return this._register[name].settings;
    }
    get(component, parameter, index=0) {

    }

    set(component, parameter, index=0) {

    }

    /** resets all configurable objects to their provided defaults */
    reset() {
        for (let name in this._register) {
            let component = this._register[name];
            let settings = component.settings;
            for (let parameter in settings)
                component[parameter] = settings[parameter].value;
        }
    }

    /** Saves the current configuration to local browser storage */
    save() {
        for (let name in this._register) {
            // get the configured component and it's default setting object!
            let component = this._register[name];
            let settings = component.settings;
            
            // copy the current component values into a settings object
            for (let parameter in settings)
                settings[parameter].value = component[parameter];

            // then save the setting to browser storage under the component name
            this.p5.storeItem(name, settings);
        }
    }

    /** Loads the configuration from local browser storage */
    load() {
        for (let name in this._register) {
            let settings = this.p5.getItem(name);
            let component = this._register[name];
            for(let parameter in settings)
                component[parameter] = settings[parameter];
        }
    }

//     /**
//    * @param {Object} from
//    * @param {Object} to
//    */
//   static DeepAssign(from, to) {
//     for (let name in from) {
//       let a = from[name];
//       let b = to[name];
      
//       if (b===undefined)
//         to[name] = a;

//       else if (Array.isArray(a) && Array.isArray(b)) {
//         while (b.length)
//             b.pop();
//         while (a.length)
//             b.push(a.pop());
//       } // TODO this suggests configured objects should not save any internal references to arrayed config objects...
      
//       else if (typeof a==='object' && typeof b==='object'
//             && !Array.isArray(a) && !Array.isArray(b)) {
//         to[name] = a;
//       } 
      
//       else {
//         to[name] = from[name];
//       }
//     }
//   }

    // TODO right now we directly store links to the active configuration of all objects!
    // The wisdom of this is questionable. If we do introduce intermediate copies, then we'd
    // need an update step like this;
    // updateConfiguration() {
    //     for (let name in this.configuration) {
    //         let configurable = this.configuration[name];
    //         configurable.settings = 
    //     }
    // }
    // not sure this provides us much robustness against leaked state;
    // every object that implements getters/setters for its internals leaks its state already...


    // each configurable component will now be responsible for initializing itself...
    // right now this is just a hardcoded default, but we should probably try to pull it from browser storage...
    // initializeGameFromSettings() {
	// 	//Look at settings manager

	// 	//Set relevant audio systems

	// 	//Set relevant visual systems

	// 	//Set relevant mechanics systems (form, narrator, targets, particles...)
	// }
}