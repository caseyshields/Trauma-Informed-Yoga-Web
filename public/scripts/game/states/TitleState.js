import State from "../../core/State/State.js";
import Mediapipe from "../../core/Plugin/Mediapipe.js";
import Skeleton from "../skeleton/Skeleton.js";
/** Initial state used to welcome a user into the game and
 * load libraries in the background.
 *
 */

export default class LoadingState extends State {

    p5;

    // P5 DOM elements;
    section;
    header;
    article;
    aside;
    freeButton;
    guidedButton;
    initButton;
    // main;

	constructor() {
		super("Loading");
		//get reference to gameSession
		//tells us if the application has loaded the camera.
		this.__cameraLoaded = false;

		//indicates if we are currently loading tasks.
		this.__loading = true;

		//local references to assets for cleaner code.
		this.__loadingBackgroundImg = {};
	}

	setup() {
		super.setup();

        // create the markup
        this.__p5
        this.section = this.__p5.createElement('section');
        this.section.class('title');
        // this.section.parent(main);

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
        });

        this.aside = this.__p5.createElement('aside');
        this.aside.parent(this.section);
	}

	update() {
		super.update();

		// this.cameraButton.update(() => {
		// 	if (this.cameraButton.state === this.cameraButton.states.loading) {
		// 		const mp = this.gameSession.mediapipe;
		// 		if (mp && mp.cameraRunning && mp.estimating) {
		// 			this.cameraLoaded = true;
		// 			this.cameraButton.state = this.cameraButton.states.disabled;
		// 			this.aboutButton.state = this.aboutButton.states.idle;
		// 			this.freeButton.state = this.freeButton.states.idle;
		// 			this.guidedButton.state = this.guidedButton.states.idle;
		// 		}
		// 	}
		// });
		// this.aboutButton.update();
		// this.freeButton.update();
		// this.guidedButton.update();
        if (!this.cameraLoaded) {
            const mp = this.gameSession.mediapipe;
            if (mp && mp.cameraRunning && mp.estimating) {
                this.cameraLoaded = true;
                this.initButton.attribute('disabled');
                this.freeButton.removeAttribute('disabled');
                this.guidedButton.removeAttribute('disabled');
            }
        }
	}

	render() {
		super.render();

		// this.cameraButton.render();
		// this.aboutButton.render();
		// this.freeButton.render();
		// this.guidedButton.render();
	}

	resize() {
		super.resize();

		// this.cameraButton.updateSize();
		// this.aboutButton.updateSize();
		// this.freeButton.updateSize();
		// this.guidedButton.updateSize();
	}

	cleanup() {
		super.cleanup();
		//TODO: Delete all unnecessary data to prevent leaks/namespace collisions
	}

	// mousePressed() {
	// 	this.cameraButton.checkPressed();
	// 	this.aboutButton.checkPressed();
	// 	this.freeButton.checkPressed();
	// 	this.guidedButton.checkPressed();
	// }

	// mouseReleased() {
	// 	this.cameraButton.checkReleased(() => {
	// 		this.initMediaPipe();
	// 	}, true);

	// 	this.aboutButton.checkReleased(() => {
	// 		this.gameSession.setCurrentStateByName("About");
	// 		//alert("This will launch the about page!");
	// 	});

	// 	this.freeButton.checkReleased(() => {
	// 		this.gameSession.setCurrentStateByName("Game");
	// 	});

	// 	this.guidedButton.checkReleased(() => {
	// 		this.gameSession.setCurrentStateByName("Game");
	// 	});
	// }

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

	/**UI Components
	 *
	 */

	// cameraButtonLayout = {
	// 	xRatio: 0.05,
	// 	yRatio: 0.55,
	// 	widthRatio: 0.5,
	// 	heightRatio: 0.4,
	// };

	// // "null" as fill means the button will not be rendered
	// cameraButtonStyle = {
	// 	stroke: this.p5.color(230, 251, 255),
	// 	strokeWeight: 5,
	// 	fill: this.p5.color(51, 51, 51),
	// 	hoverFill: this.p5.color(76, 76, 76),
	// 	pressedFill: this.p5.color(102, 102, 102),
	// 	loadingFill: this.p5.color(0, 128, 255),
	// 	disabledFill: null,
	// };

	// cameraButtonText = {
	// 	text: "initialize",
	// 	textRatio: 12,
	// };

	// cameraButton = new Button(this.cameraButtonLayout, this.cameraButtonStyle, this.cameraButtonText);

	// aboutButtonLayout = {
	// 	xRatio: 0.6,
	// 	yRatio: 0.55,
	// 	widthRatio: 0.35,
	// 	heightRatio: 0.4,
	// };

	// aboutButtonStyle = {
	// 	stroke: this.p5.color(230, 251, 255),
	// 	strokeWeight: 5,
	// 	fill: this.p5.color(51, 51, 51),
	// 	hoverFill: this.p5.color(76, 76, 76),
	// 	pressedFill: this.p5.color(102, 102, 102),
	// };

	// aboutButtonText = {
	// 	text: "about",
	// 	textRatio: 10,
	// };

	// aboutButton = new Button(this.aboutButtonLayout, this.aboutButtonStyle, this.aboutButtonText);

	// freeButtonLayout = {
	// 	xRatio: 0.05,
	// 	yRatio: 0.55,
	// 	widthRatio: 0.5,
	// 	heightRatio: 0.175,
	// };

	// freeButtonStyle = {
	// 	stroke: this.p5.color(230, 251, 255),
	// 	strokeWeight: 5,
	// 	fill: this.p5.color(51, 51, 51),
	// 	hoverFill: this.p5.color(76, 76, 76),
	// 	pressedFill: this.p5.color(102, 102, 102),
	// 	disabledFill: null,
	// };

	// freeButtonText = {
	// 	text: "free",
	// 	textRatio: 14,
	// };

	// // initially disabled
	// freeButton = new Button(this.freeButtonLayout, this.freeButtonStyle, this.freeButtonText, true);

	// guidedButtonLayout = {
	// 	xRatio: 0.05,
	// 	yRatio: 0.775,
	// 	widthRatio: 0.5,
	// 	heightRatio: 0.175,
	// };

	// guidedButtonStyle = {
	// 	stroke: this.p5.color(230, 251, 255),
	// 	strokeWeight: 5,
	// 	fill: this.p5.color(51, 51, 51),
	// 	hoverFill: this.p5.color(76, 76, 76),
	// 	pressedFill: this.p5.color(102, 102, 102),
	// 	disabledFill: null,
	// };

	// guidedButtonText = {
	// 	text: "guided",
	// 	textRatio: 14,
	// };

	// // initially disabled
	// guidedButton = new Button(this.guidedButtonLayout, this.guidedButtonStyle, this.guidedButtonText, true);
}
