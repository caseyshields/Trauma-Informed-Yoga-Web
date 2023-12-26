import State from "../../core/State/State.js";

//TODO load this from somewhere?
// Here is the configuration data for the credit section
const DefaultCredits = [
    {name:'Sam Shields', role:'Producer, Research, Gameplay Programmer'},
    {name:'Casey Shields', role:'Gameplay Programmer'},
    {name:'Likha Pulido', role:'Sound Design & Implementation'},
    {name:'Andrew Li', role:'UI/UX Designer'},
    {name:'Franky Dominguez', role:'Research'},
    {name:'Ramon Rubio', role:'Project Management'}
]

/**  */
export default class CreditsState extends State {

    // P5 DOM elements;
    section;
    header;
    article;
    aside;
    freeButton;
    guidedButton;
    initButton;

    // TODO get the navigation bar working! 
    // maybe add document anchors for each section
    // then link the navigation to them?
    // or should I do it programmatically?

    /** @constructor Creates DOM elements for the Credit page component.
     * @param {Object[]} data An array of credits in the form; {name:String, role:String}
     */
    constructor(data=DefaultCredits) {
        super( 'Credits' );

        this.section = this.p5.createElement( 'section' );
        this.section.class( 'credits' );
        this.section.attribute('style','display:none;');

        // option 1; we use svg assets which is simpler to invoke;
        this.back = this.p5.createElement('img');
        this.back.attribute('src', '../../../assets/images/back.svg');
        this.back.parent(this.section);

        // option 2; we use embedded svg which can be styled by CSS;
        // this.back = this.p5.createElement('svg');
        // this.back.attribute('width','38');
        // this.back.attribute('height','39');
        // this.back.attribute('viewbox','0 0 38 39');
        // this.back.attribute('xmlns','http://www.w3.org/2000/svg');
        // this.back.parent(this.section);
        // let use = this.p5.createElement('use');
        // //use.attribute('href','#backArrow');
        // use.attribute('xlink:href','#backArrow');
        // use.parent(this.back);
        // I'm having trouble getting it to work; but the advantage would be CSS styling for color and stroke would apply to it...

        this.back.mousePressed(()=>{
            this.gameSession.setCurrentStateByName('Loading');
        });

        this.aside = this.p5.createElement( 'aside' );
        this.aside.parent( this.section );
        this.aside.child( this.p5.createElement('h3', 'Gameplay') );
        this.aside.child( this.p5.createElement('h3', 'Design') );
        this.aside.child( this.p5.createElement('h3', 'Sound') );
        this.aside.child( this.p5.createElement('h3', 'Research') );

        this.article = this.p5.createElement( 'article' );
        this.article.parent( this.section );
        this.article.child( this.p5.createElement('h1', 'Credits') );
        for (let credit of data) {
            let name = this.p5.createElement('h2', credit.name);
            let role = this.p5.createElement('h3', credit.role)
            this.article.child( name );
            this.article.child( role );
        }
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

	/** Make the game start buttons visible when the camera loads */
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
