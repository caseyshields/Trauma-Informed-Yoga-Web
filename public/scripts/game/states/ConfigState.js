import State from "../../core/State/State.js";

let landmarks = [
    'nose',
    'left eye (inner)',
    'left eye',
    'left eye (outer)',
    'right eye (inner)',
    'right eye',
    'right eye (outer)',
    'left ear',
    'right ear',
    'mouth (left)',
    'mouth (right)',
    'left shoulder',
    'right shoulder',
    'left elbow',
    'right elbow',
    'left wrist',
    'right wrist',
    'left pinky',
    'right pinky',
    'left index',
    'right index',
    'left thumb',
    'right thumb',
    'left hip',
    'right hip',
    'left knee',
    'right knee',
    'left ankle',
    'right ankle',
    'left heel',
    'right heel',
    'left foot index',
    'right foot index'
];

let DefaultConfiguration = {
    silhouette : {
        thickness: { name: 'thickness', type: 'range', min:0, max:100, value: 0 },
        exhale_color: { name: 'exhale color', type: 'color', value: '#323232'},//[50,50,50] },
        inhale_color: { name: 'inhale color', type: 'color', value: '#fafafa'},//[250,250,250] }
    }, // TODO get rid of extra name
    smokeTrails : {
        landmark : { name:'landmark', type:'select', values:landmarks, value:'nose' },
        exhale_size: { name:'exhale size', type:'range', min:0, max:64, value:16 },
        inhale_size: { name:'inhale size', type:'range', min:0, max:64, value:32 },
        fuzz: { name:'fuzz', type: 'range', min:0, max:32, value:4 },
        exhale_color: { name:'exhale color', type:'color', value:'#199619'},//[25,150,25,5] },
        inhale_color: { name:'inhale color', type:'color', value:'#646464'},//[100,100,100,1] }
        // TODO add opacity!!!
    }
}

/**  */
export default class ConfigState extends State {

    // P5 DOM elements;
    section;
    header;
    form;

    /** @constructor Creates DOM elements for the Credit page component.
     * @param {Object[]} data An object of configuration objects
     */
    constructor(config=DefaultConfiguration) {
        super( 'Config' );

        this.section = this.p5.createElement( 'section' );
        this.section.class( 'config' );
        this.section.attribute('style','display:none;');

        this.back = this.p5.createElement( 'img' );
		this.back.attribute('src', '../../../assets/images/back.svg');
		this.back.parent( this.section );
		this.back.mousePressed( ()=>{
			this.gameSession.setCurrentStateByName('Game');
		});

        let h1 = this.p5.createElement('h1', 'Configuration');
        h1.parent(this.section);

        // TODO add a nav bar that lets you move between configurations for different effects...
        this.form = this.p5.createElement( 'form' );
        this.form.parent( this.section );
        
        // configuration objects 
        for (let topic in config) {
            let fieldset = this.p5.createElement('fieldset');
            fieldset.parent(this.form);
            let legend = this.p5.createElement('legend', topic);
            legend.parent(fieldset);

            let subset = config[topic];
            for (let name in subset) {
                let entry = subset[name]; 

                let label = this.p5.createElement('label', entry.name);
                label.attribute('for', name);
                label.parent( fieldset );
                
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
                    input.attribute( 'value', entry.value );
                    input.parent( fieldset );
                }
                
            }
        } // TODO should I make this recurse on nested objects?
        // TODO add way to configure arrays of topics
        // TODO add way to configure array fields...
    }

    /** @returns {p5.Element} The Dom section containing the credit page */
    get section() {return this.section;}

	/** Called when this state is activated by the Game Session. Makes the Title screen visible */
	setup() {
		super.setup();
        this.section.removeAttribute('style');
	}

	/** Called when the current state is changed from this state. Makes the Title screen invisible. */
	setdown() {
		this.section.attribute('style', 'display:none;');
	}

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
