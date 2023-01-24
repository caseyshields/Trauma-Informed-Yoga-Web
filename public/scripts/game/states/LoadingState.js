import GameSession from "../../core/GameSession.js";
import State from "../../core/State.js";
/** Initial state used to initialize all libraries and tech needed to run the game.
 *  
 */

export default class LoadingState extends State {

    constructor(){
        super("Loading");

        this.__cameraLoaded = false;

        //indicates if we are currently loading tasks.
        this.__loading = true;

        //local references to assets for cleaner code.
        this.__loadingBackgroundImg = {};
    }

    setup(){
        super.setup();
        
        //Loading Render
    }

    
    render(){
        super.render();
        //Background - using image for more flexibility
        this.p5.background(51);
        


    }
    
    update(){

        //Attempt to load camera. If successful, callback transitions session to main menu.
        if(!this.cameraLoaded){
            console.log("Loading camera...");
            this.loadCamera();
        } 

        
    }

    cleanup(){
        super.cleanup();

    }

    loadCamera(){
        const mpPose = window;
        const videoElement = document.getElementsByClassName('input_video')[0];

        //Attach results to gamesession whenever available
        function onResults(results) {
            let gameSession = new GameSession();
            gameSession.poseLandmarks = (results.poseLandmarks);
            if(gameSession.currentState.loading){
                gameSession.currentState.loading = false;
                gameSession.setCurrentStateByName("Game");
            }

        }

        //Instantiate Pose
        const pose = new mpPose.Pose(
            {locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        //Options
        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        const camera = new Camera(videoElement, {
            onFrame: async () => {

                await pose.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });
        
        camera.start();

        this.cameraLoaded = true;

    }

    get loading(){
        return this.__loading;
    }

    set loading(loading){
        this.__loading = loading;
    }

    get cameraLoaded(){
        return this.__cameraLoaded;
    }

    set cameraLoaded(cameraLoaded){
        this.__cameraLoaded = cameraLoaded;
    }

}