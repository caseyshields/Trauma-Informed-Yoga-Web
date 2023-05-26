import Sound from "../../core/Sound/Sound.js";

export default class WaveSound extends Sound {

    noise = {};
    waveLoop = {};
    waveOn = {};
    waveOff = {};
    baseVol = -15;
    lowPassFilter = {};
    highPassFilter = {};
    baseHPF = 60;
    baseLPF = 900;
    waveCount = 0;

    intensityVariation = 1000;
    frequency = 1;

    constructor(){
        
        super();
        //TODO: constructor for LPF/HPF settings
        this.noise = new Tone.Noise("pink");
        this.lowPassFilter = new Tone.Filter(this.baseLPF, "lowpass");
        this.highPassFilter = new Tone.Filter(this.baseHPF, "highpass");

    }

    setup(){

        this.noise.volume.value = this.baseVol;
        this.noise.chain(this.lowPassFilter, this.highPassFilter, Tone.Destination);

        this.waveLoop = new Tone.Loop(
            (time)=>{
                this.waveEffect(
                    this.gameSession.p5.random(200, this.intensityVariation), 
                    this.gameSession.p5.random(5,15)
                );
            }, 
            "2n"
        );

        this.waveLoop.probability = this.frequency;
        
    }

    trigger(){
        console.log("Wave noise is not intended for discrete use.");
    }

    startLoop(){
        super.startLoop();
        this.noise.start();
        this.waveLoop.start();
    }

    stopLoop(){
        super.stopLoop();
        this.noise.stop();
        this.waveLoop.stop();
    }

    waveEffect(intensity, length){
        // to make wave sound... 
        // low pass filter goes up to base + some amount dependant on intensity
        // then a little later, high pass filter goes down to base - some amount dependant on intensity

        // wave count
        this.waveCount += 1;

        let lpPeak = intensity * 2;

        this.lowPassFilter.frequency.setRampPoint("+0");                                  
        this.lowPassFilter.frequency.exponentialRampToValueAtTime((this.baseLPF + lpPeak),"+" + this.gameSession.p5.str(length*0.2)); // 2
        this.lowPassFilter.frequency.setRampPoint("+" + str(length*0.4));                                    // 4
        this.lowPassFilter.frequency.linearRampToValueAtTime(this.baseLPF - (lpPeak/15),"+" + this.gameSession.p5.str(length*0.7));    // 7
        this.lowPassFilter.frequency.linearRampToValueAtTime((this.baseLPF),"+" + this.gameSession.p5.str(length*0.8));               // 8

        this.highPassFilter.frequency.setRampPoint("+" + str(length*0.5));                                                // 5                    
        this.highPassFilter.frequency.exponentialRampToValueAtTime((this.baseHPF - (intensity/15)), "+" + this.gameSession.p5.str(length*0.65));   // 6.5
        this.highPassFilter.frequency.exponentialRampToValueAtTime((this.baseHPF + 2*(intensity/20)),"+" + this.gameSession.p5.str(length*0.75));  // 7.5
        this.highPassFilter.frequency.exponentialRampToValueAtTime((this.baseHPF),"+" + str(length*1));                        // 10

        this.noise.volume.setRampPoint("+0");                                 
        this.noise.volume.exponentialRampToValueAtTime(this.baseVol + (intensity/650), "+" + this.gameSession.p5.str(length*0.3));     //3
        this.noise.volume.exponentialRampToValueAtTime(this.baseVol - (intensity/500), "+" + this.gameSession.p5.str(length*0.9));     //9
        this.noise.volume.exponentialRampToValueAtTime(this.baseVol, "+" + this.gameSession.p5.str(length*1));//10
    }
}