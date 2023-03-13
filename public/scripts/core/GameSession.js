import SoundManager from "./Managers/SoundManager.js";
import TimeManager from "./Managers/TimeManager.js";
import ParticleManager from "./Managers/ParticleManager.js";
import SpriteManager from "./Managers/SpriteManager.js";
import ParticleSystemDefinitions from "./Effects/ParticleEffects/ParticleSystemDefinitions.js";

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

		// array of {x, y, z, score, name} object
		this.__poseLandmarks = {}; //Pose landmarks

		// instance of Skeleton class
		this.__skeleton = {}; //player skeleton

		//Important Globals
		this.__backgroundColor = 0;
		this.__flashColor = 0;

		//SoundManager
		this.__soundManager = new SoundManager();

		//TimeManager
		this.__timeManager = new TimeManager();

		//Particle Manager
		this.__particleManager = new ParticleManager();

		//Sprite Manager
		this.__spriteManager = new SpriteManager();

		//Object stores particle system definitions
		this.__particleSystemDefinitions = new ParticleSystemDefinitions();

		//All states available to game
		this.__states = [];

		//Current state
		this.__currentState = {};

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

	get poseLandmarks() {
		return this.__poseLandmarks;
	}

	set poseLandmarks(poseLandmarks) {
		this.__poseLandmarks = poseLandmarks;
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

	get timeManager() {
		return this.__timeManager;
	}

	set timeManager(timeManager) {
		this.__timeManager = timeManager;
	}

	get screenShakeManager() {
		return this.__screenShakeManager;
	}

	set screenShakeManager(screenShakeManager) {
		this.__screenShakeManager = screenShakeManager;
	}

	get particleManager() {
		return this.__particleManager;
	}

	set particleManager(particleManager) {
		this.__particleManager = particleManager;
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

	get particleSystemDefinitions() {
		return this.__particleSystemDefinitions;
	}
}
