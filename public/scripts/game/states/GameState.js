import State from "../../core/State/State.js";
import Skeleton from "../skeleton/Skeleton.js";
import Target from "../form/Target.js";
import Narrator from "../narrator/Narrator.js";
import Diaphragm from "../breathing/Diaphragm.js";
import Silhouette from "../souvenir/Silhouette.js";
// import SmokeTrails from "../souvenir/PoseTrail.js";
import SmokeTrails from "../souvenir/SmokeTrails.js";
import FormManager from "../form/FormManager.js";

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
	testTarget1 = {};
	narrator = {};
	diaphragm = {};
	silhouette = {};
	smoke = {}; 
	// why are fields instantiated with anonymous classes?
	
	constructor() {
		super("Game");

		this.section = this.p5.createElement( 'section' );
		this.section.class( 'game' );
		this.section.attribute('style', 'display:none');

		this.back = this.p5.createElement( 'img' );
		this.back.attribute('src', '../../../assets/images/back.svg');
		this.back.parent( this.section );
		this.back.mousePressed( ()=>{
			this.gameSession.setCurrentStateByName('Loading');
		});

		this.menu = this.p5.createElement( 'img' );
		this.menu.attribute('src', '../../../assets/images/menu.svg');
		this.menu.parent( this.section );
		this.menu.mousePressed( ()=>{
			this.gameSession.setCurrentStateByName('Config');
		});

		this.screenshot = this.p5.createElement( 'button', 'Screenshot' );
		this.screenshot.parent( this.section );
		this.screenshot.mousePressed( ()=>{
			this.p5.saveCanvas("screenshot.jpg");
		});
	}

	// TODO load style from some configuration
	// TODO allow the user to edit it in game

	setup() {
		super.setup();
		this.section.removeAttribute('style');

		this.initializeGameFromSettings();

				//reference to form manager
		this.gameSession.formManager = new FormManager();
		this.gameSession.formManager.setup();
		

		//Make sure skeleton is already loaded, load if not
		if(!this.gameSession.skeletonLoaded){
			this.gameSession.skeleton = new Skeleton();
			this.gameSession.skeletonLoaded = true;
		}

		this.diaphragm = new Diaphragm( this.gameSession.skeleton );
		this.silhouette = new Silhouette( Silhouette.DefaultConfiguration );
		this.smoke = new SmokeTrails( SmokeTrails.DefaultConfiguration );

		//Instantiate backbutton
		// let backButtonLayout = {
		// 	x: this.gameSession.canvasWidth * .05,
		// 	y: this.gameSession.canvasHeight * .05,
		// 	width: this.gameSession.canvasWidth * .05,
		// 	height: this.gameSession.canvasWidth * .05
		// }

		// let backButtonStyle = {
		// 	stroke: this.p5.color(255, 255, 255),
		// 	strokeWeight: 5,
		// 	fill: this.p5.color(0, 0, 0),
		// 	hoverFill: this.p5.color(123, 123, 123),
		// 	pressedFill: this.p5.color(255, 255, 255),
		// 	loadingFill: this.p5.color(62, 62, 62),
		// 	disabledFill: this.p5.color(125, 0, 0),
		// }

		// this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "Loading");
		// this.backButton.setup();

		// //Instantiate menubutton
		// let menuButtonLayout = {
		// 	x: this.gameSession.canvasWidth * .9,
		// 	y: this.gameSession.canvasHeight * .9,
		// 	width: this.gameSession.canvasWidth * .05,
		// 	height: this.gameSession.canvasWidth * .05
		// }

		// let menuButtonStyle = {
		// 	stroke: this.p5.color(255, 255, 255),
		// 	strokeWeight: 5,
		// 	fill: this.p5.color(0, 0, 0),
		// 	hoverFill: this.p5.color(123, 123, 123),
		// 	pressedFill: this.p5.color(255, 255, 255),
		// 	loadingFill: this.p5.color(62, 62, 62),
		// 	disabledFill: this.p5.color(125, 0, 0),
		// }

		// this.menuButton = new MenuButton(menuButtonLayout, menuButtonStyle, false, "Menu");
		// this.menuButton.setup();

		this.narrator = new Narrator();
		this.narrator.setup();

		//TODO: Test background waves out
		this.gameSession.soundManager.waveSound.startLoop();
	}

	setdown() {
		this.section.attribute('style', 'display:none;');
		//TODO also deactivate sound, narrator, skeleton, poses etc!
	}

	render() {
		super.render();

		this.silhouette.render();
		// this.diaphragm.render();
		this.smoke.render();
		
		//Render skeleton
		// this.gameSession.skeleton.render();
		// TODO I'm rendering the filter instead! Should the Skeleton be updated to also use the Filter?

		this.gameSession.formManager.render();

		//UI
		// this.backButton.render();
		// this.menuButton.render();

		//TODO: Make generic and add logic to exist across multiple states... singleton.
		//Test Narrator
		this.narrator.render();
	}

	resize() {
		super.resize();
		//TODO: I'm almost sure there's a better way for us to structure resize
		
		// this.backButton.resize(
		// 	this.gameSession.canvasWidth * .05,
		// 	this.gameSession.canvasHeight * .05,
		// 	this.gameSession.canvasWidth * .05,
		// 	this.gameSession.canvasWidth * .05
		// );

		// this.menuButton.resize(
		// 	this.gameSession.canvasWidth * .9,
		// 	this.gameSession.canvasHeight * .05,
		// 	this.gameSession.canvasWidth * .05,
		// 	this.gameSession.canvasWidth * .05
		// );

		this.narrator.resize();
	}

	update() {
		super.update();

		//this.diaphragm.update(); // unnecessary but here for consistency or if something changes...

		//Update skeleton
		this.gameSession.skeleton.update();

		// Update breathing
		this.gameSession.breathingManager.update();

		//Test Target
		this.gameSession.formManager.update();

		//UI
		// this.backButton.update();
		// this.menuButton.update();

		this.narrator.update();
	}

	initializeGameFromSettings() {
		//Look at settings manager

		//Set relevant audio systems

		//Set relevant visual systems

		//Set relevant mechanics systems (form, narrator, targets, particles...)
	}

	mousePressed(){
		// this.backButton.checkPressed();
		// this.menuButton.checkPressed();
	}

	mouseReleased(){
		// this.backButton.checkReleased();
		// this.menuButton.checkReleased();
	}
	
	keyPressed() {
		console.log(this.p5.key);
	}

	cleanup() {
		super.update();
	}

	get gameBackground() {
		return this.__gameBackground;
	}

}
