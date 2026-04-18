// ============================================
// FIBONACCI FOREVER — 2D Canvas, theme-aware
// Port of genuary2026 day 03 by p5aholic
// ============================================

let sequence;
let cnv;
let types;
let tindex;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvas-container');
  frameRate(30);
  colorMode(RGB, 255);
  types = [OPEN, CHORD, PIE];
  tindex = 0;
  sequence = generateFibonacci(15);
  background(0);
}

function draw() {
  const isLight = window.__THEME__ === 'light';

  // Trail fade — exact same as original
  if (isLight) {
    fill(242, 240, 235, 18);
  } else {
    fill(0, 0, 0, 20);
  }
  noStroke();
  rect(0, 0, width, height);

  // dim oscillates — drives both rotation AND spiral size
  let dim = 2 * TWO_PI * sin(frameCount / 300);

  // Center + scale so spiral is large and fills the screen nicely
  let scaleFactor = min(width, height) * 0.013;

  push();
  translate(width / 2, height / 2);
  rotate(dim / 2);
  drawCurl(dim, scaleFactor, isLight);
  pop();

  drawVignette(isLight);
}

function drawCurl(dim, scaleFactor, isLight) {
  noFill();

  for (let i = 0; i < sequence.length; i++) {
    let r = sequence[i] * dim * scaleFactor;

    // Vary alpha slightly per ring for depth
    let a = 45 + (i / sequence.length) * 20;
    if (isLight) {
      stroke(20, 20, 20, a);
    } else {
      stroke(255, 255, 255, a);
    }
    strokeWeight(0.3);

    // Translate along golden-ratio path — exact port of original
    if (i > 2) {
      translate(
        -(sequence[i - 1] * abs(dim) * scaleFactor) / 2 +
          (sequence[i - 3] * abs(dim) * scaleFactor) / 2,
        0
      );
    }

    arc(0, 0, r, r, 0, HALF_PI, types[tindex]);
    rotate(HALF_PI);
  }
}

function drawVignette(isLight) {
  let ctx = drawingContext;
  let grad = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.08,
    width / 2, height / 2, height * 0.9
  );
  if (isLight) {
    grad.addColorStop(0,   'rgba(242,240,235,0)');
    grad.addColorStop(0.55,'rgba(242,240,235,0.05)');
    grad.addColorStop(1,   'rgba(242,240,235,0.88)');
  } else {
    grad.addColorStop(0,   'rgba(0,0,0,0)');
    grad.addColorStop(0.55,'rgba(0,0,0,0.05)');
    grad.addColorStop(1,   'rgba(0,0,0,0.88)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function mousePressed() {
  tindex = (tindex + 1) % types.length;
  // clear on mode switch like original
  if (window.__THEME__ === 'light') {
    background(242, 240, 235);
  } else {
    background(0);
  }
}

function generateFibonacci(n) {
  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
