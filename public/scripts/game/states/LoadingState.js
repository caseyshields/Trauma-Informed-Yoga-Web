import GameSession from "../../core/GameSession.js";
import State from "../../core/State.js";
import Mediapipe from "../../core/Mediapipe.js";
/** Initial state used to welcome a user into the game and
 * load libraries in the background.
 *
 */

export default class LoadingState extends State {
	//Load camera button triggers init of mediapipe
	loadCameraButtonStyle = {
		stroke: this.p5.color(230, 251, 255),
		strokeWeight: 5,
		fill: this.p5.color(51, 51, 51),
		hoverFill: this.p5.color(76, 76, 76),
		pressedFill: this.p5.color(102, 102, 102),
		loadingFill: this.p5.color(0, 128, 255),
	};

	LOAD_CAMERA_BUTTON_STATES = {
		IDLE: "idle",
		HOVER: "hover",
		PRESSED: "pressed",
		LOADING: "loading",
		DISABLED: "disabled",
	};

	loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.IDLE;
	loadCameraButtonX = 0;
	loadCameraButtonY = 0;
	loadCameraWidth = 0;
	loadCameraHeight = 0;

	//About button triggers open of an about page in a new tab
	aboutButtonStyle = {
		stroke: this.p5.color(230, 251, 255),
		strokeWeight: 5,
		fill: this.p5.color(51, 51, 51),
		hoverFill: this.p5.color(76, 76, 76),
		pressedFill: this.p5.color(102, 102, 102)
	};

	ABOUT_BUTTON_STATES = {
		IDLE: "idle",
		HOVER: "hover",
		PRESSED: "pressed"
	};

	aboutState = this.ABOUT_BUTTON_STATES.IDLE;
	aboutButtonX = 0;
	aboutButtonY = 0;
	aboutWidth = 0;
	aboutHeight = 0;

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
		this.initLoadCameraButton();
		this.initAboutButton();
	}

	update() {
		this.updateLoadCameraButton();
		this.updateAboutButton();
	}

	render() {
		super.render();
		//Background - using image for more flexibility
		this.p5.background(51);
		//Render load camera button only before camera loaded
		this.renderLoadCameraButton();
		this.renderAboutButton();
	}

	resize() {
		this.initLoadCameraButton();
		this.initAboutButton();
	}

	cleanup() {
		super.cleanup();
	}

	mousePressed() {
		if (
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.PRESSED &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.LOADING &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.DISABLED
		) {
			//check bounds for render loadCamera
			if (
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.loadCameraButtonX,
					this.loadCameraButtonY,
					this.loadCameraWidth,
					this.loadCameraHeight
				)
			) {
				this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.PRESSED;
			}
		}

		if(this.aboutButtonState != this.ABOUT_BUTTON_STATES.PRESSED){
			if(
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.aboutButtonX,
					this.aboutButtonY,
					this.aboutWidth,
					this.aboutHeight
				)
			) {
				this.aboutButtonState = this.ABOUT_BUTTON_STATES.PRESSED;
			}
		}
	}

	mouseReleased() {
		//if we started a camera state press, release it and trigger the load
		if (this.loadCameraState == this.LOAD_CAMERA_BUTTON_STATES.PRESSED) {
			this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.LOADING;
			this.initMediaPipe();
			//init media pipe
		}

		if (this.aboutButtonState == this.ABOUT_BUTTON_STATES.PRESSED) {
			//TODO: Launch About page.
			this.aboutButtonOnClick();
			
		}
	}

	aboutButtonOnClick(){
		//trigger navigation
		alert("This will launch the about page!");
		//return to idle
		this.aboutButtonState = this.ABOUT_BUTTON_STATES.IDLE;
	}

	renderAboutButton(){
		this.p5.push();
		this.p5.stroke(this.aboutButtonStyle.stroke);
		this.p5.strokeWeight(this.aboutButtonStyle.strokeWeight);
		switch (this.aboutButtonState) {
			case this.ABOUT_BUTTON_STATES.IDLE:
				this.p5.fill(this.aboutButtonStyle.fill);
				break;
			case this.ABOUT_BUTTON_STATES.HOVER:
				this.p5.fill(this.aboutButtonStyle.hoverFill);
				break;
			case this.ABOUT_BUTTON_STATES.PRESSED:
				this.p5.fill(this.aboutButtonStyle.pressedFill);
				break;
			default:
				//error state
				console.log("ERROR RENDERING ABOUT BUTTON");
				break;
		}
		this.p5.rect(this.aboutButtonX, this.aboutButtonY, this.aboutWidth, this.aboutHeight);
		this.p5.pop();
	}

	/** Controls rendering of load camera button.
	 *  States: Camera Loaded, Camera Loading,
	 */
	renderLoadCameraButton() {
		//White square covering bottom half of screen with padding
		this.p5.push();
		this.p5.stroke(this.loadCameraButtonStyle.stroke);
		this.p5.strokeWeight(this.loadCameraButtonStyle.strokeWeight);
		switch (this.loadCameraState) {
			case this.LOAD_CAMERA_BUTTON_STATES.IDLE:
				this.p5.fill(this.loadCameraButtonStyle.fill);
				this.p5.rect(this.loadCameraButtonX, this.loadCameraButtonY, this.loadCameraWidth, this.loadCameraHeight);
				break;
			case this.LOAD_CAMERA_BUTTON_STATES.HOVER:
				this.p5.fill(this.loadCameraButtonStyle.hoverFill);
				this.p5.rect(this.loadCameraButtonX, this.loadCameraButtonY, this.loadCameraWidth, this.loadCameraHeight);
				break;
			case this.LOAD_CAMERA_BUTTON_STATES.PRESSED:
				this.p5.fill(this.loadCameraButtonStyle.pressedFill);
				this.p5.rect(this.loadCameraButtonX, this.loadCameraButtonY, this.loadCameraWidth, this.loadCameraHeight);
				break;
			case this.LOAD_CAMERA_BUTTON_STATES.LOADING:
				this.p5.fill(this.loadCameraButtonStyle.loadingFill);
				this.p5.rect(this.loadCameraButtonX, this.loadCameraButtonY, this.loadCameraWidth, this.loadCameraHeight);
				break;
			case this.LOAD_CAMERA_BUTTON_STATES.DISABLED:
				//don't render anything
				break;
			default:
				//error state
				console.log("ERROR RENDERING LOAD CAMERA BUTTON");
				break;
		}
		this.p5.pop();
	}

	updateAboutButton(){
		if(this.aboutButtonState != this.ABOUT_BUTTON_STATES.PRESSED){
			//check for hover
			if (
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.aboutButtonX,
					this.aboutButtonY,
					this.aboutWidth,
					this.aboutHeight
				)
			) {
				this.aboutButtonState = this.ABOUT_BUTTON_STATES.HOVER;
			} else {
				this.aboutButtonState = this.ABOUT_BUTTON_STATES.IDLE;
			}
		}
	}

	updateLoadCameraButton() {
		//If we are loading, and we detect that the camera has loaded, disable
		if (this.loadCameraState == this.LOAD_CAMERA_BUTTON_STATES.LOADING) {
			//if mediapipe has the camera on and is estimating, we're loaded
			if (this.gameSession.mediapipe) {
				if (this.gameSession.mediapipe.cameraRunning && this.gameSession.mediapipe.estimating) {
					this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.DISABLED;
					this.cameraLoaded = true;
					//TODO: Enable start embodying button(s)
				}
			}
		}
		//Don't update if we're disabled or pressed
		if (
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.PRESSED &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.LOADING &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.DISABLED
		) {
			//check for hover
			if (
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.loadCameraButtonX,
					this.loadCameraButtonY,
					this.loadCameraWidth,
					this.loadCameraHeight
				)
			) {
				this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.HOVER;
			} else {
				this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.IDLE;
			}
		}
	}

	/** Checks if a point is within a bounded box.
	 * TODO: This should be a utility or refactored somewhere generic.
	 * @param {*} pointX
	 * @param {*} pointY
	 * @param {*} rectX
	 * @param {*} rectY
	 * @param {*} width
	 * @param {*} height
	 * @returns
	 */
	pointWithinRectangle(pointX, pointY, rectX, rectY, width, height) {
		let pointInside = pointX > rectX && pointX < rectX + width;
		if (pointInside) {
			pointInside = pointY > rectY && pointY < rectY + height;
		}
		return pointInside;
	}

	/**Initializes renderLoadCameraButton().
	 *
	 */
	initLoadCameraButton() {
		// button on bottom half of screen with 05% padding.
		this.loadCameraButtonX = this.gameSession.canvasWidth * 0.05;
		this.loadCameraButtonY = this.gameSession.canvasHeight * 0.55;
		this.loadCameraHeight = this.gameSession.canvasHeight * 0.4;
		this.loadCameraWidth = this.gameSession.canvasWidth * 0.5;
	}

	/**Initializes aboutButton
	 * 
	 */
	initAboutButton(){
		// button on bottom half of screen with 05% padding.
		this.aboutButtonX = this.gameSession.canvasWidth * 0.6;
		this.aboutButtonY = this.gameSession.canvasHeight * 0.55;
		this.aboutHeight = this.gameSession.canvasHeight * 0.4;
		this.aboutWidth = this.gameSession.canvasWidth * 0.35;
	}

	/**Init Mediapipe
	 *
	 */
	async initMediaPipe() {
		let mediapipe = new Mediapipe();
		this.gameSession.mediapipe = mediapipe;

		try {
			await mediapipe.setup();
		} catch (error) {
			console.error(error);
		}
	}

	onLoadCameraButtonMouseDown() {}
	onLoadCameraButtonMouseUp() {}
	onLoadCameraButtonHover() {}

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
