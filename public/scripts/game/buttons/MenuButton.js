import Button from "../../core/Button.js";

export default class MenuButton extends Button {
	layout = {
		x: this.gameSession.canvasWidth * 0.9,
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

	state = this.states.idle;

	destinationState = "Menu";

	constructor(layout = {}, style = {}, disabled = false, destinationState) {
		super(layout, style, {}, disabled);
		this.destinationState = destinationState;
	}

	//TODO: render a square with three sliders inside
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

			this.p5.line(this.iconLayout.line0x0, this.iconLayout.line0y0, this.iconLayout.line0x1, this.iconLayout.line0y1);
			this.p5.circle(this.iconLayout.circle0x, this.iconLayout.circle0y, this.iconLayout.circle0radius);
			this.p5.line(this.iconLayout.line1x0, this.iconLayout.line1y0, this.iconLayout.line1x1, this.iconLayout.line1y1);
			this.p5.circle(this.iconLayout.circle1x, this.iconLayout.circle1y, this.iconLayout.circle1radius);
			this.p5.line(this.iconLayout.line2x0, this.iconLayout.line2y0, this.iconLayout.line2x1, this.iconLayout.line2y1);
			this.p5.circle(this.iconLayout.circle2x, this.iconLayout.circle2y, this.iconLayout.circle2radius);

			this.p5.pop();
		}
	}

	setup() {
		this.iconResize();
	}

	resize() {
		super.updateSize();
		this.iconResize();
	}

	//Icon rendering should always be relative to component layout
	iconLayout = {
		line0x0: 0,
		line0y0: 0,
		line0x1: 0,
		line0y1: 0,
		circle0x: 0,
		circle0y: 0,
		circle0radius: 0,
		line1x0: 0,
		line1y0: 0,
		line1x1: 0,
		line1y1: 0,
		circle1x: 0,
		circle1y: 0,
		circle1radius: 0,
		line2x0: 0,
		line2y0: 0,
		line2x1: 0,
		line2y1: 0,
		circle2x: 0,
		circle2y: 0,
		circle2radius: 0,
	};

	iconStyle = {};

	iconResize() {
		//updates slider coordinates
		(this.iconLayout.line0x0 = this.layout.x + this.layout.width * 0.25),
			(this.iconLayout.line0y0 = this.layout.y + this.layout.height * 0.25),
			(this.iconLayout.line0x1 = this.layout.x + this.layout.width * 0.75),
			(this.iconLayout.line0y1 = this.layout.y + this.layout.height * 0.25),
			(this.iconLayout.circle0x = this.layout.x + this.layout.width * 0.25),
			(this.iconLayout.circle0y = this.layout.y + this.layout.height * 0.25),
			(this.iconLayout.circle0radius = this.layout.width * 0.1),
			(this.iconLayout.line1x0 = this.layout.x + this.layout.width * 0.25),
			(this.iconLayout.line1y0 = this.layout.y + this.layout.height * 0.5),
			(this.iconLayout.line1x1 = this.layout.x + this.layout.width * 0.75),
			(this.iconLayout.line1y1 = this.layout.y + this.layout.height * 0.5),
			(this.iconLayout.circle1x = this.layout.x + this.layout.width * 0.5),
			(this.iconLayout.circle1y = this.layout.y + this.layout.height * 0.5),
			(this.iconLayout.circle1radius = this.layout.width * 0.1),
			(this.iconLayout.line2x0 = this.layout.x + this.layout.width * 0.25),
			(this.iconLayout.line2y0 = this.layout.y + this.layout.height * 0.75),
			(this.iconLayout.line2x1 = this.layout.x + this.layout.width * 0.75),
			(this.iconLayout.line2y1 = this.layout.y + this.layout.height * 0.75),
			(this.iconLayout.circle2x = this.layout.x + this.layout.width * 0.75),
			(this.iconLayout.circle2y = this.layout.y + this.layout.height * 0.75),
			(this.iconLayout.circle2radius = this.layout.width * 0.1);
	}

	onButtonReleased() {
		this.gameSession.setCurrentStateByName(this.destinationState);
	}
}
