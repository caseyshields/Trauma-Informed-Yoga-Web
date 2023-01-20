//A single bone of a user. Has a start and end point (moving away from hips) for rendering and collision detection.

import VectorGameObject from "../core/VectorGameObject.js";

export default class Bone extends VectorGameObject {

    //constructor for building bones by using raw data from pose landmarks
    constructor(rawPoseData1, rawPoseData2, name, index) {
        //call super to get access to parent classes
        super(rawPoseData1.x, rawPoseData1.y, {}, true, 5, 255, 0, 1, 1, false);
        
        //vertices must scale to gameSession size - update object
        let vertices = [
            {x: rawPoseData1.x * this.gameSession.canvasWidth, y: rawPoseData1.y * this.gameSession.canvasHeight},
            {x: rawPoseData2.x * this.gameSession.canvasWidth, y: rawPoseData2.y * this.gameSession.canvasHeight}
        ];
        
        this.vertices = vertices
        this.x = rawPoseData1.x * this.gameSession.canvasWidth;
        this.y = rawPoseData1.y * this.gameSession.canvasHeight;
        

        this.rawPoseData1 = rawPoseData1;
        this.rawPoseData2 = rawPoseData2;

        //P5 Styling variables
        this.__stroke = 255; //color
        this.__strokeWeight = 5; //width

        this.name = name;
        this.index = index;

        this.__vertices = vertices;
    }

    //updates any model attributes of the bone
    update(){
        //look for collisions
    }

    //Adds bone to the canvas
    render(){
        this.p5.stroke(255);
        this.p5.strokeWeight(10);
        this.p5.line(this.startX, this.startY, this.endX, this.endY);
    }

    get rawPoseData1(){
        return this.__rawPoseData1;
    }

    set rawPoseData1(rawPoseData1){
        this.__rawPoseData1 = rawPoseData1;
    }

    get rawPoseData2(){
        return this.__rawPoseData2;
    }

    set rawPoseData2(rawPoseData2){
        this.__rawPoseData2 = rawPoseData2;
    }

    get vertices(){
        return this.__vertices;
    }

    set vertices(vertices){
        this.__vertices = vertices;
    }

    get startX(){
        return this.__vertices[0].x;
    }

    set startX(x){
        this.__vertices[0].x = x;
    }

    get startY(){
        return this.__vertices[0].y;
    }

    set startY(y){
        this.__vertices[0].y = y;
    }

    get endX(){
        return this.__vertices[1].x;
    }

    set endX(x){
        this.__vertices[1].x = x;
    }

    get endY(){
        return this.__vertices[1].y;
    }

    set endY(y){
        this.__vertices[1].y = y;
    }





}