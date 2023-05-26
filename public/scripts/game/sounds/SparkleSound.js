import Sound from "../../core/Sound/Sound.js";

export default class SparkleSound extends Sound {

    fmSynth = {};
    nSynth = {};
    noteButton = {};
    startLoop = {};
    part = {};
    randomPart = {};
    delay = 0;
    baseVol = -20;
    notes = [
        "C5","E5","G5","B5",
        "C6","E6","G6","B6",
        "C7","E7","G7","B7"
]; //TODO: refactor to tone sound class.

    constructor(){
        super();

        this.fmSynth = new Tone.FMSynth();
        this.nSynth = new Tone.MetalSynth();
        this.delay = new Tone.FeedbackDelay("8t", 0.7);
    }

    setup(){
  
        this.fmSynth.volume.value = this.baseVol;
        this.fmSynth.chain(this.delay,Tone.Destination);
        
        this.nSynth.volume.value = this.baseVol-35;
        this.nSynth.chain(this.delay,Tone.Destination);

        this.part = new Tone.Part(((time, value) => {
            // the value is an object which contains both the note and the velocity
            this.fmSynth.triggerAttackRelease(value.note, "32t", time, value.velocity);
            this.nSynth.triggerAttackRelease("C3","32t",time,0.2);
            this.part.stop("+0:0:10.5"); 
              
            }), 
            [ { time: 0, note: "C7", velocity: 0.9 },
              { time: "+0:0:0.5", note: "A6", velocity: 0.5 },
              { time: "+0:0:1", note: "D7", velocity: 0.5 },
              { time: "+0:0:1.5", note: "A7", velocity: 0.5 },
              { time: "+0:0:2", note: "E7", velocity: 0.5 },
              { time: "+0:0:2.5", note: "F7", velocity: 0.5 },
              { time: "+0:0:3", note: "D7", velocity: 0.5 },
              { time: "+0:0:3.5", note: "C7", velocity: 0.5 },
              { time: "+0:0:4", note: "A7", velocity: 0.5 },
              { time: "+0:0:4.5", note: "E7", velocity: 0.5 },
              { time: "+0:0:5", note: "F7", velocity: 0.5 },
              { time: "+0:0:5.5", note: "B7", velocity: 0.5 },
              { time: "+0:0:6", note: "C7", velocity: 0.5 },
              { time: "+0:0:6.5", note: "A7", velocity: 0.5 },
              { time: "+0:0:7", note: "G7", velocity: 0.5 },
              { time: "+0:0:7.5", note: "E7", velocity: 0.5 },
              { time: "+0:0:8", note: "C7", velocity: 0.5 },
              { time: "+0:0:8.5", note: "A7", velocity: 0.5 },
              { time: "+0:0:9", note: "D7", velocity: 0.5 },
              { time: "+0:0:9.5", note: "G7", velocity: 0.5 },
              { time: "+0:0:10", note: "F7", velocity: 0.5 },
              { time: "+0:0:10.5", note: "C7", velocity: 0.5 },
            ]);
    }

    //plays a single note randomly
    trigger(){
        this.fmSynth.triggerAttackRelease(this.gameSession.p5.random(this.notes),"32t");
        this.nSynth.triggerAttackRelease("C3","32t");
    }

    //starts loop
    startLoop(){
        this.part.start();
    }

    //stops loop
    stopLoop(){
        this.part.stop();
    }


}