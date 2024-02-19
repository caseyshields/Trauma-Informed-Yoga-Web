import Manager from "../../core/Manager/Manager.js";

/** Contains a registry of all configurable objects, which can be queried, saved and loaded.
 * Configurable game objects must register with the SettingsManager before the setup() phase.
 */
export default class SettingsManager extends Manager {

    // TODO think through how we will configure multiple instances of the same object...

    // an index of configurable components
    components = {};

    // an index of configuration descriptions
    configuration = {};

    setup() {}

    update() {}

    render() {}

    /** Adds the given component to the configuration registry
     * @param {String} id Name of the configurable object
     * @param {Object} component A game object or system that implements a getter for 'settings' which returns a configuration description.
     * @returns a context which can be used to add configurable parameters to the component
     */
    register(id, component) {
        if (this.components[id]===undefined) {
            this.components[id] = component;
            this.configuration[id] = {}
        } // TODO resolve conflicts with any previous definitions?

        return {
            addRange: (name, min, max, value) => {
                this.configuration[id][name] = {type:'range', min, max, value};
                this.components[id][name] = value;
            },
            addSelect: (name, values, value) => {
                this.configuration[id][name] = {type:'select', values, value};
                this.components[id][name] = value;
            },
            addColor: (name, value) => {
                this.configuration[id][name] = {type:'color', value};
                this.components[id][name] = value;
            },
            addCheck: (name, value) => {
                this.configuration[id][name] = {type:'checkbox', value};
                this.components[id][name] = value;
            },
        } // TODO add a way to set a validator function?
        // TODO add a description string for tooltips?
    }

    /** Removes the components from the configuration. 
     * @param {String} name Name of the previously registered object.
    */
    unregister(name) {
        delete this.components[name];
        delete this.configuration[name];
    }

    /** @returns an object containing all registered components */
    get registry() { return this.components; }
    // TODO this seems way to much leaked state...

    getIds() {
        let ids = [];
        for (let id in this.components)
            ids.push(id);
        return ids;
    }

    /** @returns the component registered with the given name */
    getComponent(name) {
        return this.components[name];
    }
    
    /** @returns the configuration registered with the given name */
    getConfiguration(name) {
        return this.configuration[name];
    }

    foreach( func ) {
        for (let id in this.components) {
            let component = this.components[id];
            let configuration = this.configuration[id];
            func(component, configuration);
        }
    }
    
    /** resets all configurable parameters to their defaults */
    reset() {
        for (let id in this.components) {
            let component = this.components[id];
            let settings = this.configuration[id];
            for (let parameter in settings) {
                // console.log(id+'.'+parameter+': '+component[parameter]+' -> '+settings[parameter].value);
                component[parameter] = settings[parameter].value;
            }
        }
    }

    /** Saves the current configuration to local browser storage under their registered names. */
    save() {
        for (let name in this.components) {
            // get the configured component and it's default setting object!
            let component = this.components[name];
            let settings = this.configuration[name];
            
            // copy the current component values into a settings object
            for (let parameter in settings)
                settings[parameter].value = component[parameter];

            // then save the setting to browser storage under the component name
            this.p5.storeItem(name, settings);
        }
    }

    /** Loads the configuration from local browser storage */
    load() {
        for (let name in this.components) {
            let settings = this.p5.getItem(name);
            let component = this.components[name];
            for(let parameter in settings)
                component[parameter] = settings[parameter].value;
        }
    }

}