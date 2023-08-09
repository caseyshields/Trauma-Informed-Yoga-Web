import GameSession from "./game/GameSession.js";
import GameState from "./game/states/GameState.js";
import LoadingState from "./game/states/LoadingState.js";
import MenuState from "./game/states/MenuState.js";
import AboutState from "./game/states/AboutState.js";
import InfoState from "./game/states/InfoState.js";

/**TODOS:
SETUP should be abstracted to be made easier to use.

*/

//Instantiate our Game Session - this will be our parent for all game data.
let gameSession = new GameSession();

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
		let loadingState = new LoadingState();
		gameSession.addStateToGame(loadingState);

		//Instantiate all relevant game states and add them to the session.
		let gameState = new GameState();
		gameSession.addStateToGame(gameState);

		//Instantiate scene for game configurations
		let menuState = new MenuState();
		gameSession.addStateToGame(menuState);

		//Instantiate scene for about page
		let aboutState = new AboutState();
		gameSession.addStateToGame(AboutState);

		//Instantiate scene for info page
		let infoState = new InfoState();
		gameSession.addStateToGame(infoState);

		//Set initial game state as loading, call setup method
		gameSession.setCurrentState(loadingState);

		//P5 configurations
		p.frameRate(30);
		p.imageMode(p.CENTER);

	};

	//core update function of the game
	p.draw = function () {
		//background
		p.background(21);

		//Call managers and top-level state to update each frame.
		gameSession.currentState.update();
		gameSession.particleManager.update();
		gameSession.soundManager.update();

		//Renders last and from back to front. Clear before going.
		p.clear();
		p.angleMode(p.DEGREES);

		//Render according to current top-level state and manager
		gameSession.currentState.render();
		gameSession.particleManager.render();
		gameSession.soundManager.render();
	};

	//implement your controls inside of your specific state.
	p.mousePressed = function () {
		//call gameState code here as needed.
	};

	p.keyPressed = function () {
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
		//call gameState code here as needed.
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
