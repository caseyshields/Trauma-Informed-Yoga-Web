import State from "../../core/State/State.js";

export default class MenuState extends State {
	
	constructor() {
		super("Menu");

		
		
	}

	setup() {
		super.setup();

		this.initializeMenuFromSettings();

    }

	render() {
		super.render();

    }

	update() {
		super.update();

		this.updateSettingsFromMenuUI();
	}

	initializeMenuFromSettings(){
		//TODO: Read settings manager defaults or current values to set current menu values
	}

	updateSettingsFromMenuUI(){
		//TODO: Read new user inputs and update the settings manager accordingly
	}

    mousePressed(){
	}

	mouseReleased(){
	}
	

	cleanup() {
		super.update();
	}

}
