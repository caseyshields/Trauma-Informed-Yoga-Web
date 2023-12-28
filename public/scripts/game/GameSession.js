import ParticleManager from "../core/GameObject/Particle/ParticleManager.js";
import SoundManager from "../core/Sound/SoundManager.js";
import BreathingManager from "./breathing/BreathingManager.js";
import FormManager from "./form/FormManager.js";
import PoseFilter from "./PoseFilter.js";
import SettingsManager from "./settings/SettingsManager.js";

export default class GameSession {
	constructor() {
		if (GameSession.__instance) {
			return GameSession.__instance;
		}
		GameSession.__instance = this;
		this.__instance = this;
		//Browser Information
		this.__canvasHeight = 0;
		this.__canvasWidth = 0;

		//Instance Variables
		this.__p5 = {}; //P5 instance
		this.__canvas = {}; //P5 Canvas
		// TODO Can we import these directly from P5? 
		// It is possible for setup() phase constructors to reference this while it is empty!

		this.__settingsManager = new SettingsManager();

		// reference to mediapipe manager
		this.__mediapipe = {};

		// array of {x, y, z, score, name} object
		this.__poseLandmarks = {}; //Pose landmarks
		this.__pose = new PoseFilter(8);
		// TODO these seem redundant; can we combine them?

		// instance of Skeleton class
		this.__skeleton = {}; //player skeleton
		this.__skeletonLoaded = false;

		//Important Globals
		this.__backgroundColor = 0;
		this.__flashColor = 0;

		//Particle Manager
		this.__particleManager = new ParticleManager();
		this.__particleManager.setup();

		//Sound Manager
		this.__soundManager = new SoundManager(60);
		this.__soundManager.setup();

		// Breathing Manager
		this.__breathingManager = new BreathingManager(2000,2000,2000,2000);
		this.__breathingManager.play();

		//All states available to game
		this.__states = [];

		//Current state
		this.__currentState = {};

		//reference to form manager
		this.__formManager = {};

		console.log("Session Created Successfully.");
	}

	//used to add states to game on game load or dynamically
	addStateToGame(state) {
		this.states.push(state);
	}

	//simplifies state setup. calls setup and then loads the state into currentState.
	setCurrentState(state) {
		//TODO: Make this safe to add non-pre-existing states
		this.currentState = state;
		this.currentState.setup();
	}

	setCurrentStateByName(stateName) {
		let state;
		for (let i = 0; i < this.states.length; i++) {
			if (this.states[i].name == stateName) {
				state = this.states[i];
			}
		}

		if (state) {
			this.setCurrentState(state);
		} else {
			console.log(`ERROR: ${stateName} not loaded as current state in session.`);
		}
	}

	get settingsManager() {
		return this.__settingsManager;
	}

	set settingsManager(settingsManager) {
		this.__settingsManager = settingsManager;
	}

	get states() {
		return this.__states;
	}

	set states(states) {
		this.__states = states;
	}

	get currentState() {
		return this.__currentState;
	}

	set currentState(currentState) {
		this.__currentState = currentState;
	}

	get skeleton() {
		return this.__skeleton;
	}

	set skeleton(skeleton) {
		this.__skeleton = skeleton;
	}

	get skeletonLoaded() {
		return this.__skeletonLoaded;
	}

	set skeletonLoaded(skeletonLoaded) {
		this.__skeletonLoaded = skeletonLoaded;
	}

	get poseLandmarks() {
		return this.__poseLandmarks;
	}

	set poseLandmarks(poseLandmarks) {
		this.__poseLandmarks = poseLandmarks;
	}

	get pose() {
		return this.__pose;
	}

	get instance() {
		return this.__instance;
	}

	set instance(instance) {
		this.__instance = instance;
	}

	get p5() {
		return this.__p5;
	}
	set p5(p5) {
		this.__p5 = p5;
	}

	get canvas() {
		return this.__canvas;
	}
	set canvas(canvas) {
		this.__canvas = canvas;
	}

	get backgroundColor() {
		return this.__backgroundColor;
	}

	set backgroundColor(backgroundColor) {
		this.__backgroundColor = backgroundColor;
	}

	get flashColor() {
		return this.__flashColor;
	}

	set flashColor(flashColor) {
		this.__flashColor = flashColor;
	}

	get soundManager() {
		return this.__soundManager;
	}

	set soundManager(soundManager) {
		this.__soundManager = soundManager;
	}

	get particleManager() {
		return this.__particleManager;
	}

	set particleManager(particleManager) {
		this.__particleManager = particleManager;
	}

	get breathingManager() {
		return this.__breathingManager;
	}

	set breathingManager(breathingManager) {
		this.__breathingManager = breathingManager
	}

	get canvasHeight() {
		return this.__canvasHeight;
	}

	set canvasHeight(canvasHeight) {
		this.__canvasHeight = canvasHeight;
	}

	get canvasWidth() {
		return this.__canvasWidth;
	}

	set canvasWidth(canvasWidth) {
		this.__canvasWidth = canvasWidth;
	}

	get spriteManager() {
		return this.__spriteManager;
	}

	set spriteManager(spriteManager) {
		this.__spriteManager = spriteManager;
	}

	get mediapipe() {
		return this.__mediapipe;
	}

	set mediapipe(mediapipe) {
		this.__mediapipe = mediapipe;
	}

	get formManager(){
		return this.__formManager;
	}

	set formManager(formManager){
		this.__formManager = formManager;
	}
	
}
