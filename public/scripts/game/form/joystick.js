import GameObject from "../../core/GameObject/GameObject.js";

/** trying to make a input target that produces a vector */
export default class Joystick extends GameObject {

    _pose; // filtered pose from the game session
    _origin; // coordinates of center of joystick relative to COM of pose
    _radius; // radius of the joystick on screen
    _landmark; // the bodypart that interacts with the joystick

    _value; // current value of the joystick
    _magnitude; // absolute magnitude of value
    _x; // current screen position of center of joystick
    _y;

    constructor(
        origin = [0,-300], 
        radius = 150,
        landmark = 'left_wrist')
    {
        super(origin[0], origin[1], radius, radius, 0.0, 1.0, 1.0);
        this._origin = origin;
        this._radius = radius;
        this._landmark = landmark;
        this._pose = this.__gameSession.__pose;
        this._stroke = this.__p5.color(256,256,256,256);
        this._fill = this.__p5.color(256,256,256,64);
    }

    /** determine the current value of the joystick from the difference between the origin and the assigned bodypart. */
    update() {
        // calculate the current geometry of the joystick
        let com = this._pose.getCom();
		this._x = this._origin[0] + com.x;
        this._y = this._origin[1] + com.y;
        let landmark = this._pose.getLandmark(this._landmark);
        let v = [landmark.x-this._x, landmark.y-this._y];
        let d = Math.sqrt( (v[0]*v[0]) + (v[1]*v[1]) );

        // scale value to radius if it is out of bounds
        if (d > this._radius) {
            v = [this._radius*v[0]/d, this._radius*v[1]/d];
            d = this._radius;
        }

        this._value = v;
        this._magnitude = d;
    }

    /** Draw the location of the center of the joystick, it's boundaries.
     * Then draw a vector on the screen proportional to the joystick's current output.
     */
    render() {
        this.__p5.stroke(this._stroke);
        this.__p5.fill(this._fill);
        this.__p5.circle(this._x, this._y, this._radius*2);
        this.__p5.line(this._x, this._y,
            this._x+this._value[0], this._y+this._value[1]);
    }

    get value() { return this._value; }
    get magnitude() { return this._magnitude; }
    get radius() { return this._radius; }
}