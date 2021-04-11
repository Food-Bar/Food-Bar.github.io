const gameSpeed = 1;

const canvas = document.getElementById('play-area');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 50;
});

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

const canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousedown', event => {
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.click = true;
});

canvas.addEventListener('mousedown', event => {
    mouse.click = false;
});


const playerLeft = new Image();
playerLeft.src = './img/red_swim_left.png';
const playerRight = new Image();
playerRight.src = './img/red_swim_right.png';
class Player {
    constructor() {
        this.x = 0;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.width = 498;
        this.height = 327;
    };

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.angle = Math.atan2(dy, dx);
        if (mouse.x != this.x) {
            this.x -= dx / 20;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 20;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x > mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.width, this.frameY * this.height, this.width,
                this.height, - 70, - 50, this.width * 0.3, this.height * 0.3);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.width, this.frameY * this.height, this.width,
                this.height, - 70, - 50, this.width * 0.3, this.height * 0.3);
        }
        ctx.restore();
    }
}
let player = new Player();

const bubbleImg = new Image();
bubbleImg.src = './img/bubble0.png';
class Bubble {
    constructor() {
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.touch = false;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radius;
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distSqr = dx * dx + dy * dy;
        const targetSqr = Math.pow(this.radius + player.radius, 2);
        this.touch = (distSqr < targetSqr);
    }
    draw() {
        ctx.drawImage(bubbleImg, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6);
    }
}
let bubbles = [];


function init() {
    player = new Player();
    bubbles = [];
    gameFrame = 0;
    score = 0;
}

const pop = document.createElement('audio');
pop.src = './sfx/Plop.ogg';
const poof = document.createElement('audio');
poof.src = './sfx/poof.wav';

function blowBubble() {
    if (gameFrame % 50 == 0)
        bubbles.push(new Bubble());

    for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update();
        bubbles[i].draw();
        if (bubbles[i].y < -bubbles[i].radius) {
            bubbles.splice(i, 1);
        }
        else if (bubbles[i].touch) {
            Math.random() > 0.3 ? pop.play() : poof.play();
            bubbles.splice(i, 1);
            score++;
        }
    }
}

const upper = new Image();
upper.src = './img/background1.png';
const lower = new Image();
lower.src = './img/background2.png';
const bg = {
    upper1: 0,
    upper2: canvas.width,
    lower1: 0,
    lower2: -canvas.width,
    width: canvas.width,
    height: canvas.height
}
function drawBackground() {
    if ((bg.upper1 -= gameSpeed) < -bg.width) bg.upper1 = bg.width;
    if ((bg.upper2 -= gameSpeed) < -bg.width) bg.upper2 = bg.width;
    if ((bg.lower1 += gameSpeed) > bg.width) bg.lower1 = -bg.width;
    if ((bg.lower2 += gameSpeed) > bg.width) bg.lower2 = -bg.width;

    ctx.drawImage(upper, bg.upper1, 0, bg.width, bg.height);
    ctx.drawImage(upper, bg.upper2, 0, bg.width, bg.height);
    ctx.drawImage(lower, bg.lower1, 0, bg.width, bg.height);
    ctx.drawImage(lower, bg.lower2, 0, bg.width, bg.height);
}


let gameFrame = 0;
let score = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    blowBubble();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}

ctx.font = 'bold 48px serif';
animate();