import VectorGameObject from "../../core/GameObject/VectorGameObject.js";

export default class CenterOfMass extends VectorGameObject{
    //TODO: Improve COM rendering for when torso is not fully available
    
    //point we'll use for rendering
    x = 0;
    y = 0;

    //points we use to calculate COM
    leftHip = {};
    rightHip = {};
    leftShoulder = {};
    rightShoulder = {};

    style = {
		stroke: this.p5.color(255, 223, 0),
        fill: this.p5.color(255,223, 0, 127),
		strokeWeight: 2,
        ellipseWidth: 50,
        ellipseHeight: 50
	};

    constructor(leftHip, rightHip, leftShoulder, rightShoulder){
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

        this.leftHip = leftHip;
        this.rightHip = rightHip;
        this.leftShoulder = leftShoulder;
        this.rightShoulder = rightShoulder;
    }

    update(){


    }

    render(){
        let diaphragm = this.style.ellipseHeight * this.gameSession.breathingManager.breath;
        this.p5.stroke(this.style.stroke);
		this.p5.strokeWeight(this.style.strokeWeight);
		this.p5.ellipse( this.x, this.y, diaphragm + this.style.ellipseWidth, diaphragm + this.style.ellipseHeight);
    }

    updateCOMFromTorso(leftHip, rightHip, leftShoulder, rightShoulder){
        let avgX = 0;
        let avgY = 0;
        let avgCount = 0;

        if(leftHip){
            avgCount++;
            avgX += leftHip.x;
            avgY += leftHip.y;
            this.leftHip = leftHip;
        } else {
            this.leftHip = {};
        }

        if(rightHip){
            avgCount++;
            avgX += rightHip.x;
            avgY += rightHip.y;
            this.rightHip = rightHip;
        } else {
            this.rightHip =  {};
        }

        if(leftShoulder){
            avgCount++;
            avgX += leftShoulder.x;
            avgY += leftShoulder.y;
            this.leftShoulder = leftShoulder;
        } else {
            this.leftShoulder = {};
        }

        if(rightShoulder){
            avgCount++;
            avgX += rightShoulder.x;
            avgY += rightShoulder.y;
            this.leftShoulder = leftShoulder;
        } else {
            this.rightShoulder = {};
        }

        this.x = avgX/avgCount;
        this.y = avgY/avgCount;
    }

    get leftHip(){
        return this.leftHip;
    }

    set leftHip(leftHip){
        this.leftHip = leftHip;
    }

    get rightHip(){
        return this.rightHip;
    }

    set rightHip(rightHip){
        this.rightHip = rightHip;
    }
    
    get leftShoulder(){
        return this.leftShoulder;
    }

    set leftShoulder(leftShoulder){
        this.leftShoulder = leftShoulder;
    }

    get rightShoulder(){
        return this.rightShoulder;
    }

    set rightShoulder(rightShoulder){
        this.rightShoulder = rightShoulder;
    }
}