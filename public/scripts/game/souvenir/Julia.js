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
const float resolution = 379.0;
const vec2 offset = vec2(379.0, 379.0);
const int iterations = 500;
const int dB = 0;
const int dG = 0;
const float escape = 4.0;

uniform vec2 center;
uniform vec2 control;
uniform float scale;

void main() {
  vec2 screen = (gl_FragCoord.xy - offset) / resolution;
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
  // gl_FragColor = vec4(screen[0], 0, screen[1], 1.);
  // gl_FragColor = vec4(world[0], 0, world[1], 1.);

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

    resolution = 758;
    zoom = 1.0;
    center = [0.0, 0.0];
    control = [-0.75, -0.05];
    shader;
    
    constructor() {
        this._session = new GameSession();
        this._p5 = this._session.p5;
        this.g = this._p5.createGraphics(758, 758, this._p5.WEBGL);
    
      // create and initialize the shader
      this.shader = this.g.createShader(vs, fs);
      this.g.shader(this.shader);
    //   this.g.noStroke();
    }
    
    get scale() { return this.zoom; }
    set scale(s) { 
        this.scale = s;
        this.shader.setUniform('scale', this.scale);
    }
    get center() {return this.center; }
    set center(v) {
        this.center = v;
        this.shader.setUniform('center', this.center);
    }
    get control() {return this.control; }
    set control(v) {
        this.control = v;
        this.shader.setUniform('control', this.control);
    }

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
    
      this.shader.setUniform('center', this.center);
      this.shader.setUniform('control', this.control);
      this.shader.setUniform('scale', this.zoom);

      this.g.shader(this.shader);
      this.g.plane(this.resolution, this.resolution);
      this._session.p5.image(this.g, 0,0,this._session.canvasWidth*2, this._session.canvasHeight*2);
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