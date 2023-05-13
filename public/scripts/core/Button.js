import VectorGameObject from "./VectorGameObject.js";

export default class Button extends VectorGameObject {
	layout = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
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

	states = {
		idle: "fill",
		hover: "hoverFill",
		pressed: "pressedFill",
		loading: "loadingFill",
		disabled: "disabledFill",
	};

	state = this.states.idle;

	// Pass in objects matching the format for layout and style above to override defaults
	constructor(layout = {}, style = {}, disabled = false) {
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		Object.assign(this.layout, layout);
		Object.assign(this.style, style);

		this.state = disabled ? this.states.disabled : this.states.idle;
	}

	render() {
		// skip rendering if our fill was set to null
		if (this.style[this.state] !== null) {
			this.p5.push();

			this.p5.stroke(this.style.stroke);
			this.p5.strokeWeight(this.style.strokeWeight);

			this.p5.fill(this.style[this.state]);
			this.p5.rect(this.layout.x, this.layout.y, this.layout.width, this.layout.height);

			this.p5.pop();
		}
	}

	resize(x, y, width, height) {
		this.layout.x = x;
		this.layout.y = y;
		this.layout.width = width;
		this.layout.height = height;
	}

	// passed in function is called on each update
	update(func = () => {}) {
		const mx = this.p5.mouseX;
		const my = this.p5.mouseY;

		if (this.state === this.states.idle || this.state === this.states.hover) {
			if (this.#pointWithinRectangle(mx, my, this.layout.x, this.layout.y, this.layout.width, this.layout.height))
				this.state = this.states.hover;
			else this.state = this.states.idle;
		}

		// call the passed in function
		func();
	}

	// passed in function is called when button is pressed
	checkPressed(func = () => {}) {
		const mx = this.p5.mouseX;
		const my = this.p5.mouseY;

		if (this.#pointWithinRectangle(mx, my, this.layout.x, this.layout.y, this.layout.width, this.layout.height)) {
			// change state to pressed only if on idle or hover
			if (this.state === this.states.idle || this.state === this.states.hover) {
				this.state = this.states.pressed;

				// call the passed in function
				func();
			}
		}
	}

	// passed in function is called when button is released
	checkReleased(func = () => {}, loading = false) {
		if (this.state === this.states.pressed) {
			// change state to loading if we need to do some action before returning to idle
			this.state = loading ? this.states.loading : this.states.idle;

			// call the passed in function
			this.onButtonReleased();
			func();
		}
	}

	#pointWithinRectangle(pointX, pointY, rectX, rectY, width, height) {
		let pointInside = pointX > rectX && pointX < rectX + width;
		if (pointInside) {
			pointInside = pointY > rectY && pointY < rectY + height;
		}
		return pointInside;
	}

	//abstract method - useful for overriding in child class.
	onButtonReleased(){

	}
}
