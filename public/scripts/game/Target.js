export default class Target {
	pos = {
		x: 0.0,
		y: 0.0,
	};

	radius = 1;

	color = "rgba(255, 255, 255, 1";

	constructor(x = 0.0, y = 0.0, radius = 1, color = "rgba(255, 255, 255, 1") {
		this.pos = { x: x, y: y };
		this.radius = radius;
		this.color = color;
	}

	// Return true if (x, y) is within the target radius, false otherwise.
	checkInside(x, y) {
		const r2 = Math.pow(this.radius, 2);
		const inside = Math.pow(x - this.pos.x, 2) + (y - this.pos.y, 2) < r2;

		return inside;
	}
}