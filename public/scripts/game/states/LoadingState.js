import GameSession from "../../core/GameSession.js";
import State from "../../core/State.js";
import Mediapipe from "../../core/Mediapipe.js";
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
        const MP = Mediapipe.getInstance();
        
        if (MP.cameraRunning && MP.estimating) {
            console.log('Finished loading Mediapipe.');
            this.cameraLoaded = true;

            const session = new GameSession();

            if (session.currentState.loading) {
                session.currentState.loading = false;
                session.setCurrentStateByName('Game');
            }
        }
    }

    cleanup(){
        super.cleanup();
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