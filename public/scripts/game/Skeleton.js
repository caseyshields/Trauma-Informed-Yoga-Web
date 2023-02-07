//Collects all bones of user into single addressable unit

import GameObject from "../core/GameObject.js";
import GameSession from "../core/GameSession.js";
import Bone from "./Bone.js";
import Mediapipe from "../core/Mediapipe.js";

export default class Skeleton extends GameObject {

    bones = [];

    // Bone names and connections.
    // Also defined in core/Mediapipe.js! Must be kept consistent
    // TODO: move away bone functions from Mediapipe.js

    bonePoints = [[8, 6], [6, 5], [5, 4], [4, 0], [0, 1], [1, 2], [2, 3], [3, 7], [10, 9],
        [18, 20], [16, 20], [16, 18], [16, 22], [16, 14], [14, 12], [12, 24], [24, 26],
        [26, 28], [28, 30], [28, 32], [32, 30], [24, 23], [23, 25], [25, 27], [27, 29],
        [27, 31], [29, 31], [23, 11], [12, 11], [11, 13], [13, 15], [15, 21], [15, 19], 
        [15, 17], [17, 19]];


    // TODO: convert to object for autocompletion once bone functions are moved away from MP file
    // Use helper functions in Mediapipe.js until then
    boneName = ["Left Temple", "Left Eyebrow 1", "Left Eyebrow 2", "Left Nose Bridge",
        "Right Nose Bridge", " Right Eyebrow 2", "Right Eyebrow 1", "Right Temple",
        "Mouth", "Left Fingertips", "Left Innerpalm", "Left Outerpalm", "Left Thumb",
        "Left Forearm", "Left Upperarm", "Left Abdominal", "Left Thigh", "Left Shin",
        "Left Heel", "Left Foot Top", "Left Foot Bottom", "Hips", "Right Thigh",
        "Right Shin", "Right Heel", "Right Foot Top", "Right Foot Bottom", "Right Abdominal",
        "Shoulders", "Right Upperarm", "Right Forearm", "Right Thumb", "Right Innerpalm",
        "Right Outerpalm", "Right Fingertips"];

    constructor() {
        super(0, 0, 0, 0, 0, 0);

        const MP = Mediapipe.getInstance();

        // populate bones
        MP.boneName.forEach(name => {
            this.bones.push(new Bone(name));
        })

        // NOTE: colors unused currently
        // this.__noseC = this.p5.color(153, 0, 153);
        // this.__rightShoulderC = this.p5.color(0, 55, 0);
        // this.__rightElbowC = this.p5.color(55, 0, 0);
        // this.__rightWristC = this.p5.color(153, 153, 153);
        // this.__rightHipC = this.p5.color(0, 0, 153);
        // this.__rightKneeC = this.p5.color(0, 55, 55);
        // this.__rightAnkleC = this.p5.color(153, 153, 0);
        // this.__rightIndexC = this.p5.color(0, 0, 0);
        // this.__rightHeelC = this.p5.color(0, 0, 0);
        // this.__rightFootIndexC = this.p5.color(0, 0, 0);
        // this.__leftShoulderC = this.p5.color(0, 55, 0);
        // this.__leftElbowC = this.p5.color(55, 0, 0);
        // this.__leftWristC = this.p5.color(153, 153, 153);
        // this.__leftHipC = this.p5.color(0, 0, 153);
        // this.__leftKneeC = this.p5.color(0, 55, 55);
        // this.__leftAnkleC = this.p5.color(153, 153, 0);
        // this.__leftIndexC = this.p5.color(0, 0, 0);
        // this.__leftHeelC = this.p5.color(0, 0, 0);
        // this.__leftFootIndexC = this.p5.color(0, 0, 0);
    }

    //updates any model attributes of the bone
    update(){
        if(this.gameSession.instance){
            for (const bone of this.bones)
                bone.update();
        }
    }

    //Adds bone to the canvas
    render(){
        this.p5.stroke(255);

        for (const bone of this.bones)
            bone.render();
    }

    //This is a big nasty method because we are hardcoding 
    //based on fig 4. https://google.github.io/mediapipe/solutions/pose#javascript-solution-api
    /** points are based on their position in the poseLandmarks array with the following objects:
     * 0. nose 
     * 1. left_eye_inner 
     * 2. left_eye
     * 3. left_eye_outer
     * 4. right_eye_inner
     * 5. right_eye
     * 6. right_eye_outer
     * 7. left_ear
     * 8. right_ear
     * 9. mouth_left
     * 10. mouth_right
     * 11. left_shoulder
     * 12. right_shoulder
     * 13. left_elbow
     * 14. right_elbow
     * 15. left_wrist
     * 16. right_wrist
     * 17. left_pinky
     * 18. right_pinky
     * 19. left_index
     * 20. right_index
     * 21. left_thumb
     * 22. right_thumb
     * 23. left_hip
     * 24. right_hip
     * 25. left_knee
     * 26. right_knee
     * 27. left_ankle
     * 28. right_ankle
     * 29. left_heel
     * 30. right_heel
     * 31. left_foot_index
     * 32. right_foot_index
     * 
     * These form the following "bones":
        0	left_temple	8	6
        1	left_eyebrow_1	6	5
        2	left_eyebrow_2	5	4
        3	left_nose_bridge	4	0
        4	right_nose_bridge	0	1
        5	right_eyebrow_2	1	2
        6	right_eyebrow_1	2	3
        7	right_temple	3	7
        8	mouth	10	9
        9	left_fingertips	18	20
        10	left_innerpalm	16	20
        11	left_outerpalm	16	18
        12	left_thumb	16	22
        13	left_forearm	16	14
        14	left_upperarm	14	12
        15	left_abdominal	12	24
        16	left_thigh	24	26
        17	left_shin	26	28
        18	left_heel	28	30
        19	left_foot_top	28	32
        20	left_foot_bottom	32	30
        21	hips	24	23
        22	right_thigh	23	25
        23	right_shin	25	27
        24	right_heel	27	29
        25	right_foot_top	27	31
        26	right_foot_bottom	29	31
        27	right_abdominal	23	11
        28	shoulders	12	11
        29	right_upperarm	11	13
        30	right_forearm	13	15
        31	right_thumb	15	21
        32	right_innerpalm	15	19
        33	right_outerpalm	15	17
        34	right_fingertips	17	19
     * 
     * @param {*} poseLandmarks 
     */
}