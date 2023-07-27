//does this work
import State from "../../core/State/State.js";
import BackButton from "../buttons/BackButton.js";

export default class AboutState extends State {
    backButton = {};


    constructor() {
        super("About");
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

        this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "Game");
        this.backButton.setup();
    }

    render() {
        super.render();

        //UI
        this.backButton.render();
    }

    resize() {
        super.resize();

        this.backButton.resize(
            this.gameSession.canvasWidth * .05,
            this.gameSession.canvasHeight * .05,
            this.gameSession.canvasWidth * .05,
            this.gameSession.canvasWidth * .05
        );
    }

    update() {
        super.update();

        //UI
        this.backButton.update();
    }

    mousePressed(){
        this.backButton.checkPressed(/*this.gameSession.setCurrentStateByName("Loading")*/);
    }

    mouseReleased(){
        this.backButton.checkReleased();
    }
    

    cleanup() {
        super.update();
    }
}
