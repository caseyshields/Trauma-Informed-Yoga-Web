import Form from "./Form.js";
import Target from "./Target.js";
import ArmTarget from "./ArmTarget.js";


export default class SeatedSunBreath extends Form {

    constructor(){
        super();

    }

    setup(){
        //Add all relevant targets to form queue
        //TODO: Test target out
		this.leftInnerPalmBone = this.gameSession.skeleton.getBone("Left Innerpalm");
        this.rightInnerPalmBone = this.gameSession.skeleton.getBone("Right Innerpalm");

        
        // instantiate list of targets for complete pose
        let targetSet1 = [];
        let targetSet2 = [];
        let targetSet3 = [];
        let targetSet4 = [];
        let targetSet5 = [];
        let targetSet6 = [];
        let targetSet7 = [];

        let skeleton = this.gameSession.skeleton;
        let radius = 100;
        let holdDuration = 5000;
        let isConsecutive = false;
        //two targets approximately shoulder height and arms length away from body
        targetSet1[0] = new ArmTarget(0, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet1[1] = new ArmTarget(180, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet2[0] = new ArmTarget(330, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet2[1] = new ArmTarget(210, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet3[0] = new ArmTarget(300, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet3[1] = new ArmTarget(240, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet4[0] = new ArmTarget(270, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet4[1] = new ArmTarget(270, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet5[0] = new ArmTarget(300, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet5[1] = new ArmTarget(240, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet6[0] = new ArmTarget(330, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet6[1] = new ArmTarget(210, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        targetSet7[0] = new ArmTarget(0, radius, this.leftInnerPalmBone, holdDuration, isConsecutive, skeleton);
        targetSet7[1] = new ArmTarget(180, radius, this.rightInnerPalmBone, holdDuration, isConsecutive, skeleton);

        this.targetQueue.enqueueTarget(targetSet1);
        this.targetQueue.enqueueTarget(targetSet2);
        this.targetQueue.enqueueTarget(targetSet3);
        this.targetQueue.enqueueTarget(targetSet4);
        this.targetQueue.enqueueTarget(targetSet5);
        this.targetQueue.enqueueTarget(targetSet6);
        this.targetQueue.enqueueTarget(targetSet7);
	
    }

    update(){

        if(!this.isLoaded && this.targetQueue.length > 0){
            this.currentTargets = this.targetQueue.dequeueTarget();
            this.isLoaded = true;
            console.log("target queue length: " + this.targetQueue.length);
        }

        //TODO: This isn't queueing targets like I expect - 
        let targetsComplete = true;
        for(let i = 0; i < this.currentTargets.length; i++){
            if(!this.currentTargets[i].targetComplete){
                targetsComplete = false;
            } 
            this.currentTargets[i].update();
        }

        if(targetsComplete){
            this.isLoaded = false;
        }
        
     
        
    }

    render(){
        if(this.isLoaded){
            let targetsLength = this.currentTargets.length;
            for (let i = 0; i < targetsLength; i++){
                this.currentTargets[i].render();
            }
        }

    }


    loadTargetQueue(){

        //Initial target load




    }

}