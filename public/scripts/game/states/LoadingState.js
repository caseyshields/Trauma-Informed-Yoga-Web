import GameSession from "../../core/GameSession.js";
import State from "../../core/State.js";
import Mediapipe from "../../core/Mediapipe.js";
/** Initial state used to welcome a user into the game and
 * load libraries in the background.
 *
 */

export default class LoadingState extends State {
	
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
		this.initFreeButton();
		this.initGuidedButton();
	}

	update() {
		super.update();

		this.updateLoadCameraButton();
		this.updateAboutButton();
		this.updateGuidedButton();
		this.updateFreeButton();
	}

	render() {
		super.render();
		//Background - using image for more flexibility
		this.p5.background(51);
		//Render load camera button only before camera loaded
		this.renderLoadCameraButton();
		this.renderAboutButton();
		this.renderGuidedButton();
		this.renderFreeButton();
	}

	resize() {
		super.resize(); 

		this.initLoadCameraButton();
		this.initAboutButton();
		this.initFreeButton();
		this.initGuidedButton();
	}

	cleanup() {
		super.cleanup();
		//TODO: Delete all unnecessary data to prevent leaks/namespace collisions
	}

	mousePressed() {
		//Look for collisions with buttons
		//LOAD CAMERA
		if (this.pointWithinRectangle
			(
				this.p5.mouseX,
				this.p5.mouseY,
				this.loadCameraButtonX,
				this.loadCameraButtonY,
				this.loadCameraWidth,
				this.loadCameraHeight
			)
		) {
			this.onLoadCameraButtonPressed();
		}
		//ABOUT BUTTON
		if(this.pointWithinRectangle(
			this.p5.mouseX,
			this.p5.mouseY,
			this.aboutButtonX,
			this.aboutButtonY,
			this.aboutWidth,
			this.aboutHeight
		)) {
			this.onAboutButtonPressed();
		}

		//FREE BUTTON
		if(this.pointWithinRectangle(
			this.p5.mouseX,
			this.p5.mouseY,
			this.freeButtonX,
			this.freeButtonY,
			this.freeButtonWidth,
			this.freeButtonHeight
		)){
			this.onFreeButtonPressed();
		}

		//GUIDED BUTTON
		if(this.pointWithinRectangle(
			this.p5.mouseX,
			this.p5.mouseY,
			this.guidedButtonX,
			this.guidedButtonY,
			this.guidedButtonWidth,
			this.guidedButtonHeight
		)){
			this.onGuidedButtonPressed();
		}
	}

	mouseReleased() {
		//if we started a camera state press, release it and trigger the load
		if (this.loadCameraState == this.LOAD_CAMERA_BUTTON_STATES.PRESSED) {
			this.onLoadCameraButtonReleased();
		}

		if (this.aboutButtonState == this.ABOUT_BUTTON_STATES.PRESSED) {
			//TODO: Launch About page.
			this.onAboutButtonReleased();
		}

		if (this.freeButtonState == this.FREE_BUTTON_STATES.PRESSED) {
			this.onFreeButtonReleased();
		}

		if (this.guidedButtonState == this.GUIDED_BUTTON_STATES.PRESSED) {
			this.onGuidedButtonReleased();
		}
	}

	/** Checks if a point is within a bounded box.
	 * TODO: This should be a utility or refactored somewhere generic.
	 * We can likely use gameObject intersection methods instead of a direct
	 * comparison.
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

	/**Init Mediapipe
	 *
	 */
	async initMediaPipe() {
		let mediapipe = Mediapipe.getInstance();
		this.gameSession.mediapipe = mediapipe;

		try {
			await mediapipe.setup();
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


	/**UI Components. TODO: Refactor to framework "button" class
	 * 
	 */


	//ABOUT BUTTON
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

	initAboutButton(){
		// button on bottom half of screen with 05% padding.
		this.aboutButtonX = this.gameSession.canvasWidth * 0.6;
		this.aboutButtonY = this.gameSession.canvasHeight * 0.55;
		this.aboutHeight = this.gameSession.canvasHeight * 0.4;
		this.aboutWidth = this.gameSession.canvasWidth * 0.35;
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

	onAboutButtonPressed(){
		if(this.aboutButtonState != this.ABOUT_BUTTON_STATES.PRESSED){
			this.aboutButtonState = this.ABOUT_BUTTON_STATES.PRESSED;
		}
	}

	onAboutButtonReleased(){
		//trigger navigation
		alert("This will launch the about page!");
		//return to idle
		this.aboutButtonState = this.ABOUT_BUTTON_STATES.IDLE;
	}

	//LOAD CAMERA BUTTON - Load camera button triggers init of mediapipe
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

	initLoadCameraButton() {
		// button on bottom half of screen with 05% padding.
		this.loadCameraButtonX = this.gameSession.canvasWidth * 0.05;
		this.loadCameraButtonY = this.gameSession.canvasHeight * 0.55;
		this.loadCameraHeight = this.gameSession.canvasHeight * 0.4;
		this.loadCameraWidth = this.gameSession.canvasWidth * 0.5;
	}
	
	updateLoadCameraButton() {
		//If we are loading, and we detect that the camera has loaded, disable
		if (this.loadCameraState == this.LOAD_CAMERA_BUTTON_STATES.LOADING) {
			//if mediapipe has the camera on and is estimating, we're loaded
			if (this.gameSession.mediapipe) {
				if (this.gameSession.mediapipe.cameraRunning && this.gameSession.mediapipe.estimating) {
					//disable load camera, enable start game buttons
					this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.DISABLED;
					this.aboutButtonState = this.ABOUT_BUTTON_STATES.IDLE;
					this.freeButtonState = this.FREE_BUTTON_STATES.IDLE;
					this.guidedButtonState = this.GUIDED_BUTTON_STATES.IDLE;
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

	onLoadCameraButtonPressed() {
		if (
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.PRESSED &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.LOADING &&
			this.loadCameraState != this.LOAD_CAMERA_BUTTON_STATES.DISABLED
		) {
			this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.PRESSED;
		}
	}

	onLoadCameraButtonReleased() {
		this.loadCameraState = this.LOAD_CAMERA_BUTTON_STATES.LOADING;
		this.initMediaPipe();
		//init media pipe
	}

	onLoadCameraButtonHover() {}

	//Free Button  
	freeButtonStyle = {
		stroke: this.p5.color(230, 251, 255),
		strokeWeight: 5,
		fill: this.p5.color(51, 51, 51),
		hoverFill: this.p5.color(76, 76, 76),
		pressedFill: this.p5.color(102, 102, 102)
	}

	FREE_BUTTON_STATES = {
		IDLE: "idle",
		HOVER: "hover",
		PRESSED: "pressed",
		DISABLED: "disabled"
	}

	freeButtonState = this.FREE_BUTTON_STATES.DISABLED;
	freeButtonX = 0;
	freeButtonY = 0;
	freeButtonWidth = 0;
	freeButtonHeight = 0;

	initFreeButton(){
		// button on bottom half of screen with 05% padding.
		this.freeButtonX = this.gameSession.canvasWidth * 0.05;
		this.freeButtonY = this.gameSession.canvasHeight * 0.55;
		this.freeButtonHeight = this.gameSession.canvasHeight * 0.175;
		this.freeButtonWidth = this.gameSession.canvasWidth * 0.5;
	}

	renderFreeButton(){
		//White square covering bottom half of screen with padding
		this.p5.push();
		this.p5.stroke(this.freeButtonStyle.stroke);
		this.p5.strokeWeight(this.freeButtonStyle.strokeWeight);
		switch (this.freeButtonState) {
			case this.FREE_BUTTON_STATES.IDLE:
				this.p5.fill(this.freeButtonStyle.fill);
				this.p5.rect(this.freeButtonX, this.freeButtonY, this.freeButtonWidth, this.freeButtonHeight);
				break;
			case this.FREE_BUTTON_STATES.HOVER:
				this.p5.fill(this.freeButtonStyle.hoverFill);
				this.p5.rect(this.freeButtonX, this.freeButtonY, this.freeButtonWidth, this.freeButtonHeight);				
				break;
			case this.FREE_BUTTON_STATES.PRESSED:
				this.p5.fill(this.freeButtonStyle.pressedFill);
				this.p5.rect(this.freeButtonX, this.freeButtonY, this.freeButtonWidth, this.freeButtonHeight);
				break;
			case this.FREE_BUTTON_STATES.DISABLED:
				//don't render anything
				break;
			default:
				//error state
				console.log("ERROR RENDERING FREE BUTTON");
				break;
		}
		this.p5.pop();
	}

	updateFreeButton(){
		if(
			this.freeButtonState != this.FREE_BUTTON_STATES.PRESSED && 
			this.freeButtonState != this.FREE_BUTTON_STATES.DISABLED
		){
			//check for hover
			if (
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.freeButtonX,
					this.freeButtonY,
					this.freeButtonWidth,
					this.freeButtonHeight
				)
			) {
				this.freeButtonState = this.FREE_BUTTON_STATES.HOVER;
			} else {
				this.freeButtonState = this.FREE_BUTTON_STATES.IDLE;
			}
		}
	}

	//Move to calibration state
	onFreeButtonPressed(){
		if(
			this.freeButtonState != this.FREE_BUTTON_STATES.DISABLED &&
			this.freeButtonState != this.FREE_BUTTON_STATES.PRESSED
			){
			this.freeButtonState = this.FREE_BUTTON_STATES.PRESSED;	
		}
	}

	onFreeButtonReleased(){
		//TODO: Cleanup
		this.gameSession.setCurrentStateByName("Calibration");

	}

	//Guided button
	guidedButtonStyle = {
		stroke: this.p5.color(230, 251, 255),
		strokeWeight: 5,
		fill: this.p5.color(51, 51, 51),
		hoverFill: this.p5.color(76, 76, 76),
		pressedFill: this.p5.color(102, 102, 102)
	}

	GUIDED_BUTTON_STATES = {
		IDLE: "idle",
		HOVER: "hover",
		PRESSED: "pressed",
		DISABLED: "disabled"
	}

	guidedButtonState = this.GUIDED_BUTTON_STATES.DISABLED;
	guidedButtonX = 0;
	guidedButtonY = 0;
	guidedButtonWidth = 0;
	guidedButtonHeight = 0;

	initGuidedButton(){
		// button on bottom half of screen with 05% padding.
		this.guidedButtonX = this.gameSession.canvasWidth * 0.05;
		this.guidedButtonY = this.gameSession.canvasHeight * 0.775;
		this.guidedButtonHeight = this.gameSession.canvasHeight * 0.175;
		this.guidedButtonWidth = this.gameSession.canvasWidth * 0.5;
	}

	renderGuidedButton(){
		//White square covering bottom half of screen with padding
		this.p5.push();
		this.p5.stroke(this.guidedButtonStyle.stroke);
		this.p5.strokeWeight(this.guidedButtonStyle.strokeWeight);
		switch (this.guidedButtonState) {
			case this.GUIDED_BUTTON_STATES.IDLE:
				this.p5.fill(this.guidedButtonStyle.fill);
				this.p5.rect(this.guidedButtonX, this.guidedButtonY, this.guidedButtonWidth, this.guidedButtonHeight);
				break;
			case this.GUIDED_BUTTON_STATES.HOVER:
				this.p5.fill(this.guidedButtonStyle.hoverFill);
				this.p5.rect(this.guidedButtonX, this.guidedButtonY, this.guidedButtonWidth, this.guidedButtonHeight);				
				break;
			case this.GUIDED_BUTTON_STATES.PRESSED:
				this.p5.fill(this.guidedButtonStyle.pressedFill);
				this.p5.rect(this.guidedButtonX, this.guidedButtonY, this.guidedButtonWidth, this.guidedButtonHeight);
				break;
			case this.GUIDED_BUTTON_STATES.DISABLED:
				//don't render anything
				break;
			default:
				//error state
				console.log("ERROR RENDERING GUIDED BUTTON");
				break;
		}
		this.p5.pop();
	}

	updateGuidedButton(){
		if(
			this.guidedButtonState != this.GUIDED_BUTTON_STATES.PRESSED &&
			this.guidedButtonState != this.GUIDED_BUTTON_STATES.DISABLED
		){
			//check for hover
			if (
				this.pointWithinRectangle(
					this.p5.mouseX,
					this.p5.mouseY,
					this.guidedButtonX,
					this.guidedButtonY,
					this.guidedButtonWidth,
					this.guidedButtonHeight
				)
			) {
				this.guidedButtonState = this.GUIDED_BUTTON_STATES.HOVER;
			} else {
				this.guidedButtonState = this.GUIDED_BUTTON_STATES.IDLE;
			}
		}
	}

	//Right now, both of these lead to the same state.
	//TODO: Add a clean vs. guided section
	onGuidedButtonPressed(){		
		if(
			this.guidedButtonState != this.GUIDED_BUTTON_STATES.DISABLED &&
			this.guidedButtonState != this.GUIDED_BUTTON_STATES.PRESSED
		){
			this.guidedButtonState = this.Guided_BUTTON_STATES.PRESSED;	
		}
	}

	onGuidedButtonReleased(){
		//TODO: Cleanup
		this.gameSession.setCurrentStateByName("Calibration");
	}

}
