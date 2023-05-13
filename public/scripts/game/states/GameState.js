import State from "../../core/State.js";
import Skeleton from "../Skeleton.js";
import BackButton from "../buttons/BackButton.js";

/** Example of Gamestate
 *
 *  1. Renders a background
 *  2. Takes poseLandmarks and renders a skeleton
 *  3. Loads relevant game items (charge pack, etc.)
 *  4. Goes through 4 poses
 *  5. Transition to game over
 *
 * Alt: Game over on empty charge pack for 5 seconds
 */

export default class GameState extends State {
	backButton = {};
	
	constructor() {
		super("Game");
		
	}

	setup() {
		super.setup();

		if(!this.gameSession.skeletonLoaded){
			this.gameSession.skeleton = new Skeleton();
			this.gameSession.skeletonLoaded = true;
		}

		//Instantiate backbutton
		let backButtonLayout = {
			x: this.gameSession.canvasWidth * .05,
			y: this.gameSession.canvasHeight * .05,
			width: this.gameSession.canvasWidth * .05,
			height: this.gameSession.canvasWidth * .05
		}

		let backButtonStyle = {
			stroke: this.p5.color(255, 255, 255),
			strokeWeight: 5,
			fill: this.p5.color(0, 0, 0),
			hoverFill: this.p5.color(123, 123, 123),
			pressedFill: this.p5.color(255, 255, 255),
			loadingFill: this.p5.color(62, 62, 62),
			disabledFill: this.p5.color(125, 0, 0),
		}


		this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "Loading");
		this.backButton.setup();
	}

	render() {
		super.render();

		//Render skeleton
		this.gameSession.skeleton.render();
		this.backButton.render();

	}

	resize() {
		super.resize();
		//TODO: I'm almost sure there's a better way for us to structure resize
		
		this.backButton.resize(
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasHeight * .05,
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasWidth * .05
		);
	}

	update() {
		super.update();

		//Update skeleton
		this.gameSession.skeleton.update();
		this.backButton.update();
	}

	mousePressed(){
		this.backButton.checkPressed();
	}

	mouseReleased(){
		this.backButton.checkReleased();
	}
	

	cleanup() {
		super.update();
	}

	get gameBackground() {
		return this.__gameBackground;
	}
}
