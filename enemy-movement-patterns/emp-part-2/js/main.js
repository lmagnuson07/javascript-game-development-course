/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numEnemies = 10;
const aEnemies = [];

let gameFrame = 0;

// factory function
class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = '../img/enemy2.png';
        this.speed = Math.random() * 2 + 1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        // resize but preserve aspect ratio
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        // controls the flap speed
        this.flapSpeed = Math.floor(Math.random() * 9 + 6);
        // determines where on the sin wave the sprite starts
        //this.angle = Math.random() * 2;
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.05;
        this.curve = Math.random() * 5;
    }
    update(){
        // this.x += Math.random() * 1.5 - 0.75;
        //this.y += Math.random() * 1.5 - 0.75;
        this.x -= this.speed;
        // this.curve cycles between values (makes the movement larger)
        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;
        // reset check - redraws the sprite after it leave screen
        if (this.x + this.width < 0) this.x = canvas.width;
        // animate sprites
        if (gameFrame % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
            this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < numEnemies; i++) {
    aEnemies.push(new Enemy());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    aEnemies.forEach(enemy => {
        enemy.draw();
        enemy.update();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();