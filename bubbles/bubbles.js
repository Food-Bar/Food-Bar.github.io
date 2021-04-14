/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('play-area');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

// mouse inputs
const mouse = {
    x: null,
    y: null,
    radiusSqr: 400 * 400
}

addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

// adjustable parameters
const fontURL = "url(./Arizonia-Regular.ttf)";

const xBound = 250;
const yBound = 90;
const xMult = 5;
const yMult = 5;
const xOffset = 100;
const yOffset = 300;

const bubbleSize = 2;
const spacing = 1; // eg if set to 3, draw every 3rd pixel

const sanCheck = false; //draws original as well as bounding box if true

let imgData;

// create initial image
function init() {
    ctx.fillStyle = 'white';
    ctx.font = '90px font';
    ctx.fillText('Hello!', 10, 70);

    imgData = ctx.getImageData(0, 0, xBound, yBound);

    if (sanCheck) {
        ctx.strokeStyle = 'white';
        ctx.strokeRect(0, 0, xBound, yBound);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(xOffset, yOffset, xMult * xBound, yMult * yBound);
    }
}

// particle things
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = bubbleSize;
        this.density = Math.random() * 150 + 50;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
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


        if (distSqr < mouse.radiusSqr) {
            this.x -= dx * force / distSqr * this.density;
            this.y -= dy * force / distSqr * this.density;
        }
    }
}

let particles = [];

function blowBubbles() {
    let posX = 0, posY = 0, i = 0;
    for (i = 0; i < imgData.width * imgData.height; i += spacing) {
        posX = i % imgData.width;
        posY = ~~(i / imgData.width);
        if (imgData.data[i * 4 + 3] > 128) {//get alpha value
            particles.push(new Particle(xOffset + posX * xMult, yOffset + posY * yMult));
        }
    }
}

// draw things
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

//load font before starting
const stupidFont = new FontFace('font', fontURL);
stupidFont.load().then(font => {
    document.fonts.add(font);

    init();
    blowBubbles();
    if (!sanCheck)
        animate();
})