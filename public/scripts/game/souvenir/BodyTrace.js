// import P5 from "../../lib/p5/p5.js";
import GameSession from "../../game/GameSession.js";

export default class BodyTrace {

    /** 
     * @param session {GameSession} session The context of the game
     */
    constructor() {
        this.session = new GameSession();
        this.p5 = this.session.p5
        this.color = this.p5.color(0, 255, 255, 64); // TODO make configurable;

        this.w = this.session.canvasWidth;
        this.h = this.session.canvasHeight;
        this.g = this.p5.createGraphics(this.w,this.h);

        // this.image = this.p5.createImage(session.canvasWidth, session.canvasHeight);
        // this.skeleton = session.skeleton;
    }

    update() {
        // TODO should we do position filtering here for the skeleton
        // it should probably be done globally in the session;
    }

    render() {
        // I want to build up a silhouette.
        // need to add volume to limbs;
        // as a consequence of the point landmarks; 
        // when user turns to side, width disappears.
        // if user is viewed from above, depth disappears.

        // possible hack;
        // choose the longer torso diagonal as a yardstick- or the diagonal average; 
        // some fraction of it determined limb and head thickness...
        let pose = this.session.poseLandmarks;
        let leftHip = pose[23];
        let rightHip = pose[24];
        let leftShoulder = pose[11];
        let rightShoulder = pose[12];
        if( leftHip && rightHip && leftShoulder && rightShoulder 
            && pose[8] && pose[7] && pose[10] && pose[9]) {
            // array of {x, y, z, score, name}
            let d1 = Math.pow(leftHip.x - rightShoulder.x, 2) + Math.pow(leftHip.y - rightShoulder.y, 2);
            let d2 = Math.pow(rightHip.x - leftShoulder.x, 2) + Math.pow(rightHip.y - leftShoulder.y, 2);
            let w = (Math.sqrt(d1) + Math.sqrt(d2)) / 10;

            this.g.background(0, 0, 0, 5);
            this.g.strokeWeight(w);
            this.g.strokeCap(this.g.ROUND);
            this.g.strokeJoin(this.g.ROUND);
            this.g.stroke(this.color);

            // fill the torso
            let neck = this.midpoint(rightShoulder, leftShoulder);
            let pelvis = this.midpoint(rightHip, leftHip);
            this.g.fill(this.color);

            this.g.triangle(neck[0], neck[1], rightHip.x, rightHip.y, leftHip.x, leftHip.y);
            this.g.triangle(pelvis[0], pelvis[1], rightShoulder.x, rightShoulder.y, leftShoulder.x, leftShoulder.y);
            // this.g.beginShape(p5.TRIANGLES);
            // this.g.vertex(pelvis[0], pelvis[1]);
            // this.g.vertex(rightShoulder.x, rightShoulder.y);
            // this.g.vertex(leftShoulder.x, leftShoulder.y);
            // this.g.vertex(neck[0], neck[1]);
            // this.g.vertex(rightHip.x, rightHip.y);
            // this.g.vertex(leftHip.x, leftHip.y);
            // this.g.endShape();//this.g.CLOSE);
            //TODO instead draw it in the image context!

            // draw head
            // use ears to find centerpoint; other facial features are on the front of the face.
            let head = this.midpoint(pose[8], pose[7]);
            this.g.line(neck[0], neck[1], head[0], head[1]);

            let chin = this.midpoint(pose[10], pose[9]);
            this.g.beginShape();//this.g.LINES);
            // this.g.vertex(neck[0], neck[1]);
            // this.g.vertex(head[0], head[1]);
            this.g.vertex(pose[5].x, pose[5].y);
            // this.g.vertex(pose[10].x, pose[10].y);
            this.g.vertex(chin[0], chin[1]);
            // this.g.vertex(pose[9].x, pose[9].y);
            this.g.vertex(pose[2].x, pose[2].y);
            this.g.endShape();

            // let dx = pose[8].x-pose[7].x;
            // let dy = pose[8].y-pose[7].y;
            // let d = Math.sqrt(dx*dx + dy*dy);
            this.g.circle(head[0], head[1], 0.7*w);

            // draw arms with thick lines
            this.g.noFill();
            this.g.beginShape();
            this.g.vertex(pose[20].x, pose[20].y);
            this.g.vertex(pose[16].x, pose[16].y);
            this.g.vertex(pose[14].x, pose[14].y);
            this.g.vertex(rightShoulder.x, rightShoulder.y);
            this.g.vertex(leftShoulder.x, leftShoulder.y);
            this.g.vertex(pose[13].x, pose[13].y);
            this.g.vertex(pose[15].x, pose[15].y);
            this.g.vertex(pose[19].x, pose[19].y);
            this.g.endShape();
            
            // draw legs
            this.g.beginShape();
            this.g.vertex(pose[32].x, pose[32].y);
            this.g.vertex(pose[28].x, pose[28].y);
            this.g.vertex(pose[26].x, pose[26].y);
            this.g.vertex(rightHip.x, rightHip.y);
            this.g.vertex(leftHip.x, leftHip.y);
            this.g.vertex(pose[25].x, pose[25].y);
            this.g.vertex(pose[27].x, pose[27].y);
            this.g.vertex(pose[31].x, pose[31].y);
            this.g.endShape();

            // draw it to the screen
            this.p5.image(this.g, this.w/2, this.h/2);
            
            // after filtering down the pertinent info should we store a time series for playback or later rendering?
            // storeItem(time+id, state);
        } else {
            // for now just don't draw if we're missing landmarks
            // but eventually we should contemplate a more sophisticated soln
            // that includes time filtering, outlier rejection, estimation, etc...
            console.log(pose);
        }
    }

    midpoint(p1, p2) {
        return [(p1.x+p2.x)/2, (p1.y+p2.y)/2];
    }
}