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
const float resolution = 256.0;
const vec2 offset = vec2(256.0, 256.0);
const int iterations = 500;

uniform vec2 center;
uniform vec2 control;
uniform float scale;
uniform float escape;

void main() {
  vec2 screen = abs((gl_FragCoord.xy-offset) / resolution);
  
  // vec2 screen = (gl_FragCoord.xy - offset) / resolution;
  vec2 world = (screen*scale) + center;

  vec2 z = world;
  float n = 0.0;
  for (int i = iterations; i > 0; i--) {
    float r2 = z.x * z.x;
    float i2 = z.y * z.y;
    float tr = r2 - i2 + control.x;
    float ti = 2.0*z.x*z.y + control.y;
    z = vec2(tr, ti);
    if (z.x+z.y > escape) {
      n = float(i)/float(iterations);
      break;
    }
  }

  // gl_FragColor = vec4(screen[0], 0, screen[1], 1.);
  // gl_FragColor = vec4(world[0], 0, world[1], 1.);
  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
}`;

let mandel;
function setup() {
  createCanvas(512, 512, WEBGL);

  // create and initialize the shader
  mandel = createShader(vs, fs);
  shader(mandel);
  noStroke();

  // 'p' is the center point of the Mandelbrot image
  // mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
  mandel.setUniform('center', [0.0,0.0]);
  mandel.setUniform('control', [0.5,0.5]);
  mandel.setUniform('scale', 1.0);
  mandel.setUniform('escape', 1e10);
  describe('zooming Mandelbrot set. a colorful, infinitely detailed fractal.');
}

function draw() {
  // 'r' is the size of the image in Mandelbrot-space
  mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
  plane(width, height);
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