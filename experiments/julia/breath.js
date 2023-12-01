/** @class BreathingManager meters out breathing. */
export default class Breath {

    // should we track the number of breaths for sustained targets and such?

    #time = 0; // the current time in ms in the current cycle of breath
    #breath = 0; // a Number in [0,1] that represents the current lung volume
    #phase = []; // the end of each phase in ms in one cycle of breath
    #running = false;
    #inhale;
    #hold;
    #exhale;
    #wait;
        
    /** @constructor 
     * @param {Number} inhale duration in milliseconds
     * @param {Number} hold duration in milliseconds
     * @param {Number} exhale duration in milliseconds
     * @param {Number} wait duration in milliseconds
    */
    constructor(inhale, hold, exhale, wait) {
        this.#time = 0; // the current time in ms in the current cycle of breath
        this.#breath = 0; // a Number in [0,1] that represents the current lung volume
        this.#phase = []; // the end of each phase in ms in one cycle of breath
        this.#running = false;
        this.#inhale = inhale;
        this.#hold = hold;
        this.#exhale = exhale;
        this.#wait = wait;
        this.#updatePhases();
    }
    
    #updatePhases() {
        this.#phase[0] = this.#inhale;
        this.#phase[1] = this.#hold + this.#phase[0];
        this.#phase[2] = this.#exhale + this.#phase[1];
        this.#phase[3] = this.#wait + this.#phase[2];
    }

    /** Update the current breath volume. Inhalation and exhalation are sinusoidally eased. */
    update(deltaTime) {
      // It is likely we'll adopt easing or animation modules. If so we might just use the easing provided by them.

      // do not breath if the game is paused
      if (!this.#running) return;
      // TODO should pause be moved to the game session?

      // track elapsed time in the cycle
      this.#time = (this.#time + deltaTime) % this.#phase[3];
      
      // inhale
      if (this.#time < this.#phase[0])
        this.#breath = (1 - Math.cos(Math.PI * this.#time / this.#inhale)) / 2;
      
      // hold
      else if (this.#time < this.#phase[1])
        this.#breath = 1;

      // exhale
      else if (this.#time < this.#phase[2])
        this.#breath = (1 + Math.cos(Math.PI * (this.#time-this.#phase[1]) / this.#exhale)) / 2;

      // wait
      else // if (this.#time < this.#phase[3])
        this.#breath = 0;

    }
    
    /** halt the breathing timer */
    pause() { this.#running = false; }

    /** start the breathing timer */
    play() { this.#running = true; }

    /** @returns a number in [0,1] representing the current volume of the lungs */
    get value() { return this.#breath; }

    /** @return {Number} the duration in ms */
    get inhale() { return this.#inhale; }

    /** @return {Number} the duration in ms */
    get hold() { return this.#hold; }

    /** @return {Number} the duration in ms */
    get exhale() { return this.#exhale; }

    /** @return {Number} the duration in ms */
    get wait() { return this.#wait; }

    // TODO add duration setters which correctly update time so no animation skips
    // (scale the offset in the current phase to the new boundaries)
}
