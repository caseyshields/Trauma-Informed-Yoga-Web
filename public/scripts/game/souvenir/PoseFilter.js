/** Provide a time averaged window with outlier rejection specifically for mediapipe's pose estimation.
 */
export default class Poser {

    total = 0;
    
    count = [];
    // cutoff = 0.5; // measurements below this confidence score are discarded.
    measurements = [];
    position = [];
    velocity = [];

    constructor(size) {

    }

    add(pose) {
        // after filtering down the pertinent info should we store a time series for playback or later rendering?
        // storeItem(time+id, state);
    }
}