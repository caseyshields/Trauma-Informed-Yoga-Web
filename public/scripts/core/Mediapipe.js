export default class Mediapipe {
	// Internal variables (configs, HTML elements, etc)
	#tfjsModelBlazePose = poseDetection.SupportedModels.BlazePose;

	#tfjsConfig = {
		runtime: "mediapipe",
		solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
		modelType: "lite",
	};

	#estimationConfig = {
		enableSmoothing: true,
	};

	#video = document.getElementById("input_video");

	// Data populated by estimation and bone helper layouts
	key = null;
	key3D = null;

	// MP pose and current status of camera/model
	pose = null;
	cameraRunning = false;
	estimating = false;

	// Debug UI
	pane = new Tweakpane.Pane();
	#fpsGraph = null;

	constructor() {
		this.pane.registerPlugin(TweakpaneEssentialsPlugin);
		this.pane.addButton({ title: "Start webcam" }).on("click", () => this.setup());
		this.pane.addMonitor(this, "cameraRunning", { label: "Webcam running" });
		this.pane.addMonitor(this, "estimating", { label: "MP estimating" });
		this.#fpsGraph = this.pane.addBlade({
			view: "fpsgraph",
			label: "FPS",
			lineCount: 2,
		});

		// Start attempting to run estimator once camera is ready
		this.#video.oncanplay = () => {
			this.cameraRunning = true;
			window.requestAnimationFrame(this.#runEstimator.bind(this));
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
		if (Mediapipe.#instance) return this.#instance;

		this.#instance = new Mediapipe();
		return this.#instance;
	}
}
