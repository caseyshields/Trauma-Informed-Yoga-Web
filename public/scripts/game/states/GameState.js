import State from "../../core/State.js";

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


    }

    setup(){
        super.setup();

        
    }

    render(){
        super.render();
    }

    update(){
        super.update();
    }

    cleanup(){
        super.update();
    }

    get gameBackground(){
        return this.__gameBackground;
    }

    set gameBackground(gameBackground){
        this.__gameBackground = gameBackground;
    }

    get sweatEffect(){
        return this.__sweatEffect;
    }

    set sweatEffect(sweatEffect){
        this.__sweatEffect = sweatEffect;
    }

    get circleUI(){
        return this.__circleUI;
    }

    set circleUI(circleUI){
        this.__circleUI = circleUI;
    }

    get chargeEffectBefore(){
        return this.__chargeEffectBefore;
    }

    set chargeEffectBefore(chargeEffectBefore){
        this.__chargeEffectBefore = chargeEffectBefore;
    }

    get benderBodyParts(){
        return this.__benderBodyParts;
    }

    set benderBodyParts(benderBodyParts){
        this.__benderBodyParts = benderBodyParts;
    }
}