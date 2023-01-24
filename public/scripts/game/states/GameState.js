import State from "../../core/State.js";
import Skeleton from "../Skeleton.js";

/** Example of Gamestate
 * 
 *  1. Renders a background
 *  2. Takes poseLandmarks and renders a skeleton
 *  3. Loads relevant game items (charge pack, etc.)
 *  4. Goes through 4 poses
 *  5. Transition to game over
 * 
 * Alt: Game over on empty charge pack for 5 seconds
 */

export default class GameState extends State {

    constructor(){
        super("Game");
        //check 

    }

    setup(){
        super.setup();

        //Instantiate skeleton
		this.gameSession.skeleton = new Skeleton();
    }

    render(){
        super.render();

        //Render skeleton
        this.gameSession.skeleton.render();
    }

    update(){
        super.update();

        //Update skeleton
        this.gameSession.skeleton.update();
    }

    cleanup(){
        super.update();
    }

    get gameBackground(){
        return this.__gameBackground;
    }

}