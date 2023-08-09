import State from "../../core/State/State.js";
import Button from "../../core/UI/Button.js";
import TextBox from "../../core/UI/TextBox.js";
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

export default class InfoState extends State {
	backButton = {};

	constructor() {
		super("Info");
        this.__text = "";
	}

	setup() {
		super.setup();

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

		this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "About");
		this.backButton.setup();

        // Instantiate the TextBox for displaying specified content.
		let infoTextBoxLayout = {
			//x: this.gameSession.canvasWidth * .05,
			//y: this.gameSession.canvasHeight * .05,
			//width: this.gameSession.canvasWidth * .05,
			//height: this.gameSession.canvasWidth * .05
            xRatio: 0.075,
            yRatio: 0.15,
            widthRatio: 0.85,
            heightRatio: 0.8,
		};

		let infoTextBoxStyle = {
			//stroke: this.p5.color(255, 255, 255),
			stroke: this.p5.color(0, 0, 0),
			strokeWeight: 5,
			fill: this.p5.color(0, 0, 0),
			hoverFill: this.p5.color(0, 0, 0),
			pressedFill: this.p5.color(0, 0, 0),
			loadingFill: this.p5.color(62, 62, 62),
			disabledFill: this.p5.color(125, 0, 0),
		}

        let infoText = {
            text: "",
            textRatio: 45,
        };

		this.infoTextBox = new TextBox(infoTextBoxLayout, infoTextBoxStyle, infoText);
	}

    get text() {
        return this.__text;
    }

    set text(text) {
        this.__text = text;
        this.infoTextBox.displayInfo = text;
    }

	render() {
		super.render();

        //UI
        this.backButton.render();
        this.infoTextBox.render();
	}

	update() {
		super.update();

        //UI
        this.backButton.render();
        this.infoTextBox.update();

        this.backButton.resize(
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasHeight * .05,
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasWidth * .05
		);
	}

    mousePressed(){
		this.backButton.checkPressed();
		this.infoTextBox.checkPressed();
	}

	mouseReleased(){
		this.backButton.checkReleased();

		this.infoTextBox.checkReleased(() => {
            //alert(this.__text);
        });
	}
	

	cleanup() {
		super.update();
	}

}
