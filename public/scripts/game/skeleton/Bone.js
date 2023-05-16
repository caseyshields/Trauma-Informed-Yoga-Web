import Mediapipe from "../../core/Mediapipe.js";
import VectorGameObject from "../../core/VectorGameObject.js";

export default class Bone extends VectorGameObject {
	vertices = [
		{ x: 0.0, y: 0.0, z: 0.0 },
		{ x: 0.0, y: 0.0, z: 0.0 },
	];

	style = {
		stroke: this.p5.color(123, 234, 100),
		strokeWeight: 5,
	};

	name = "unknown";
	nameFormatted = "unknown";
	index = -1;
	points = [-1, -1];

	constructor(name, nameFormatted, index, points, stroke, strokeWeight) {
		// constructor for vector object, no position yet
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		this.name = name;
		this.nameFormatted = nameFormatted;
		this.index = index;
		this.points = points;
		this.style.stroke = this.p5.color(stroke);
		this.style.strokeWeight = strokeWeight;
	}

	update(vertices) {
		// update bone position from current prediction
		if (this.name !== "unknown" && vertices) {
			this.vertices = vertices;
			// this.setColor((this.vertices[0].z + 1 - 0.9) / (1.1 - 0.9));
		}
	}

	render() {
		this.p5.stroke(this.style.stroke);
		this.p5.strokeWeight(this.style.strokeWeight);
		this.p5.line(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y);
	}

	// NOTE: alpha is the first arg to allow setting alpha with setColor(x) without specifying other params
	setColor(
		a = this.style.stroke.levels[3],
		r = this.style.stroke.levels[0],
		g = this.style.stroke.levels[1],
		b = this.style.stroke.levels[2]
	) {
		this.style.stroke = this.p5.color(`rgba(${r},${g},${b},${a})`);
	}
}
