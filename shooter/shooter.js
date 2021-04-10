//////////////////////////////////////////////////////////////////
let background = 'rgba(0,0,0,0.3)';

let playerSize = 10;
let playerColor = 'white';

let projectileSize = 5;
let projectileColor = 'white';
let projectileSpeed = 5;

//////////////////////////////////////////////////////////////////


const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    };

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.fillStyle = this.color;
        context.fill();
    }
};

class Projectile {
    constructor(x, y, radius, color, velocity, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: velocity * Math.cos(angle),
            y: velocity * Math.sin(angle)
        };
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: velocity * Math.cos(angle),
            y: velocity * Math.sin(angle)
        };
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const player = new Player(canvas.width / 2, canvas.height / 2, playerSize, playerColor);
const projectiles = [];
const enemies = [];

function spawnEnemies() {
    setInterval(() => {
        const radius = 10 + Math.random() * 20;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const velocity = 2;

        let x;
        let y;
        if (Math.random() > 0.5) {
            x = Math.random() > 0.5 ? 0 : canvas.width;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() > 0.5 ? 0 : canvas.height;
        }
        const angle = Math.atan2(player.y - y, player.x - x);

        enemies.push(new Enemy(x, y, radius, color, velocity, angle));
    }, 1000);
}

window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    projectiles.push(new Projectile(player.x, player.y, projectileSize, projectileColor, projectileSpeed, angle));
});

let animateId;
function animate() {
    animateId = requestAnimationFrame(animate);
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.draw();

    projectiles.forEach((projectile, i) => {
        projectile.update();
        if (projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height) {
            setTimeout(() => { projectiles.splice(i, 1) });
        }
    });

    enemies.forEach((enemy, i) => {
        enemy.update();
        projectiles.forEach((projectile, j) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (distance < enemy.radius + projectile.radius) {
                setTimeout(() => { projectiles.splice(j, 1); });

                if (enemy.radius > 15) {
                    gsap.to(enemy, {
                        radius: enemy.radius-10,
                        duration: 0.1
                    });
                } else {
                    setTimeout(() => { enemies.splice(i, 1); });
                }
            }
        });

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance < player.radius + enemy.radius) {
            cancelAnimationFrame(animateId);
        }
    });
}
spawnEnemies();
animate();