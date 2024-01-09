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
        
        // get the configuration and make a UI to edit it
        let configuration = this.gameSession.settingsManager.getConfiguration();
        this.generateForm( configuration, this.section );

        // TODO add a nav bar that lets you move between configurations for different effects...

        // make the UI visible by removing the style attribute; 'display:none;'
        this.section.removeAttribute('style');
	}

	/** Called when the current state is changed from this state. Makes the Title screen invisible. */
	setdown() {
		this.section.attribute('style', 'display:none;');
	}

    /**  */
    generateForm(config, parent) {
        
        this.form = this.p5.createElement( 'form' );
        this.form.parent( parent );

        // configuration objects 
        for (let topic in config) {
            let fieldset = this.p5.createElement( 'fieldset' );
            fieldset.parent( this.form );
            let legend = this.p5.createElement('legend', topic);
            legend.parent( fieldset );

            let subset = config[topic];
            for (let name in subset) {
                let entry = subset[name]; 

                let label = this.p5.createElement('label', name);
                label.attribute('for', name);
                label.parent( fieldset );
                

                if (Array.isArray(entry)) {
                    //TODO recurse on arrays?
                }
                if (entry.type=='range') {
                    let slide = this.p5.createElement('input');
                    slide.attribute('id', name);
                    slide.attribute('type', 'range');
                    slide.attribute('min', entry.min);
                    slide.attribute('max', entry.max);
                    slide.attribute('value', entry.value);
                    slide.parent( fieldset );
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
                }
                else if (entry.type=='color') {
                    let input = this.p5.createElement( 'input' );
                    input.attribute( 'id', name);
                    input.attribute( 'type', 'color');
                    input.attribute( 'value', arrayToHex( entry.value ) );
                    input.parent( fieldset );
                }
                else if (entry.type=='checkbox') {
                    let check = this.p5.createElement( 'input' );
                    check.attribute('id', name);
                    check.attribute('type', 'checkbox');
                    if (entry.value)
                        check.attribute('checked', true);
                    check.parent(fieldset);
                }
                
            }
        } // TODO should I make this recurse on nested objects?
        // TODO add way to configure arrays of topics
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