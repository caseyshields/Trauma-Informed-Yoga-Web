import State from "../../core/State.js";
import Skeleton from "../skeleton/Skeleton.js";
import BackButton from "../buttons/BackButton.js";
import MenuButton from "../buttons/MenuButton.js";
import Target from "../form/Target.js";

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
	menuButton = {};
	testTarget = {};
	
	constructor() {
		super("Game");
		
	}

	setup() {
		super.setup();

		//Make sure skeleton is already loaded, load if not
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

		//Instantiate menubutton
		let menuButtonLayout = {
			x: this.gameSession.canvasWidth * .9,
			y: this.gameSession.canvasHeight * .9,
			width: this.gameSession.canvasWidth * .05,
			height: this.gameSession.canvasWidth * .05
		}

		let menuButtonStyle = {
			stroke: this.p5.color(255, 255, 255),
			strokeWeight: 5,
			fill: this.p5.color(0, 0, 0),
			hoverFill: this.p5.color(123, 123, 123),
			pressedFill: this.p5.color(255, 255, 255),
			loadingFill: this.p5.color(62, 62, 62),
			disabledFill: this.p5.color(125, 0, 0),
		}

		this.menuButton = new MenuButton(menuButtonLayout, menuButtonStyle, false, "Menu");
		this.menuButton.setup();

		//TODO: Test target out
		let testBone = this.gameSession.skeleton.getBone("Left Innerpalm");
		//find target item
		this.testTarget = new Target(500, -500, 50, testBone, 100, true, this.gameSession.skeleton);
		
	}

	render() {
		super.render();

		//Render skeleton
		this.gameSession.skeleton.render();

		//Test target
		this.testTarget.render();

		//UI
		this.backButton.render();
		this.menuButton.render();
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

		this.menuButton.resize(
			this.gameSession.canvasWidth * .9,
			this.gameSession.canvasHeight * .05,
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasWidth * .05
		);
	}

	update() {
		super.update();

		//Update skeleton
		this.gameSession.skeleton.update();

		//Test Target
		this.testTarget.update();

		//UI
		this.backButton.update();
		this.menuButton.update();
	}

	mousePressed(){
		this.backButton.checkPressed();
		this.menuButton.checkPressed();
	}

	mouseReleased(){
		this.backButton.checkReleased();
		this.menuButton.checkReleased();
	}
	
	cleanup() {
		super.update();
	}

	get gameBackground() {
		return this.__gameBackground;
	}

}
