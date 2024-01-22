import GameSession from "../GameSession.js";

const MaxParticles = 50;
const landmarks = [
    'nose',
    'left eye (inner)',
    'left eye',
    'left eye (outer)',
    'right eye (inner)',
    'right eye',
    'right eye (outer)',
    'left ear',
    'right ear',
    'mouth (left)',
    'mouth (right)',
    'left shoulder',
    'right shoulder',
    'left elbow',
    'right elbow',
    'left wrist',
    'right wrist',
    'left pinky',
    'right pinky',
    'left index',
    'right index',
    'left thumb',
    'right thumb',
    'left hip',
    'right hip',
    'left knee',
    'right knee',
    'left ankle',
    'right ankle',
    'left heel',
    'right heel',
    'left foot index',
    'right foot index'
];

/** Different parts of the pose emit smoke of different hues in time with breath */
export default class Smoke {
    
    // TODO handle resize events by resizing our graphics context too!

    static DefaultSettings = {
        emitters : [
            {
                landmark : { type:'select', values:landmarks, value:'nose' },
                exhale_size: { type:'range', min:0, max:64, value:16 },
                inhale_size: { type:'range', min:0, max:64, value:32 },
                fuzz: { type: 'range', min:0, max:32, value:4 },
                exhale_color: { type:'color', value:'#199619'},//[25,150,25,5] },//
                inhale_color: { type:'color', value:'#646464'},//[100,100,100,1] },//
                exhale_opacity: { type:'range', min:0, max:255, value:4},
                inhale_opacity: { type:'range', min:0, max:255, value:4}
            },{
                landmark : { type:'select', values:landmarks, value:'left wrist' },
                exhale_size: { type:'range', min:0, max:64, value:16 },
                inhale_size: { type:'range', min:0, max:64, value:32 },
                fuzz: { type: 'range', min:0, max:32, value:4 },
                exhale_color: { type:'color', value:'#960019' },//[150,0,25,5] },
                inhale_color: { type:'color', value:'#646464' },//[100,100,100,1] },
                exhale_opacity: { type:'range', min:0, max:255, value:4},
                inhale_opacity: { type:'range', min:0, max:255, value:4}
            },{
                landmark : { type:'select', values:landmarks, value:'right wrist' },
                exhale_size: { type:'range', min:0, max:64, value:16 },
                inhale_size: { type:'range', min:0, max:64, value:32 },
                fuzz: { type: 'range', min:0, max:32, value:4 },
                exhale_color: { type:'color', value:'#190096'},//[25,0,150,5] },
                inhale_color: { type:'color', value:'#646464'},//[100,100,100,1] },
                exhale_opacity: { type:'range', min:0, max:255, value:4},
                inhale_opacity: { type:'range', min:0, max:255, value:4}
            }
        ]
    }

    /** @constructor 
     * @param {Trail[]} settings An array  of smoke trail configurations
     * @param {Number} Trail.index index of a pose landmark in the current filtered GameSession pose
     * @param {Number} Trail.small size of smoke when breath is empty
     * @param {Number} Trail.large size of smoke when breath is full
     * @param {Number} Trail.fuzz amount to randomly perturb smoke
     * @param {Number[]} Trail.empty The rgb(a) color channels of the smoke when breath is empty
     * @param {Number[]} Trail.full The rgb(a) color channels of the smoke when breath is full
    */
    constructor( settings = Smoke.DefaultSettings ) {
        this._session = new GameSession();

        // create a separate graphics context where we render the smoke
        this._g = this._session.p5.createGraphics(
            this._session.canvasWidth, 
            this._session.canvasHeight);

        // set emitter configuration
        this._config = JSON.parse( JSON.stringify(settings) );
    }

    get settings() {return this._config;}
    set settings(config) { this._config = config }
    get defaults() { return JSON.parse(JSON.stringify(Smoke.DefaultSettings)); }

    /** Blend smoke trails into an offscreen buffer then draw it into the main context*/
    render() {
        // this._g.background(0,0,0,5);

        // general state machine styling
        this._g.noStroke();
        // this._g.blendMode(this._g.SCREEN); // BLEND // DIFFERENCE
        // NOTE: enabling blend mode appears to be VERY expensive on some platforms...

        // for each valid configured pose landmark
        for(let e of this._config.emitters) {
            
            // find the emitter's landmark's index
            let index = landmarks.indexOf(e.landmark.value);
            if (index==-1)
                continue;

            // lookup the corresponding filtered landmark
            let mark = this._session.pose.state[index];
            if (mark) {

                // set the color and size for the emitter using current breath volume
                let empty = this._g.color(e.exhale_color.value);
                empty.setAlpha(e.exhale_opacity.value);
                let full = this._g.color(e.inhale_color.value);
                full.setAlpha(e.inhale_opacity.value);
                let c = this._g.lerpColor(empty, full, this._session.breathingManager.breath);
                let d = e.exhale_size.value + (1-this._session.breathingManager.breath)*(e.inhale_size.value-e.exhale_size.value);
                this._g.fill(c);

                // draw a path of circles whose density is roughly proportional to the velocity
                let v = this._g.mag(mark.vx, mark.vy);
                if (v > MaxParticles) 
                    v = MaxParticles;

                for (let n=v; n>0; n--) {
                    let r = n/v
                    let x = mark.x - r*mark.vx + Math.random()*e.fuzz.value;
                    let y = mark.y - r*mark.vy + Math.random()*e.fuzz.value;
                    this._g.circle(x, y, d);
                }
            }
        }

        // draw it to the screen
        this._session.p5.image( this._g, 
            this._session.canvasWidth/2, 
            this._session.canvasHeight/2);
    }
    // TODO should this class even render? should it just expose an image?
    // I ask because just overlaying the image might not be what we want every time;
    // what if we want to use alpha masks and composite or something?

}
