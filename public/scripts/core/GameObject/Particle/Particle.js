import GameObject from "../GameObject.js";

/** Base class for particles.
 * 
 * radius: approximate radius of circle containing particle.
 * startingX: starting X position
 * startingY: starting Y position
 * x: x position
 * y: y position
 * isRotating: true/false
 * rotationRate: direction and rate of rotation
 * duration: total duration of particle
 * velocityX: velocity direction and rate in x
 * velocityY: velocity direction and rate in y
 * accelX: Acceleration direction rate in x
 * accelY: Acceleration direction rate in y
 * shape: Circle, Square, Triangle //TODO: Add more fun shapes here
 * 
 * internal state variables:
 * completionRatio: 0-1; 0 means fresh, 1 means dead
 * completed: true means alive, false means dead
 * 
 * 
 * style: line color, fill color, line thickness
 * 
 * TODO: shape selection is janky, probably a better way to handle it
 * TODO: delete from here or from particleManager?
 * 
 */
export default class Particle extends GameObject {

    style = {
        stroke: this.p5.color(255, 255, 255),
        fill: this.p5.color(200, 200, 200),
        alpha: 1,
        strokeWeight: 1
    }

    shapes = {
        circle: "CIRCLE",
        square: "SQUARE",
        triangle: "TRIANGLE",
        ellipse: "ELLIPSE",
        rectangle: "RECTANGLE"
    }

    completionRatio = 1;
    completed = false;

    constructor(
        startingX = 0, 
        startingY = 0, 
        radius = 1, 
        isRotating = false, 
        rotationRate = 0, 
        duration = 1000,
        velocityX = 1,
        velocityY = 1,
        accelX = 0,
        accelY = -1,
        shape = "CIRCLE",
        style
        ){
        super(startingX, startingY, radius, radius, rotationRate, 1, 255); //scale, alpha

        this.__startingX = startingX;
        this.__startingY = startingY;
        
        this.__radius = radius;

        this.__x = startingX;
        this.__y = startingY;

        this.__isRotating = isRotating;
        this.__rotationRate = rotationRate;

        this.__duration = duration;
        this.__startTime = Date.now();
        this.__endTime = this.__startTime + this.__duration;

        this.__velocityX = velocityX;
        this.__velocityY = velocityY;

        this.__accelX = accelX;
        this.__accelY = accelY;

        switch(shape){
            case "CIRCLE":
                this.__shape = this.shapes.circle;
                break;
            case "SQUARE":
                this.__shape = this.shapes.square;
                break;
            default:
                console.log("invalid particle shape requested.");
                break;
        }
        //TODO: fix inconsistent pattern
        if(style){
            this.style = style;
        }
    }

    setup(){

    }

    render(){
        this.p5.push();

        //set style - alpha is a function of time elapsed vs. total duration
        this.style.stroke.setAlpha(255 - this.completionRatio * 255);
        this.style.fill.setAlpha(255 - this.completionRatio * 255); 

        this.p5.strokeWeight(this.style.strokeWeight);
        this.p5.stroke(this.style.stroke);
        this.p5.fill(this.style.fill);

        //draw the shape with radius at x, y
        switch(this.shape){
            case this.shapes.circle:
                this.p5.circle(this.x, this.y, this.radius);
                break;
            case this.shapes.square:
                this.p5.square(this.x, this.y, this.radius);
                break;
            default:
                break;
        }

        this.p5.pop();
    }

    update(){
        //TODO: See if we need to manage this at the manager level.
        if(this.completed){
            delete this;
        }

        //calculate decay ratio, 0-1. 
        this.completionRatio = (Date.now() - this.startTime)/this.duration;

        if(this.completionRatio >= 1){
            this.completed = true;
        }

        //update velocity from accelleration
        this.velocityX += this.accelX;
        this.velocityY += this.accelY;

        //update position from velocity
        this.x += this.velocityX;
        this.y += this.velocityY;

    }

    get startingX(){
        return this.__startingX;
    }

    set startingX(startingX){
        this.__startingX = startingX;
    }
    
    get startingY(){
        return this.__startingY;
    }

    set startingY(startingY){
        this.__startingY = startingY;
    }

    get radius(){
        return this.__radius;
    }

    set radius(radius){
        this.__radius = radius;
    }

    get isRotating(){
        return this.__isRotating;
    }

    set isRotating(isRotating){
        this.__isRotating = isRotating;
    }

    get rotationRate(){
        return this.__rotationRate;
    }

    set rotationRate(rotationRate){
        this.__rotationRate = rotationRate;
    }

    get duration(){
        return this.__duration;
    }

    set duration(duration){
        this.__duration = duration;
    }

    get startTime(){
        return this.__startTime;
    }

    set startTime(startTime){
        this.__startTime = startTime;
    }

    get endTime(){
        return this.__endTime;
    }

    set endTime(endTime){
        this.__endTime = endTime;
    }

    get velocityX(){
        return this.__velocityX;
    }

    set velocityX(velocityX){
        this.__velocityX = velocityX;
    }

    get velocityY(){
        return this.__velocityY;
    }

    set velocityY(velocityY){
        this.__velocityY = velocityY;
    }

    get accelX(){
        return this.__accelX;
    }

    set accelX(accelX){
        this.__accelX = accelX;
    }

    get accelY(){
        return this.__accelY;
    }

    set accelY(accelY){
        this.__accelY = accelY;
    }

    get shape(){
        return this.__shape;
    }

    set shape(shape){
        this.__shape = shape;
    }

}