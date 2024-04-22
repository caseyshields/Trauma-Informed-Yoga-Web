/** This example taken from;
 * https://p5js.org/reference/#/p5/createShader
 */

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
const float resolution = 512.0;
const vec2 offset = vec2(1024.0, 512.0);
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

let resolution = 512;
let zoom = 1.0;
let center = [0.0, 0.0];
let control = [-0.75, -0.05];
let julia;


let mouse;
let originDiv;
let controlDiv;
let scaleDiv;

function setup() {
  createCanvas(1024, 512, WEBGL);

  mouse = document.getElementById("mouse");
  originDiv = document.getElementById("origin");
  controlDiv = document.getElementById("control");
  scaleDiv = document.getElementById("scale");

  // create and initialize the shader
  julia = createShader(vs, fs);
  shader(julia);
  noStroke();

  // 'p' is the center point of the julia image
  // julia.setUniform('p', [-0.74364388703, 0.13182590421]);
  julia.setUniform('center', [0.0,0.0]);
  julia.setUniform('control', [-0.75,-0.05]);
  julia.setUniform('scale', 1.0);
  describe('zooming julia set. a colorful, infinitely detailed fractal.');
}

function draw() {

  // project mouse gestures into the complex plane
  if (mouseIsPressed) {
    let start = [pmouseX, pmouseY];
    let end = [mouseX, mouseY];
    let diff = [
      zoom*(end[0]-start[0])/resolution, 
      zoom*(end[1]-start[1])/resolution ];
    
    // left mouse updates the position of the fractal
    if (mouseButton==LEFT) {
      center = [center[0]-diff[0], center[1]+diff[1]];
      julia.setUniform('center', center);
      originDiv.innerText = "origin = ("+center[0]+", "+center[1]+"i)";
    }

    // right mouse button updates the fractal's control point        
    if (mouseButton==RIGHT) {
      control = [control[0]-diff[0], control[1]+diff[1]];
      julia.setUniform('control', control);
      controlDiv.innerText = "control = ("+control[0]+", "+control[1]+"i)";
    }
  }

  // 'r' is the size of the image in julia-space
  // julia.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
  plane(width, height);
}

function mouseWheel(event) {
  if (event.delta<0)
    zoom *= 0.9;
  else if (event.delta>0)
    zoom *= 1.1;
  julia.setUniform('scale', zoom);
  scaleDiv.innerText = "scale = "+zoom;
}

// let fs2 = `
// precision highp float;
// uniform vec2 p;
// uniform float r;
// const int I = 500;
// varying vec2 vTexCoord;

// void main() {
//   vec2 c = p + gl_FragCoord.xy * r, z = c;
//    float n = 0.0;
//    for (int i = I; i > 0; i --) {
//      if(z.x*z.x+z.y*z.y > 4.0) {
//        n = float(i)/float(I);
//        break;
//      }
//      z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;
//    }
//   gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
// }`;