import State from "../../core/State/State.js";

/**  */
export default class ConfigState extends State {

    // P5 DOM elements;
    section;
    header;
    form;

    /** @constructor Creates DOM elements for the Credit page component.
     * @param {Object[]} data An object of configuration objects
     */
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
            // TODO we may need config to go back to game or title screen!...
		});

        let h1 = this.p5.createElement('h1', 'Configuration');
        h1.parent(this.section);
    }

    /** Called when this state is activated by the Game Session. Makes the Title screen visible */
	setup() {
		super.setup();

        // destroy the form if it had been made previously
        if (this.form!=undefined)
            this.form.remove();

        // create a new one we can synchronize with the current state of the configuration
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

        // TODO add a nav bar that lets you move between configurations for different effects...

        // make the UI visible by removing the style attribute; 'display:none;'
        this.section.removeAttribute('style');
	}

	/** Called when the current state is changed from this state. Makes the Title screen invisible. */
	setdown() {
		this.section.attribute('style', 'display:none;');
        // destroy UI here?
	}

    generateComponent(component, fieldset, count=0) {
        // The component config contains parameter description objects
        for (let name in component) {
            let entry = component[name];
            
            if (count>0)
                name = name+'_'+count;

            // recurse on the elements of an array
            if (Array.isArray(entry)) {
                let count=1;
                for (let item of entry)
                    this.generateComponent(item, fieldset, count++);
                this.p5.createElement('br').parent(fieldset);
                // TODO add controls for adding and removing items!!!
            }

            else {//if (typeof component ==='object') { 

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

            // else console.error(
            //     'Config objects must contain an object describing the parameter');
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

function arrayToHex( value ) {
    let hex='#';
    for (let n=0; n<3; n++) {
        let s = value[n].toString(16);
        while (s.length<2)
            s = '0'+s;
        hex += s;
    }
    return hex;
}