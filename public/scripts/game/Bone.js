import Mediapipe from "../core/Mediapipe.js";
import VectorGameObject from "../core/VectorGameObject.js";

export default class Bone extends VectorGameObject {
	vertices = [
		{x: 0.0, y: 0.0},
		{x: 0.0, y: 0.0},
	];

	style = {
		stroke: this.p5.color(123, 234, 100),
		strokeWeight: 5,
	};

	name = "unknown";
	nameFormatted = "Unknown";
	index = -1;
	points = [-1, -1];

	constructor(name, nameFormatted, index, points) {
		// constructor for vector object, no position yet
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		this.name = name;
		this.nameFormatted = nameFormatted;
		this.index = index;
		this.points = points;
	}

	update(vertices) {
		// update bone position from current prediction
		if (this.name !== "unknown" && vertices) {
			// const prediction = Mediapipe.getInstance().getBoneVertices(this.name);

			this.vertices = vertices;

			// vertices are normalized to 0 - 2, scale to canvas
			this.vertices.forEach(vertex => {
				vertex.x *= (this.gameSession.canvasWidth / 2);
				vertex.y *= (this.gameSession.canvasHeight / 2);
			});
		}
	}

	render() {
		this.p5.stroke(this.style.stroke);
		this.p5.strokeWeight(this.style.strokeWeight);
		this.p5.line(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y)
	}

	setColor(r, g, b) {
		this.style.stroke = this.p5.color(`rgba(${r},${g},${b},1)`);
	}
}