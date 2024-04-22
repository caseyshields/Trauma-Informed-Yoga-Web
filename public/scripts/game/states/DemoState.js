import State from "../../core/State/State.js";
import Skeleton from "../skeleton/Skeleton.js";
import Target from "../form/Target.js";
import Narrator from "../narrator/Narrator.js";
import Silhouette from "../souvenir/Silhouette.js";
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

export default class DemoState extends State {
	backButton = {};
	menuButton = {};
	narrator = {};
	silhouette = {};
	// why are fields instantiated with anonymous classes?
	
	constructor() {
		super("Demo");

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

		this.clearscreen = this.p5.createElement('button', 'Clear Screen');
		this.clearscreen.parent( this.section );
		this.clearscreen.mousePressed( ()=>{
			this.silhouette.clear();
			this.p5.clear();
		})

		//Make sure skeleton is already loaded, load if not
		if(!this.gameSession.skeletonLoaded){
			this.gameSession.skeleton = new Skeleton();
			this.gameSession.skeletonLoaded = true;
		}

		// Create the various Graphics objects
		this.silhouette = new Silhouette();// Silhouette.DefaultConfiguration );
	}

	// TODO load style from some configuration
	// TODO allow the user to edit it in game

	setup() {
		super.setup();
		this.section.removeAttribute('style');

		// TODO Figure out how to add all souvenirs' configurations to setting manager
		// needs to generalize to any configurable thing; audio, forms, etc...
		this.initializeGameFromSettings();

		// reference to form manager
		this.gameSession.formManager = new FormManager();
		this.gameSession.formManager.setup();

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

		// this.silhouette.render();
		
		//Render skeleton
		// this.gameSession.skeleton.render();
		// TODO I'm rendering the filter instead! Should the Skeleton be updated to also use the Filter?

		this.gameSession.formManager.render();

		//TODO: Make generic and add logic to exist across multiple states... singleton.
		//Test Narrator
		this.narrator.render();
	}

	resize() {
		super.resize();
		this.narrator.resize();
		// TODO resize souvenirs too!
	}

	update() {
		super.update();


		//Update skeleton
		this.gameSession.skeleton.update();

		// Update breathing
		this.gameSession.breathingManager.update();

		//Test Target
		this.gameSession.formManager.update();

		this.narrator.update();
	}

	initializeGameFromSettings() {
		//Look at settings manager

		//Set relevant audio systems

		//Set relevant visual systems

		//Set relevant mechanics systems (form, narrator, targets, particles...)
	}

	mousePressed() {}

	mouseReleased() {}
	
	keyPressed() {
		console.log(this.p5.key);
	}

	cleanup() {
		super.update();
	}

	get gameBackground() {
		return this.__gameBackground;
	}

	get configuration() {
		return {
			silhouette : this.silhouette.configuration,
		};
	}
}
