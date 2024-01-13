import State from "../../core/State/State.js";

/** A configuration panel that directly updates the configurable parameters of components that are registered with the setting manager. */
export default class ConfigState extends State {

    section;
    header;
    form;

    // TODO add a nav bar that lets you move between configurations for different effects...
    // TODO add a way to store the configuration in browser
    // TODO add a way to restore defaults
    // TODO this shows all registered components; if we have multiple game modes will we want to have separate config panels for them?

    /** @constructor */
    constructor() {
        super( 'Config' );

        this.section = this.p5.createElement( 'section' );
        this.section.class( 'config' );
        this.section.attribute('style','display:none;');

        this.back = this.p5.createElement( 'img' );
		this.back.attribute('src', '../../../assets/images/back.svg');
		this.back.parent( this.section );
		this.back.mousePressed( ()=>{
			this.gameSession.setCurrentStateByName('Game');
            // TODO we may need config to go back to game or title screen!... we might want to add stack operations to current game state?
		});

        let h1 = this.p5.createElement('h1', 'Configuration');
        h1.parent(this.section);
    }

    /** Called when this state is activated by the Game Session. Makes the Title screen visible and build the configuration controls*/
	setup() {
		super.setup();

        // create the configuration form if it doesn't already exist
        if (this.form===undefined) {
            this.form = this.p5.createElement( 'form' );
            this.form.parent( this.section );
            
            // get the configuration
            let configuration = this.gameSession.settingsManager.getConfiguration();
            
            // Make controls for each component
            for (let topic in configuration) {                
                let component = configuration[topic];
            
                // create a named border for the component
                let fieldset = this.p5.createElement( 'fieldset' );
                fieldset.parent( this.form );
                let legend = this.p5.createElement('legend', topic);
                legend.parent( fieldset );    

                this.generateComponent(component, fieldset)
            }   
        }

        // make the UI visible by removing the style attribute; 'display:none;'
        this.section.removeAttribute('style');
	}

	/** Called when the current state is changed from this state. Makes the Title screen invisible. */
	setdown() {
		this.section.attribute('style', 'display:none;');
	}

    generateComponent(component, fieldset, count=0) {
        // The component config contains parameter description objects
        for (let name in component) {
            let entry = component[name];
            
            // hacky way to track array indices...
            if (count>0)
                name = name+'_'+count;

            // recurse on the elements of an array
            if (Array.isArray(entry)) {
                let count=1;
                for (let item of entry)
                    this.generateComponent(item, fieldset, count++);
                // TODO add controls for adding and removing items!!!
            }

            else {

                // create a label for the field
                let label = this.p5.createElement('label', name+' = '+entry.value.toString());
                label.attribute('for', name);
                label.parent( fieldset );

                // create the appropriate input for the type of parameter
                if (entry.type=='range') {
                    let slide = this.p5.createElement('input');
                    slide.attribute('id', name);
                    slide.attribute('type', 'range');
                    slide.attribute('min', entry.min);
                    slide.attribute('max', entry.max);
                    slide.attribute('value', entry.value);
                    slide.parent( fieldset );
                    slide.changed( ()=>{
                        entry.value = slide.value();
                        label.html(label.attribute('for')+' = '+entry.value.toString());
                    });
                }
                else if (entry.type=='select') {
                    let select = this.p5.createElement('select');
                    select.attribute('name', name);
                    select.attribute('id', name);
                    select.parent(fieldset);
                    for (let value of entry.values) {
                        let option = this.p5.createElement('option', value);
                        option.attribute('value', value);
                        if (value==entry.value)
                            option.attribute('selected', true);
                        option.parent(select);
                    }
                    select.changed( ()=>{
                        entry.value = select.value();
                        label.html(label.attribute('for')+' = '+entry.value.toString());
                    });
                }
                else if (entry.type=='color') {
                    let input = this.p5.createElement( 'input' );
                    input.attribute( 'id', name);
                    input.attribute( 'type', 'color');
                    input.attribute( 'value', entry.value );
                    input.parent( fieldset );
                    input.changed( ()=>{
                        entry.value = input.value();
                        console.log(input.value());
                        label.html(label.attribute('for')+' = '+entry.value.toString());
                    })
                }
                else if (entry.type=='checkbox') {
                    let check = this.p5.createElement( 'input' );
                    check.attribute('id', name);
                    check.attribute('type', 'checkbox');
                    if (entry.value)
                        check.attribute('checked', true);
                    check.parent(fieldset);
                    check.changed( ()=>{
                        entry.value = !entry.value;
                        label.html(label.attribute('for')+' = '+entry.value.toString());
                    })
                }
                else
                    console.error('Unrecognized configuration parameter type: '+entry.type);
            }
        }
        // TODO add way to configure array fields...
    }

    /** @returns {p5.Element} The Dom section containing the credit page */
    get section() {return this.section;}

	
	update() {
		super.update();
	}

	render() {
		super.render();
	}

	resize() {
		super.resize();
	}

	cleanup() {
		super.cleanup();
		//TODO: Delete all unnecessary data to prevent leaks/namespace collisions
		// remove DOM elements?
        // this.section.remove();
	}

}
