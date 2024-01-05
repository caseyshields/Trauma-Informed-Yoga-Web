import GameSession from "../GameSession.js"; 

// Tried to see what it would look like not using the GameObject base class
// if this silhouette needs to interact with physics-
// or there is a GameState that has to treat everything uniformly through an interface;
// then this should be a GameObject...

/** Renders the user's pose as a silhouette with motion blur. */
export default class Silhouette {

    // TODO see if media pipe provides a segmentation mask! It is mentioned in Google's MediaPipe docs...

    // TODO should I just make the skeleton look like the silhouette and supply it this
    // 'motion blur' image context? Such an organization would have less repetition...

    static DefaultConfiguration = {
        thickness: { type: 'range', min:0, max:100, value: 0 },
        exhale_color: { type: 'color', value:[50,50,50] },//'#323232'},//
        inhale_color: { type: 'color', value:[250,250,250] }//'#fafafa'},//
    }

    /** @constructor
     * @param {Number} style.thickness Stroke thickness used when drawing the silhouette
     * @param {Number[]} style.empty RGB(A) color channels of the silhouette when breath is empty
     * @param {Number[]} style.full RGB(A) color channels of the silhouette when breath is full
     */
    constructor( config = Silhouette.DefaultConfiguration ) {
        this._session = new GameSession();
        this._config = config;
        this.g = this._session.p5.createGraphics(this._session.canvasWidth, this._session.canvasHeight);
    }

    // TODO handle screen resize!!!!!!!!!!!!!!!!!!!!!

    /** Every render, the cumulative image is dimmed then a silhouette of the user is drawn on top. */
    render() {

        // dim the cumulative image
        this.g.background(0, 0, 0, 20);

        // for now just don't draw components if we're missing landmarks
        // but eventually we should contemplate a more sophisticated sol'n
        // that includes time filtering, outlier rejection, estimation, etc...    

        // draw the avatar if we can see the torso
        let pose = this._session.pose.state; // array of {x, y, z, score, name}
        let leftHip = pose[23];
        let rightHip = pose[24];
        let leftShoulder = pose[11];
        let rightShoulder = pose[12];
        if( leftHip && rightHip && leftShoulder && rightShoulder ) {

            // use a large stroke weight to simulate the thickness of the limbs
            let w = this._config.thickness.value;
            if (w==0) {
                // Try to estimate limb width from the current size of the torso...
                let d1 = Math.pow(leftHip.x - rightShoulder.x, 2) + Math.pow(leftHip.y - rightShoulder.y, 2);
                let d2 = Math.pow(rightHip.x - leftShoulder.x, 2) + Math.pow(rightHip.y - leftShoulder.y, 2);
                w = (Math.sqrt(d1) + Math.sqrt(d2)) / 12;
            } // TODO I'm sure this can be improved; it doesn't give good results when the torso is seen from above.
            this.g.strokeWeight(w);

            // adjust color of the avatar by the current breath
            let full = this._session.p5.color(...this._config.inhale_color.value);
            let empty = this._session.p5.color(...this._config.exhale_color.value);
            let c = this.g.lerpColor(empty, full, this._session.breathingManager.breath);
            
            // default line styling
            this.g.strokeCap(this.g.ROUND);
            this.g.strokeJoin(this.g.ROUND);
            this.g.stroke(c);

            // fill the torso
            let neck = midpoint(rightShoulder, leftShoulder);
            let pelvis = midpoint(rightHip, leftHip);
            this.g.fill(c);
            this.g.triangle(neck[0], neck[1], rightHip.x, rightHip.y, leftHip.x, leftHip.y);
            this.g.triangle(pelvis[0], pelvis[1], rightShoulder.x, rightShoulder.y, leftShoulder.x, leftShoulder.y);

            // draw head if we have the data points
            if (pose[5] && pose[2] // brows
                && pose[8] && pose[7] // ears
                && pose[10] && pose[9] // mouth corners
                ) {
                // NOTE I saw this sanity check in the CenterOfMass object, but I don't know that I've ever seen it occur. Is this necessary?
                
                // use ears to find centerpoint of head; other features are on the front of the face.
                let head = midpoint(pose[8], pose[7]);
                this.g.circle(head[0], head[1], 0.8*w); // cranium
                this.g.line(neck[0], neck[1], head[0], head[1]); // neck
                
                let chin = midpoint(pose[10], pose[9]);
                this.g.beginShape(); // face
                this.g.vertex(pose[5].x, pose[5].y);
                this.g.vertex(chin[0], chin[1]);
                this.g.vertex(pose[2].x, pose[2].y);
                this.g.endShape();
            }

            // draw arms and shoulders
            if (pose[20] && pose[16] && pose[14] && pose[12] // left arm
                && pose[19] && pose[15] && pose[13] && pose[11] // right arm
                ) {// There is a common case when the user is side-on to the camera that the far limb has near zero confidence.
                // TODO because of this, should we instead guard against low-confidence rather than nulls?
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
            }
            
            // draw legs and hips
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
            // huh, I haven't run into any problems without the null-ish guard...

            // draw the cumulative image to the screen
            this._session.p5.image(this.g, this._session.canvasWidth/2, this._session.canvasHeight/2);
        }
    }

    get configuration() {return this._config;}
    
}

function midpoint(p1, p2) {
    return [(p1.x+p2.x)/2, (p1.y+p2.y)/2];
}