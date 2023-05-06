import State from "../../core/State.js";
import Skeleton from "../Skeleton.js";

export default class CalibrationState extends State {

    constructor(){
        super("Calibration");
    }

    //Instantiate skeleton and render on screen
    setup(){
        super.setup();
        //instantiate skeleton
        this.gameSession.skeleton = new Skeleton();


    }

    update(){
        super.update();

        this.gameSession.skeleton.update();
    }

    render(){
        super.render();

        this.gameSession.skeleton.update();
    }

    resize(){
        super.resize();
    }

    cleanup(){
        super.resize();
    }
}