import BreathingManager from "./breath.js";

/** A fractal created by measuring how fast this iterated function diverges; <br>
 * <code>Z<sub>n-1</sub> = Z<sub>n</sub><super>2</super> + C</code><br>
 * Where Z is a point in the complex plane projected from an image pixel, and C is a control point.
*/
export default class Julia {

  /** 
   * @param {Number} width width of the screen in pixels
   * @param {Number} height of the screen in pixels 
   * // TODO let user set initial coordinates too?
  */
  constructor(p5, width=512, height=512) {
    this._width = width/2;
    this._height = height/2;
    this._Or = 0; // camera origin
    this._Oi = 0;
    this._Cr = 0; // Control point
    this._Ci = 0;
    this._scale = 1/width; // scaling factor from screen to complex plane
    this._escape = 1e10; // if the iterated function grows larger than this, we consider it divergent
    this._maxIteration = 512; // if the function iterates this many times we assume it never will diverge
    this._image = p5.createImage(width,height);

    // this._offset = 0;
    // this._dR = 0;
    this._dG = 0;
    this._dB = 0; 
  }

  /** Renders an image of the fractal using the current origin, control and scale. */
  update() {
    let iteration; //
    let r2, i2; // temp vars for avoiding duplicate multiplications
    let r, i; // temp vars for the value of the iterated function
    this._image.loadPixels(); // P5 encodes pixels in row column order with RGBA channels
    let n = 0; // pixel index

    // iterate through pixels in the imaginary, horizontal axis
    let Zi = this._Oi - (this._width*this._scale);
    for(let y=-this._height; y<this._height; y++) {

      // iterate through pixels in the real, vertical axis
      let Zr = this._Or - (this._height*this._scale);
      for (let x=-this._width; x<this._width; x++) {

        // measure how fast the complex iterated function for this pixel diverges
        r = Zr;
        i = Zi;
        iteration = 0;
        do {
          r2 = r*r;
          i2 = i*i;
          let tZr = r2 - i2 + this._Cr;
          let tZi = 2*r*i + this._Ci;
          iteration ++;
          r = tZr;
          i = tZi;
        } while ( r2 + i2 < this._escape //(r*r) 
            && iteration < this._maxIteration)

        // map it to a color
        this._image.pixels[n] = 0;
        this._image.pixels[n+1] = 8*Math.abs((((32*this._dG)+iteration)%32)-16);
        this._image.pixels[n+2] = 16*Math.abs((((16*this._dB)+iteration)%16)-8);
        this._image.pixels[n+3] = 255;
        // I think this can be more optimized... and I'm not sure color offsets should be exposed...

        // increment pixel and complex coordinates
        n += 4;
        Zr += this._scale;
      }
      Zi += this._scale;
    }
    this._image.updatePixels();
  }

  /** @returns {P5.image} the image of the fractal from the last time update() was called. */
  get image() { return this._image; }

  /** Converts an complex coordinate into an image coordinate
   * @param {Number} r the real component of the image coordinate
   * @param {Number} i the imaginary component of the image coordinate
   * @returns {Number[]} The image coordinates with the origin in the top-left corner
   * */
  imageToScreen([r,i]) {
    return [(r/this._scale)+this._width, 
        (i/-this._scale)+this._height];
  }

  /** converts an image coordinate into the complex plane of the fractal
   * @param {Number} x pixels from the left side of the image
   * @param {Number} y pixels from the top of the image
   * @return {Number[]} Complex coordinates relative to the fractal origin
  */
  screenToImage([x,y]) {
    return [(x-this._width)*this._scale, 
        (y-this._height)*-this._scale];
  } // I might just want to switch to using P5 vectors and matrices...

  /** Position of the center of the image in the complex plane.
   * @param {Number} r the real or horizontal part.
   * @param {Number} i the imaginary or vertical part.
   */
  set position([r,i]) {
    this._Or = r;
    this._Oi = i;
  }

  get position() {
    return [this._Or,this._Oi];
  }

  set control([r,i]) {
    this._Cr = r;
    this._Ci = i;
  }

  get control() { return [this._Cr, this._Ci]; }

  /** Sets the image scale
   * @param s the size of a pixel in the complex plane
   */
  set scale(s) { this._scale = s; }
  
  /** @returns the size of a pixel in the complex plane */
  get scale() { return this._scale; }

  get width() { return 2*this._width; }

  // TODO differential versions of the setters?
  // TODO resize image?
  
  get greenOffset() {return this._dG;}
  set greenOffset(d) {this._dG = d;}
  get blueOffset() {return this._dB;}
  set blueOffset(d) {return this._dB = d;}
  // TODO Maybe a better approach is make a mutator for a color mapping function, f(iterations)->(r,g,b)
}
