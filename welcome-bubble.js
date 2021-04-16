/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('welcome-bubble');
const ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;
canvas.height = canvas.width * 0.2;

// mouse inputs
const mouse = {
    x: null,
    y: null,
    radiusSqr: canvas.width * canvas.height
}

canvas.addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width * 0.2;
    bubbleSize = Math.ceil(canvas.width / 600);
    mouse.radiusSqr = canvas.width * canvas.height;
    ratio = Math.min(canvas.width / xBound, canvas.height / yBound);
    xOffset = (canvas.width - ratio * xBound) >> 1;
    yOffset = (canvas.height - ratio * yBound) >> 1;
    blowBubbles();
});

// adjustable parameters
const text = "Welcome!";
const fontURL = "url(./fonts/Arizonia-Regular.ttf)";

const textX = 5;
const textY = 25;
const xBound = 110;
const yBound = 30;

let bubbleSize = Math.ceil(canvas.width / 600);

const spacing = 1; // eg if set to 3, draw every 3rd pixel
const connectDistSqr = 0; //will not connect if 0

const setupMode = false; //draws original as well as bounding box if true

// auto adjust parameters
let ratio = Math.min(canvas.width / xBound, canvas.height / yBound);
let xOffset = (canvas.width - ratio * xBound) >> 1;
let yOffset = (canvas.height - ratio * yBound) >> 1;



// create initial image
let imgData;
function init() {
    ctx.fillStyle = 'white';
    ctx.font = '30px stupidFont';
    ctx.fillText(text, textX, textY);

    imgData = ctx.getImageData(0, 0, xBound, yBound);

    if (setupMode) {
        ctx.strokeStyle = 'white';
        ctx.strokeRect(0, 0, xBound, yBound);
    }
}

// particle things
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 150 + 50;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, bubbleSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = this.x - this.baseX;
        let dy = this.y - this.baseY;
        this.x -= dx * this.density / 3000;
        this.y -= dy * this.density / 3000;


        dx = mouse.x - this.x;
        dy = mouse.y - this.y;
        let distSqr = dy * dy + dx * dx;
        let force = (mouse.radiusSqr - distSqr) / mouse.radiusSqr;
        if (mouse.x && distSqr < mouse.radiusSqr) {
            this.x -= dx * force / distSqr * this.density * 2;
            this.y -= dy * force / distSqr * this.density * 2;
        }
    }
}

let particles = [];

function blowBubbles() {
    particles = [];
    let posX = 0, posY = 0, i = 0;
    for (i = 0; i < imgData.width * imgData.height; i += spacing) {
        posX = i % imgData.width;
        posY = ~~(i / imgData.width);
        if (imgData.data[i * 4 + 3] > 128) {//get alpha value
            particles.push(new Particle(xOffset + posX * ratio, yOffset + posY * ratio));
        }
    }
    if (setupMode) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(xOffset, yOffset, ratio * xBound, ratio * yBound);
    }
}

// draw things
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => { //draw particles
        particle.update();
        particle.draw();
    });

    if (connectDistSqr) { //connect close points
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                if (dx * dx + dy * dy < connectDistSqr) {
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 1;
                    ctx.beginPath;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    requestAnimationFrame(animate);
}

//load font before starting
const stupidFont = new FontFace('stupidFont', fontURL);
stupidFont.load().then(font => {
    document.fonts.add(font);
    init();
    blowBubbles();
    if (setupMode) console.log(particles.length);
    else animate();

})