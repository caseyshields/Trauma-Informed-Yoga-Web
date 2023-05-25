import GameSession from "../../game/GameSession.js";

export default class Mediapipe {
	// GameSession global which will get updates from each run
	#gameSession = new GameSession();

	// Internal variables (configs, HTML elements, etc)
	#tfjsModelBlazePose = poseDetection.SupportedModels.BlazePose;

	#tfjsConfig = {
		runtime: "mediapipe",
		solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
		modelType: "lite",
	};

	#estimationConfig = {
		model_complexity: 2,
	};

	#video = document.getElementById("input_video");
	#canvas = document.getElementsByClassName("p5Canvas")[0];

	// Data populated by estimation and bone helper layouts
	key = null;
	key3D = null;
	transformedPoints = null;
	debugStr = "";

	// MP pose and current status of camera/model
	pose = null;
	cameraRunning = false;
	estimating = false;
	paused = false;

	constructor() {
		// Start attempting to run estimator once camera is ready
		this.#video.oncanplay = () => {
			this.cameraRunning = true;
			window.requestAnimationFrame(this.#runEstimator.bind(this));
			console.log("Mediapipe instantiated.");
		};
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
				throw new Error(`Failed to access camera: ${err}`);
			}

			this.estimating = true;
			console.log("Mediapipe Setup.");
		} catch (err) {
			throw new Error(`Failed to load TFJS model: ${err}`);
		}
	}

	async #runEstimator() {
		if (!this.paused) await this.#runFrame();

		window.requestAnimationFrame(this.#runEstimator.bind(this));
	}

	async #runFrame() {
		if (this.estimating && this.cameraRunning) {
			const pose = await this.pose.estimatePoses(this.#video, this.#estimationConfig);

			const resizeRatio = {
				x: this.#canvas.width / this.#video.videoWidth,
				y: this.#canvas.height / this.#video.videoHeight,
			};

			if (pose && pose[0]) {
				this.key = pose[0].keypoints;
				this.key3D = pose[0].keypoints3D;

				this.transformedPoints = this.key.map((point, index) => {
					point.x *= resizeRatio.x;
					point.x = this.#canvas.width - point.x; // need to invert for front facing camera
					point.y *= resizeRatio.y;
					point.z = -this.key3D[index].z; // replace z prediction with the 3D z keypoint (inverted)

					return point;
				});

				this.#gameSession.poseLandmarks = this.transformedPoints;

				this.debugStr = JSON.stringify(this.transformedPoints, null, 1);
			}
		}
	}

	// Toggle pause state of estimator
	togglePause() {
		this.paused = !this.paused;
	}

	static #instance;
	static getInstance() {
		if (Mediapipe.#instance) return this.#instance;

		this.#instance = new Mediapipe();
		return this.#instance;
	}
}
