const canvas = document.getElementById('play-area');
const ctx = canvas.getContext('2d');

canvas.height = 600;
canvas.width = 800;

// grid things
const cellSize = 100;
const totalX = canvas.width / cellSize;
const totalY = canvas.height / cellSize - 1;

// input handling
class Mouse {
    constructor() {
        this.x = -1;
        this.y = -1;
        this.gridx = -1;
        this.gridY = -1;
        this.width = 0;
        this.height = 0;
    }

    draw() { //highlights selected square
        if (this.gridY < 0) return; //in menu
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.gridX * cellSize, (this.gridY + 1) * cellSize, cellSize, cellSize);
    }
}
const mouse = new Mouse();

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    mouse.gridX = ~~(mouse.x / cellSize);
    mouse.gridY = ~~(mouse.y / cellSize) - 1;
});

canvas.addEventListener('mouseleave', (event) => {
    mouse.x = -1;
    mouse.y = -1;
    mouse.gridX = -1;
    mouse.gridY = -1;
});

// game board
class Menu {
    constructor() {
        this.moniz = 300;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, cellSize);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Orbitron';
        ctx.fillText('Moniz: ' + this.moniz, 20, 50);
        if (gameOver) {
            ctx.fillStyle = "black";
            ctx.font = '50px Orbitron';
            ctx.fillText('blonk go CHOMP', 150, 330);
        }
    }

    use(amount) {
        if (this.moniz >= amount) {
            this.moniz -= amount;
            return true;
        }
        return false;
    }
}
const menu = new Menu();

class CellThing {
    constructor(gridX, gridY, color) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * cellSize;
        this.y = (gridY + 1) * cellSize;
        this.width = cellSize;
        this.height = cellSize;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// towers
const towers = [...Array(totalX)].map(() => new Array(totalY).fill(0));

class Tower1 extends CellThing {
    constructor(gridX, gridY) {
        super(gridX, gridY, 'green');
        this.hp = 100;
    }
    draw() {
        super.draw();
        ctx.fillStyle = 'gold';
        ctx.font = '20px Orbitron';
        ctx.fillText(Math.floor(this.hp), this.x + 20, this.y + 55);
    }
    takeDamage(dmg) {
        this.hp -= dmg;
        if (this.hp < 0) {
            towers[this.gridX][this.gridY] = 0;
        }
    }
}

function handleTowers() {
    towers.forEach(row => {
        row.forEach(cell => {
            if (cell) cell.draw();
        })
    });
}

// place towers
canvas.addEventListener('click', event => {
    if (mouse.gridY < 0) return; //outside grid
    if (towers[mouse.gridX][mouse.gridY]) return; //grid already filled

    if (menu.use(100))
        towers[mouse.gridX][mouse.gridY] = new Tower1(mouse.gridX, mouse.gridY);
});

// enemies
const enemies = [];

class Enemy1 {
    constructor(gridY) {
        this.gridY = gridY;
        this.x = canvas.width;
        this.y = (gridY + 1) * cellSize;
        this.width = cellSize * 0.5;
        this.height = cellSize;

        this.maxSpeed = Math.random() * 1 + 0.4;
        this.speed = this.maxSpeed;

        this.maxHp = 100;
        this.hp = 100;

        this.attackDmg = 5;
        this.attackCD = 100;
        this.remainingCD = 0;
    }
    update() {
        this.gridX = ~~(this.x / cellSize);
        if (this.gridX < totalX && towers[this.gridX][this.gridY]) {
            this.speed = 0;
            if (this.remainingCD == 0) { //CHOMP
                towers[this.gridX][this.gridY].takeDamage(this.attackDmg);
                this.remainingCD = this.attackCD;
            } else {
                this.remainingCD--;
            }
        } else {
            this.speed = this.maxSpeed;
        }
        this.x -= this.speed;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '20px Orbitron';
        ctx.fillText(Math.floor(this.hp), this.x + 10, this.y + 55);
    }
}

let gameOver = false;

function handleEnemies() {
    enemies.forEach((enemy, i) => {
        enemy.update();
        enemy.draw();
        if (enemy.x <= 0)
            gameOver = true;
    });
    if (!(frame % 100)) {
        let spawnRow = ~~(Math.random() * 5);
        enemies.push(new Enemy1(spawnRow));
    }
}

// useful functions
function collide(lhs, rhs) {
    return !(lhs.x > rhs.x + rhs.width
        || rhs.x > lhs.x + lhs.width
        || lhs.y > rhs.y + rhs.height
        || rhs.y > lhs.y + lhs.height);
}

// draw stuff
let frame = 0;
function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouse.draw();
    handleTowers();
    handleEnemies();
    menu.draw();
    if (!gameOver) requestAnimationFrame(animate);
}
animate();