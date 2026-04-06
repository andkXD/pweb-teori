function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
}

function draw() {
    background(0); 

    // Tekstur Grain Bergerak
    strokeWeight(1);
    for (let i = 0; i < 15000; i++) {
        let x = random(width);
        let y = random(height);
        
        // Warna noise abu-abu transparan
        let alpha = random(10, 50);
        stroke(255, alpha); 
        point(x, y);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}