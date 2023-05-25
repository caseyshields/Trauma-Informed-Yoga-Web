import Button from "../../core/UI/Button.js";

export default class BackButton extends Button {
	//default layout and style
	layout = {
		x: this.gameSession.canvasWidth * 0.05,
		y: this.gameSession.canvasHeight * 0.05,
		width: this.gameSession.canvasWidth * 0.05,
		height: this.gameSession.canvasWidth * 0.05,
	};

	style = {
		stroke: this.p5.color(255, 255, 255),
		strokeWeight: 5,
		fill: this.p5.color(0, 0, 0),
		hoverFill: this.p5.color(123, 123, 123),
		pressedFill: this.p5.color(255, 255, 255),
		loadingFill: this.p5.color(62, 62, 62),
		disabledFill: this.p5.color(125, 0, 0),
	};
	//button starts idle, enabled
	state = this.states.idle;

	//state that button leads to
	destinationState = "Loading";

	constructor(layout = {}, style = {}, disabled = false, destinationState) {
		super(layout, style, {}, disabled);
		this.destinationState = destinationState;
	}

	setup() {
		this.iconResize();
	}

	onButtonReleased() {
		this.gameSession.setCurrentStateByName(this.destinationState);
	}

	resize() {
		super.updateSize();
		this.iconResize();
	}

	//TODO: render a square with a white border and left-pointing arrow inside
	render() {
		//triangle requires three points
		//points are at: (.75, .25), (.75, .75), (.25, .50)
		// skip rendering if our fill was set to null
		if (this.style[this.state] !== null) {
			this.p5.push();

			this.p5.stroke(this.style.stroke);
			this.p5.strokeWeight(this.style.strokeWeight);

			this.p5.fill(this.style[this.state]);

			this.p5.rect(this.layout.x, this.layout.y, this.layout.width, this.layout.height);
			this.p5.triangle(
				this.iconLayout.x1,
				this.iconLayout.y1,
				this.iconLayout.x2,
				this.iconLayout.y2,
				this.iconLayout.x3,
				this.iconLayout.y3
			);

			this.p5.pop();
		}
	}

	//TODO: Default values (?)
	iconLayout = {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0,
		x3: 0,
		y3: 0,
	};

	iconStyle = {
		stroke: this.p5.color(230, 251, 255),
		strokeWeight: 5,
		fill: this.p5.color(51, 51, 51),
		hoverFill: this.p5.color(76, 76, 76),
		pressedFill: this.p5.color(102, 102, 102),
		disabledFill: null,
	};

	iconResize() {
		//update the triangle coordinates
		this.iconLayout.x1 = this.layout.x + this.layout.width * 0.75;
		this.iconLayout.y1 = this.layout.y + this.layout.width * 0.25;
		this.iconLayout.x2 = this.layout.x + this.layout.width * 0.75;
		this.iconLayout.y2 = this.layout.y + this.layout.width * 0.75;
		this.iconLayout.x3 = this.layout.x + this.layout.width * 0.25;
		this.iconLayout.y3 = this.layout.y + this.layout.width * 0.5;
	}
}
