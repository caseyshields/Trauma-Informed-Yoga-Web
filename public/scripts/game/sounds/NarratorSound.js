import Sound from "../../core/Sound/Sound.js";

export default class NarratorSound extends Sound {
    synth = {};
    baseVol = -10;
    basePitch = 200;
    pitchVariation = 50;
    pace = .6;
    Speed = 120;
    narratorStop = {};
    lowPass = {};
    autoWah = {};
    vib = {};
    reverb = {};
    narratorLoop = {};

    constructor(){
        super();

        this.synth = new Tone.AMSynth({
            oscillator : {
              type: "sawtooth",
            }
        });
        this.lowPassFilter = new Tone.Filter(800, "lowpass");
        this.autoWah = new Tone.AutoWah(100,5, -15);
        this.vib = new Tone.Vibrato(10,0.05);
        this.reverb = new Tone.FeedbackDelay("16n",0.1);
    }

    setup(){
        this.synth.volume.value = this.baseVol;
        this.synth.chain(this.autoWah,this.lowPassFilter,this.vib,this.reverb,Tone.Destination);

        this.narratorLoop = new Tone.Loop((time)=>{
            this.trigger();
        },"16n");
    }

    //plays a single note randomly
    trigger(){
        this.autoWah.baseFrequency = this.gameSession.p5.random(80,150);
        this.autoWah.octaves = this.gameSession.p5.random(4,5.5);
        this.synth.triggerAttackRelease(
            this.gameSession.p5.random(
                this.basePitch,
                this.basePitch + this.pitchVariation
            ),
            0.1/this.pace
        );
    }

    //starts loop
    startLoop(){
        this.narratorLoop.start();
    }

    //stops loop
    stopLoop(){
        this.narratorLoop.stop();
    }

}