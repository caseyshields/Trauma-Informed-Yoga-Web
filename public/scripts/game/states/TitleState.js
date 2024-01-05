import State from "../../core/State/State.js";
import Mediapipe from "../../core/Plugin/Mediapipe.js";
import Skeleton from "../skeleton/Skeleton.js";
/** Initial state used to welcome a user into the game and
 * load libraries in the background. */

export default class LoadingState extends State {

    // P5 DOM elements;
    section;
    header;
    article;
    aside;
    freeButton;
    guidedButton;
    initButton;

	/** @constructor Creates the Title screen menu and adds it to the DOM. It is invisible by default. */
	constructor() {
		super("Loading");
		//get reference to gameSession
		//tells us if the application has loaded the camera.
		this.__cameraLoaded = false;

		//indicates if we are currently loading tasks.
		this.__loading = true;

		//local references to assets for cleaner code.
		this.__loadingBackgroundImg = {};

		// create the markup
        this.__p5
        this.section = this.__p5.createElement('section');
        this.section.class('title');
        // this.section.parent(main); // by default the section is added to the p5 canvas which is a bit weird...
		this.section.attribute('style', 'display:none;');

        this.header = this.__p5.createElement('header');
        this.header.parent(this.section);
        this.header.child(
            this.__p5.createElement('h1', 'Soothing Systems')
        );

        this.article = this.__p5.createElement('article');
        this.article.parent(this.section);
        this.guidedButton = this.__p5.createElement('button', 'Guided');
        this.guidedButton.attribute('disabled', true);
        this.guidedButton.parent(this.article);
        this.guidedButton.mousePressed(()=> {
            this.gameSession.setCurrentStateByName("Game");
        });
        this.freeButton = this.__p5.createElement('button', 'Free');
        this.freeButton.attribute('disabled', true);
        this.freeButton.parent(this.article);
        this.freeButton.mousePressed(()=> {
            this.gameSession.setCurrentStateByName("Game");
        });
        this.initButton = this.__p5.createElement('button', 'Initialize');
        this.initButton.parent(this.article);
        this.initButton.mousePressed(()=> {
            this.initMediaPipe();
			this.initButton.attribute('disabled', true);
        });
		// this.configButton = this.p5.createElement('button', 'Configuration');
		// this.configButton.parent( this.article );
		// this.configButton.mousePressed( ()=>{
		// 	this.gameSession.setCurrentStateByName('Config');
		// })

        this.aside = this.__p5.createElement('aside');
        this.aside.parent(this.section);
		// alternately we might consider putting info links in a dropdown...
		// this.aside = this.p5.createElement('details');
		// this.aside.parent(this.section);
		// this.aside.child(this.p5.createElement('summary', 'About'));

		this.resourceButton = this.__p5.createElement('button', 'TSY Resources');
		this.resourceButton.attribute('disabled', true);
		this.resourceButton.parent( this.aside );
		this.resourceButton.mousePressed(()=>{
			// this.gameSession.setCurrentStateByName('');
		});
		this.yogaButton = this.__p5.createElement('button', 'Yoga: Culture and Practices');
		this.yogaButton.attribute('disabled', true);
		this.yogaButton.parent( this.aside );
		this.yogaButton.mousePressed( ()=>{
			// this.gameSession.setCurrentStateByName('');
		});
		this.creditButton = this.__p5.createElement('button', 'Academic Credits');
		this.creditButton.parent( this.aside );
		this.creditButton.mousePressed( ()=>{
			this.gameSession.setCurrentStateByName('Credits');
		});
		this.howButton = this.__p5.createElement('button', 'How This Game Works');
		this.howButton.attribute('disabled', true);
		this.howButton.parent( this.aside );
		this.howButton.mousePressed( ()=>{
			// this.gameSession.setCurrentStateByName('');
		});
	}

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
        if (!this.cameraLoaded) {
            const mp = this.gameSession.mediapipe;
            if (mp && mp.cameraRunning && mp.estimating) {
                this.cameraLoaded = true;

				// this.initButton.attribute('style', 'display:none;')
                this.freeButton.removeAttribute('disabled');
                this.guidedButton.removeAttribute('disabled');
            }
        }
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

	/**Init Mediapipe
	 *
	 */
	async initMediaPipe() {
		this.gameSession.mediapipe = Mediapipe.getInstance();

		try {
			//init media pipe, start loading skeleton to avoid delay
			await this.gameSession.mediapipe.setup();
			this.gameSession.skeleton = new Skeleton();
			this.gameSession.skeletonLoaded = true;
		} catch (error) {
			console.error(error);
		}
	}

	get loading() {
		return this.__loading;
	}

	set loading(loading) {
		this.__loading = loading;
	}

	get cameraLoaded() {
		return this.__cameraLoaded;
	}

	set cameraLoaded(cameraLoaded) {
		this.__cameraLoaded = cameraLoaded;
	}

}
// cameraButtonStyle = {
// 	stroke: this.p5.color(230, 251, 255),
// 	strokeWeight: 5,
// 	fill: this.p5.color(51, 51, 51),
// 	hoverFill: this.p5.color(76, 76, 76),
// 	pressedFill: this.p5.color(102, 102, 102),
// 	loadingFill: this.p5.color(0, 128, 255),
// 	disabledFill: null,
// };

// let backButtonStyle = {
// 	stroke: this.p5.color(255, 255, 255),
// 	strokeWeight: 5,
// 	fill: this.p5.color(0, 0, 0),
// 	hoverFill: this.p5.color(123, 123, 123),
// 	pressedFill: this.p5.color(255, 255, 255),
// 	loadingFill: this.p5.color(62, 62, 62),
// 	disabledFill: this.p5.color(125, 0, 0),
// }