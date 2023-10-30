// import P5 from "../../lib/p5/p5.js";
import GameSession from "../../game/GameSession.js";

export default class BodyTrace {

    /** 
     * @param session {GameSession} session The context of the game
     */
    constructor() {
        this.session = new GameSession();
        // this.image = new P5.createImage(session.canvasWidth, session.canvasHeight);
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
            && pose[8] && pose[7]) {
            // array of {x, y, z, score, name}
            let d1 = Math.pow(leftHip.x - rightShoulder.x, 2) + Math.pow(leftHip.y - rightShoulder.y, 2);
            let d2 = Math.pow(rightHip.x - leftShoulder.x, 2) + Math.pow(rightHip.y - leftShoulder.y, 2);
            let w = (Math.sqrt(d1) + Math.sqrt(d2)) / 4;
            strokeWidth(w);

            // fill the torso
            let neck = this.midpoint(rightShoulder, leftShoulder);
            let pelvis = this.midpoint(point[24], point[23]);
            //fill();
            beginShape(TRIANGLES);
            vertex(pelvis.x, pelvis.y);
            vertex(rightShoulder.x, rightShoulder.y);
            vertex(leftShoulder.x, leftShoulder.y);
            vertex(neck.x, neck.y);
            vertex(rightHip.x, rightHip.y);
            vertex(leftHip.x, leftHip.y);
            endShape();
            //TODO instead draw it in the image context!

            // draw head
            // use ears to find centerpoint; other facial features are on the front of the face.
            let head = midpoint(pose[8], pose[7]);
            line(neck.x, neck.y, head.x, head.y);
            // 

            // draw arms with thick lines
            noFill();
            beginShape();
            vertex(pose[20].x, pose[20].y);
            vertex(pose[16].x, pose[16].y);
            vertex(pose[14].x, pose[14].y);
            vertex(rightShoulder.x, rightShoulder.y);
            vertex(leftShoulder.x, leftShoulder.y);
            vertex(pose[13].x, pose[13].y);
            vertex(pose[15].x, pose[15].y);
            vertex(pose[19].x, pose[19].y);
            endShape();
            
            // draw legs
            beginShape();
            vertex(pose[32].x, pose[32].y);
            vertex(pose[28].x, pose[28].y);
            vertex(pose[26].x, pose[26].y);
            vertex(rightHip.x, rightHip.y);
            vertex(leftHip.x, leftHip.y);
            vertex(pose[25].x, pose[25].y);
            vertex(pose[27].x, pose[27].y);
            vertex(pose[31].x, pose[31].y);
            endShape();

            
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