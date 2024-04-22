import GameSession from "./game/GameSession.js";
import GameState from "./game/states/GameState.js";
import CreditState from "./game/states/CreditState.js";
import TitleState from "./game/states/TitleState.js";
import ConfigState from "./game/states/ConfigState.js";
import DemoState from "./game/states/DemoState.js";

/**TODOS:
SETUP should be abstracted to be made easier to use.

*/

//Instantiate our Game Session - this will be our parent for all game data.
let gameSession = new GameSession();

let RenderPoseFilter = true; // Displays the pose filter for debugging

//Define how our P5 sketch will look. Treat this as the "Main".
var TIYW = function (p) {
	//Executed before beginning setup
	p.preload = function () {
		//Load any assets or libraries
	};

	//Executed before draw
	p.setup = function () {
		//Set canvas to browser size
		gameSession.canvasWidth = window.innerWidth;
		gameSession.canvasHeight = window.innerHeight;

		//instantiate canvas and indicate parent div
		var canvas = p.createCanvas(window.innerWidth, window.innerHeight);
		canvas.parent("canvas");

		//save canvas reference to gameSession
		gameSession.canvas = canvas;

		//Library loading and camera initialization
		let loadingState = new TitleState();
		gameSession.addStateToGame(loadingState);

		//Instantiate all relevant game states and add them to the session.
		let gameState = new GameState();
		gameSession.addStateToGame(gameState);

		let creditState = new CreditState();
		gameSession.addStateToGame( creditState );

		//Instantiate scene for game configurations
		let configState = new ConfigState();
		gameSession.addStateToGame( configState );

		// instantiate a shader demo
		let demoState = new DemoState();
		gameSession.addStateToGame( demoState );

		//Set initial game state as loading, call setup method
		gameSession.setCurrentState(loadingState);

		//P5 configurations
		p.frameRate(30);
		p.imageMode(p.CENTER);

		// initialize the Pose filter
		gameSession.pose.setup();
		// TODO is this the right place for this?
	};

	//core update function of the game
	p.draw = function () {
		//background
		p.background(21);

		//Call managers and top-level state to update each frame.
		gameSession.currentState.update();
		gameSession.particleManager.update();
		gameSession.soundManager.update();
		gameSession.pose.update(); // TODO should this be updated with 'poseLandmarks'?
		// TODO should gameSession just have an update() method? is this unnecessary coupling?

		//Renders last and from back to front. Clear before going.
		p.clear();
		p.angleMode(p.DEGREES);

		//Render according to current top-level state and manager
		gameSession.currentState.render();
		gameSession.particleManager.render();
		gameSession.soundManager.render();
		if (RenderPoseFilter)
			gameSession.pose.render();
	};

	//implement your controls inside of your specific state.
	p.mousePressed = function () {
		//call gameState code here as needed.
	};

	p.keyPressed = function () {
		if (gameSession.currentState.keyPressed)
			this.gameSession.currentState.keyPressed
		// TODO why isn't this working?
		// console.log(p.key);
		//call gameState code here as needed.
	};

	p.keyReleased = function () {
		//call gameState code here as needed.
	};

	p.keyTyped = function () {
		//call gameState code here as needed.
	};

	p.keyIsDown = function () {
		//call gameState code here as needed.
	};

	p.mouseMoved = function () {
		//call gameState code here as needed.
	};

	p.mouseDragged = function () {
		//call gameState code here as needed.
	};

	p.mousePressed = function () {
		if (gameSession.currentState.mousePressed) {
			gameSession.currentState.mousePressed();
		}
	};

	p.mouseReleased = function () {
		if (gameSession.currentState.mouseReleased) {
			gameSession.currentState.mouseReleased();
		}
	};

	p.mouseClicked = function () {
		//call gameState code here as needed.
	};

	p.doubleClicked = function () {
		//call gameState code here as needed.
	};

	p.mouseWheel = function () {
		//call gameState code here as needed.
	};

	p.requestPointerLock = function () {
		//call gameState code here as needed.
	};

	p.exitPointerLock = function () {
		//call gameState code here as needed.
	};

	p.getAngle = function (x1, y1, x2, y2) {
		let angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
		return angle;
	};

	// Manage game input.
	p.keyPressed = function () {};

	p.windowResized = function () {
		gameSession.canvasWidth = window.innerWidth;
		gameSession.canvasHeight = window.innerHeight;

		p.resizeCanvas(gameSession.canvasWidth, gameSession.canvasHeight);
		
		gameSession.currentState.resize();
	};
};

//Instantiate P5 and attach it to our gameSession instance
gameSession.p5 = new p5(TIYW, "canvas");
