import State from "../../core/State/State.js";
import BackButton from "../buttons/BackButton.js";
import Button from "../../core/UI/Button.js";

export default class AboutState extends State {
    backButton = {};
    tsyButton = {};
    yogaButton = {};
    howGameButton = {};
    creditsButton = {};


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

        this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "Loading");
        this.backButton.setup();

        let tsyButtonLayout = {
            xRatio: 0.525,
            yRatio: 0.75,
            widthRatio: 0.4,
            heightRatio: 0.2,
        };
    
        let tsyButtonStyle = {
            stroke: this.p5.color(230, 251, 255),
            strokeWeight: 5,
            fill: this.p5.color(51, 51, 51),
            hoverFill: this.p5.color(76, 76, 76),
            pressedFill: this.p5.color(102, 102, 102),
        };
    
        let tsyButtonText = {
            text: "TSY Resources",
            textRatio: 10,
        };
    
        this.tsyButton = new Button(tsyButtonLayout, tsyButtonStyle, tsyButtonText);

        let yogaButtonLayout = {
            xRatio: 0.075,
            yRatio: 0.75,
            widthRatio: 0.4,
            heightRatio: 0.2,
        };
    
        let yogaButtonStyle = {
            stroke: this.p5.color(230, 251, 255),
            strokeWeight: 5,
            fill: this.p5.color(51, 51, 51),
            hoverFill: this.p5.color(76, 76, 76),
            pressedFill: this.p5.color(102, 102, 102),
        };
    
        let yogaButtonText = {
            text: "Yoga: Culture and History",
            textRatio: 10,
        };
    
        this.yogaButton = new Button(yogaButtonLayout, yogaButtonStyle, yogaButtonText);

        let howGameButtonLayout = {
            xRatio: 0.075,
            yRatio: 0.5,
            widthRatio: 0.4,
            heightRatio: 0.2,
        };
    
        let howGameButtonStyle  = {
            stroke: this.p5.color(230, 251, 255),
            strokeWeight: 5,
            fill: this.p5.color(51, 51, 51),
            hoverFill: this.p5.color(76, 76, 76),
            pressedFill: this.p5.color(102, 102, 102),
        };
    
        let howGameButtonText = {
            text: "How This Game Works",
            textRatio: 10,
        };
    
        this.howGameButton = new Button(howGameButtonLayout, howGameButtonStyle, howGameButtonText);

        let creditsButtonLayout = {
            xRatio: 0.525,
            yRatio: 0.5,
            widthRatio: 0.4,
            heightRatio: 0.2,
        };
    
        let creditsButtonStyle  = {
            stroke: this.p5.color(230, 251, 255),
            strokeWeight: 5,
            fill: this.p5.color(51, 51, 51),
            hoverFill: this.p5.color(76, 76, 76),
            pressedFill: this.p5.color(102, 102, 102),
        };
    
        let creditsButtonText = {
            text: "Academic Credits",
            textRatio: 10,
        };
    
        this.creditsButton = new Button(creditsButtonLayout, creditsButtonStyle, creditsButtonText);
    }

    render() {
        super.render();

        //UI
        this.backButton.render();
        this.tsyButton.render();
        this.yogaButton.render();
        this.howGameButton.render();
        this.creditsButton.render();
    }

    resize() {
        super.resize();

        this.backButton.resize(
            this.gameSession.canvasWidth * .05,
            this.gameSession.canvasHeight * .05,
            this.gameSession.canvasWidth * .05,
            this.gameSession.canvasWidth * .05
        );
        this.tsyButton.updateSize();
        this.yogaButton.updateSize();
        this.howGameButton.updateSize();
        this.creditsButton.updateSize();
    }

    update() {
        super.update();

        //UI
        this.backButton.update();
        this.tsyButton.update();
        this.yogaButton.update();
        this.howGameButton.update();
        this.creditsButton.update();
    }

    mousePressed(){
        this.backButton.checkPressed();
        this.tsyButton.checkPressed();
        this.yogaButton.checkPressed();
        this.howGameButton.checkPressed();
        this.creditsButton.checkPressed();
    }

    mouseReleased(){
        this.backButton.checkReleased();

        this.howGameButton.checkReleased(() => {
            this.gameSession.setCurrentStateByName("Info");
            this.gameSession.currentState.text = "How This Game Works\n" +
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec enim sapien.\n Aliquam tincidunt enim vel magna ullamcorper, at faucibus lorem ullamcorper.\n Vestibulum semper nisl vitae est congue, eget posuere erat malesuada.\n Nam volutpat mollis nunc, in ultrices orci lacinia nec. Fusce dictum nunc in nulla\n blandit, ac euismod lectus blandit. Sed consequat lacus ut nulla interdum, sed\n sodales purus pellentesque. Fusce maximus justo eu est ultrices laoreet.\n Curabitur a lobortis sem. Maccenas viverra porttitor leo. Class aptent taciti sociosqu \nad litora torquent per conubia nostra, per inceptos himenaeos.";

            // TODO: run into an error: 
            //       Uncaught ReferenceError: require is not defined
            /*
            // Read the display content from a file.
            require('fs').readFile('HowThisGameWorks.txt', function(err, content) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("\n[\n" + content.toString() + "\n]\n");
                }
            });
            */
        });

        this.tsyButton.checkReleased(() => {
            this.gameSession.setCurrentStateByName("Info");
            this.gameSession.currentState.text = "Additional TSY Resources\n" + 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec enim sapien.\n Aliquam tincidunt enim vel magna ullamcorper, at faucibus lorem ullamcorper.\n Vestibulum semper nisl vitae est congue, eget posuere erat malesuada.\n Nam volutpat mollis nunc, in ultrices orci lacinia nec. Fusce dictum nunc in nulla\n blandit, ac euismod lectus blandit. Sed consequat lacus ut nulla interdum, sed\n sodales purus pellentesque. Fusce maximus justo eu est ultrices laoreet.\n Curabitur a lobortis sem. Maccenas viverra porttitor leo. Class aptent taciti sociosqu \nad litora torquent per conubia nostra, per inceptos himenaeos.";
        });

        this.yogaButton.checkReleased(() => {
            this.gameSession.setCurrentStateByName("Info");
            this.gameSession.currentState.text = "Yoga Culture & History\n" + 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec enim sapien.\n Aliquam tincidunt enim vel magna ullamcorper, at faucibus lorem ullamcorper.\n Vestibulum semper nisl vitae est congue, eget posuere erat malesuada.\n Nam volutpat mollis nunc, in ultrices orci lacinia nec. Fusce dictum nunc in nulla\n blandit, ac euismod lectus blandit. Sed consequat lacus ut nulla interdum, sed\n sodales purus pellentesque. Fusce maximus justo eu est ultrices laoreet.\n Curabitur a lobortis sem. Maccenas viverra porttitor leo. Class aptent taciti sociosqu \nad litora torquent per conubia nostra, per inceptos himenaeos.";
        });

        this.creditsButton.checkReleased(() => {
            this.gameSession.setCurrentStateByName("Info");
            this.gameSession.currentState.text = "Academic Development Credits\n" +
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec enim sapien.\n Aliquam tincidunt enim vel magna ullamcorper, at faucibus lorem ullamcorper.\n Vestibulum semper nisl vitae est congue, eget posuere erat malesuada.\n Nam volutpat mollis nunc, in ultrices orci lacinia nec. Fusce dictum nunc in nulla\n blandit, ac euismod lectus blandit. Sed consequat lacus ut nulla interdum, sed\n sodales purus pellentesque. Fusce maximus justo eu est ultrices laoreet.\n Curabitur a lobortis sem. Maccenas viverra porttitor leo. Class aptent taciti sociosqu \nad litora torquent per conubia nostra, per inceptos himenaeos.";
        });
    }
    
    cleanup() {
        super.update();
    }
}
