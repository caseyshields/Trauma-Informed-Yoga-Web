import Sound from "../../core/Sound/Sound.js";

export default class BreathingSound extends Sound {
    // notes
    in_note = "G4";
    out_note = "F4";
    back_note = "C4";

    // volumes
    baseVol = -10;
    max_vol = 0;
    min_vol = -10;

    // section lengths (seconds)
    in_count = 4;
    in_hold_count = 4;
    out_count = 4;
    out_hold_count = 4;
    total_loop_time = 4;

    // synth setup
    synth_1 = {};
    harmonicity = 0;

    synth_2 ={};

    //effects
    lowpass_filter = {};
    lpf_frequency = 200;

    tremolo = {};
    tremolo_amount = 1;
    tremolo_length = 1;

    constructor(){
        super();

        this.synth_1 = new Tone.AMSynth({oscillator : {type: "sawtooth"}});
        this.synth_2 = new Tone.Synth({oscillator : {type: "sine"}});
        
        this.lowpass_filter = new Tone.Filter(this.lpf_frequency, "lowpass");
        this.tremolo = new Tone.Tremolo(this.tremolo_length,this.tremolo_amount);
    }

    setup(){
        console.log("breathingSound.setup() called");
        this.synth_1.harmonicity.value = this.harmonicity;
        this.synth_2.volume.value = this.baseVol;

        this.synth_1.chain(this.lowpass_filter,Tone.Destination);
        this.tremolo.toDestination().start();
        this.synth_2.connect(this.tremolo);

        this.total_loop_time = this.in_count + this.in_hold_count + this.out_count + this.out_hold_count;

        this.breathing_loop = new Tone.Loop((time) => {
            // triggered every eighth note.
            this.breathing_effect(this.in_note,this.out_note,this.in_count,this.in_hold_count,this.out_count,this.out_hold_count);
            }, this.total_loop_time).start(0);
          
    }

    trigger(){
        console.log("breathingSound.trigger() called");
        // triggers one loop
        this.in_sound(this.in_note,this.in_count,this.min_vol,this.max_vol);
        this.out_sound(this.out_note,this.out_count,this.in_hold_count,this.min_vol,this.max_vol);
        this.synth_2.triggerAttackRelease(this.back_note,this.total_loop_time);
    }
    startLoop(){
        this.breathing_loop.start();
    }
    stopLoop(){
        this.breathing_loop.stop();
    }

    in_sound(in_note,in_count,min_vol,max_vol){
        this.synth_1.volume.value = min_vol;
        this.synth_1.triggerAttackRelease(in_note,(in_count + 1));
        
        this.synth_1.volume.setRampPoint("+0");                                 
        this.synth_1.volume.exponentialRampToValueAtTime(max_vol, "+1");
        this.synth_1.volume.setRampPoint("+" + in_count.toString());                                 
        this.synth_1.volume.exponentialRampToValueAtTime(min_vol, "+" + (in_count + 1).toString());
    }
      
    out_sound(out_note,out_count,in_count,in_hold_count,min_vol,max_vol){
        this.synth_1.triggerAttackRelease(out_note,(out_count),"+" + (in_count + in_hold_count).toString());
        
        this.synth_1.volume.setRampPoint("+" + (in_count + in_hold_count).toString());
        this.synth_1.volume.exponentialRampToValueAtTime(max_vol,"+" + (in_count + in_hold_count + 1).toString());
        this.synth_1.volume.setRampPoint("+" + (in_count + in_hold_count + out_count).toString());                                 
        this.synth_1.volume.exponentialRampToValueAtTime(min_vol, "+" + (in_count + in_hold_count + out_count + 1).toString());
    }

    breathing_effect(in_note,out_note,in_count,in_hold_count,out_count,out_hold_count){
        this.in_sound(this.in_note,this.in_count,this.min_vol,this.max_vol);
        this.out_sound(this.out_note,this.out_count,this.in_count,this.in_hold_count,this.min_vol,this.max_vol);
        this.synth_2.triggerAttackRelease(this.back_note,this.total_loop_time);
    }
}