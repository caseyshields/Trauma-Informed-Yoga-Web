
let silhouette = [
    { name: 'thickness', type: 'range', min:0, max:100, value: 0 },
    { name: 'exhale color', type: 'color', value: [50,50,50] },
    { name: 'inhale color', type: 'color', value: [250,250,250] }
];

let smokeTrails = [
    { name:'landmark', type:'select', values:landmarks, value:0 },
    { name:'exhale size', type:'range', min:0, max:64, value:16 },
    { name:'inhale size', type:'range', min:0, max:64, value:32 },
    { name:'fuzz', type: 'range', min:0, max:32, value:4 },
    { name:'exhale color', type:'color', value:[25,150,25,5] },
    { name:'inhale color', type:'color', value:[100,100,100,1] }
]

let landmarks = [
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

/**  */
export default class Config {

    // bool = {
    //     input: 'checkbox',
    //     value: Boolean,
    // }
    // color = {
    //     input: 'color',
    //     value: Array,
    // }
    // number = {
    //     input: range,
    //     min: Number,
    //     max: Number,
    //     value: Number,
    // }
    // set = {
    //     input: radio,
    //     options: Array,
    //     value: String,
    // }

    /** */
    constructor(configs) {
        for (let config of configs) {
            for (let param in config) {
                
            }
        }
    }


}