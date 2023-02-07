export default class Mediapipe {
    // Internal variables (configs, HTML elements, etc)
    #tfjsModelBlazePose = poseDetection.SupportedModels.BlazePose;

    #tfjsConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
        modelType: 'lite',
    }

    #estimationConfig = {
        enableSmoothing: true,
    }

    #video = document.getElementById('input_video');

    // Data populated by estimation and bone helper layouts
    key = null;
    key3D = null;

    bonePoints = [[8, 6], [6, 5], [5, 4], [4, 0], [0, 1], [1, 2], [2, 3], [3, 7], [10, 9],
        [18, 20], [16, 20], [16, 18], [16, 22], [16, 14], [14, 12], [12, 24], [24, 26],
        [26, 28], [28, 30], [28, 32], [32, 30], [24, 23], [23, 25], [25, 27], [27, 29],
        [27, 31], [29, 31], [23, 11], [12, 11], [11, 13], [13, 15], [15, 21], [15, 19], 
        [15, 17], [17, 19]];

    boneName = ["Left Temple", "Left Eyebrow 1", "Left Eyebrow 2", "Left Nose Bridge",
        "Right Nose Bridge", " Right Eyebrow 2", "Right Eyebrow 1", "Right Temple",
        "Mouth", "Left Fingertips", "Left Innerpalm", "Left Outerpalm", "Left Thumb",
        "Left Forearm", "Left Upperarm", "Left Abdominal", "Left Thigh", "Left Shin",
        "Left Heel", "Left Foot Top", "Left Foot Bottom", "Hips", "Right Thigh",
        "Right Shin", "Right Heel", "Right Foot Top", "Right Foot Bottom", "Right Abdominal",
        "Shoulders", "Right Upperarm", "Right Forearm", "Right Thumb", "Right Innerpalm",
        "Right Outerpalm", "Right Fingertips"];

    // MP pose and current status of camera/model
    pose = null;
    cameraRunning = false;
    estimating = false;

    // Debug UI
    pane = new Tweakpane.Pane();
    #fpsGraph = null;

    constructor() {
        this.pane.registerPlugin(TweakpaneEssentialsPlugin);
        this.pane.addMonitor(this, 'cameraRunning', {label: 'Webcam running'});
        this.pane.addMonitor(this, 'estimating', {label: 'MP estimating'});
        this.#fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            lineCount: 2,
        });

        // Start attempting to run estimator once camera is ready
        this.#video.oncanplay = () => {
            this.cameraRunning = true;
            window.requestAnimationFrame(this.#runEstimator.bind(this));
        }
    }

    // Returns bone name -> [{x, y}, {x, y}] bone vertices normalized to 0 - 2 (initially from -1 - 1)
    // Return null on error
    getBoneVertices(name) {
        const index = this.getBone(name);

        if (index && this.key3D) {
            const pointStart = this.key3D[index[0]];
            const pointEnd = this.key3D[index[1]];

            // x is inverted because the camera is facing the user
            return [
                {x: 2 - (pointStart.x + 1),     y: pointStart.y + 1},
                {x: 2 - (pointEnd.x + 1),       y: pointEnd.y + 1},
            ];
        }

        return null;
    }

    // Returns bone name -> [a, b] index pair into bonePoints[]
    // Return null on error
    getBone(name) {
        const index = this.boneName.indexOf(name);

        if (index !== -1) {
            return this.bonePoints[index];
        }
        else {
            console.error(`Failed to find bone ${name}!`);
            return null;
        }
    }

    // Sets up camera and TFJS
    async setup() {
        try {
            this.pose = await poseDetection.createDetector(this.#tfjsModelBlazePose, this.#tfjsConfig);
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false, 
                    video: { facingMode: "user" },
                });
                this.#video.srcObject = stream;
                this.#video.play();
            } catch (err) {
                console.error(`Failed to load camera: ${err}`);
            }

            this.estimating = true;
        } catch (err) {
            console.error(`Failed to create TFJS model: ${err}`);
        }

    }

    async #runEstimator() {
        this.#fpsGraph.begin();

        await this.#runFrame();

        this.#fpsGraph.end();

        window.requestAnimationFrame(this.#runEstimator.bind(this));
    }

    async #runFrame() {
        if (this.estimating && this.cameraRunning) {
            const pose = await this.pose.estimatePoses(this.#video, this.#estimationConfig);

            if (pose && pose[0]) {
                this.key = pose[0].keypoints;
                this.key3D = pose[0].keypoints3D;
            }
        }
    }

    static #instance;
    static getInstance() {
        if (Mediapipe.#instance)
            return this.#instance;
        
        this.#instance = new Mediapipe();
        return this.#instance;
    }
}