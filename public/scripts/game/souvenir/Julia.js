import GameSession from "../GameSession.js"; 

// the vertex shader is called for each vertex
let vs = `
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 }
`;


// the fragment shader is called for each pixel
let fs = `
precision highp float;
const int iterations = 500;
const int dB = 0;
const int dG = 0;
const float escape = 4.0;

uniform vec2 center;
uniform vec2 control;
uniform float scale;
uniform float resolution;

void main() {
  float w = resolution/2.0;
  vec2 screen = vec2( 
    ((gl_FragCoord.x - (w)) / w), 
    ((gl_FragCoord.y - (w)) / w) );
  vec2 world = (screen*scale) + center;

  vec2 z = world;
  float n = 0.0;
  int c = 0;
  for (int i = iterations; i > 0; i--) {
    float r2 = z.x * z.x;
    float i2 = z.y * z.y;
    float tr = r2 - i2 + control.x;
    float ti = 2.0*z.x*z.y + control.y;
    z = vec2(tr, ti);
    // if (z.x+z.y > escape) { // causes interesting slope-ward striations...
    if (r2+i2 > escape) {
      n = float(i)/float(iterations);
      c = i;
      break;
    }
  }

  // Debug screen coordinates
//   gl_FragColor = vec4(screen[0], 0, screen[1], 1.);
//   gl_FragColor = vec4(world[0], 0, world[1], 1.);

  // banded color using modulus, prevent discontinuities with abs
  gl_FragColor = vec4( 
    0.0, 
    abs(mod(float(c), 32.0) - 16.0) / 16.0, 
    abs(mod(float(c), 16.0) - 8.0) / 8.0, 
    1.0 );
  // TODO add adjustable offset like with previous examples

  // sinusoidal coloring
  // gl_FragColor = vec4(
  //   0.5-cos(n*17.0)/2.0,
  //   0.5-cos(n*13.0)/2.0,
  //   0.5-cos(n*23.0)/2.0,
  //   1.0);
  // mutually prime frequencies in color channels give unique colors up until 13*17*23

}`;

export default class Julia {

    _resolution;
    _scale;
    _center;
    _control;
    _shader;
    
    constructor(
        resolution = 512,
        center = [0.0, 0.0], 
        control = [0.0, 0.0],
        scale = 1.0) 
    {
        this._resolution = resolution;
        this._center = center;
        this._control = control;
        this._scale = scale;
        this._session = new GameSession();
        this._p5 = this._session.p5;
        this.g = this._p5.createGraphics(this._resolution, this._resolution, this._p5.WEBGL);
    
      // create and initialize the shader
      this._shader = this.g.createShader(vs, fs);
      this.g.shader(this._shader);
    }
    
    get scale() { return this._zoom; }
    set scale(s) { this._scale = s; }
    get center() { return this._center; }
    set center(v) { this._center = v; }
    get control() { return this._control; }
    set control(v) { this._control = v; }

    update() {

    }

    render() {
    
    //   // project mouse gestures into the complex plane
    //   if (mouseIsPressed) {
    //     let start = [pmouseX, pmouseY];
    //     let end = [mouseX, mouseY];
    //     let diff = [
    //       zoom*(end[0]-start[0])/resolution, 
    //       zoom*(end[1]-start[1])/resolution ];
        
    //     // left mouse updates the position of the fractal
    //     if (mouseButton==LEFT) {
    //       center = [center[0]-diff[0], center[1]+diff[1]];
    //       julia.setUniform('center', center);
    //       originDiv.innerText = "origin = ("+center[0]+", "+center[1]+"i)";
    //     }
    
    //     // right mouse button updates the fractal's control point        
    //     if (mouseButton==RIGHT) {
    //       control = [control[0]-diff[0], control[1]+diff[1]];
    //       julia.setUniform('control', control);
    //       controlDiv.innerText = "control = ("+control[0]+", "+control[1]+"i)";
    //     }
    //   }
    
    // console.log( this._center, this._control, this._scale, this._resolution);
      this._shader.setUniform('resolution', this._resolution);
      this._shader.setUniform('center', this._center);
      this._shader.setUniform('control', this._control);
      this._shader.setUniform('scale', this._scale);
      // this._g.noStroke();
      this.g.shader(this._shader);
      this.g.plane(this._resolution, this._resolution);
      //this._session.p5.imageMode(this._session.p5.CORNER);
      this._session.p5.image(this.g, this._session.canvasWidth/2.0, this._session.canvasHeight/2.0, this._session.canvasWidth, this._session.canvasHeight);
        // -this._resolution/2.0, -this._resolution/2.0, 2.0*this._resolution, 2.0*this._resolution);
      
      // p5.image(img, dx, dy, dw, dh, sx, sy, sw, sh, 
      // fit{CONTAIN|COVER}, xAlign{LEFT|RIGHT|CENTER}, yAlign{TOP|BOTTOM|CENTER})
    }
    
    // function mouseWheel(event) {
    //   if (event.delta<0)
    //     zoom *= 0.9;
    //   else if (event.delta>0)
    //     zoom *= 1.1;
    //   julia.setUniform('scale', zoom);
    //   scaleDiv.innerText = "scale = "+zoom;
    // }
}