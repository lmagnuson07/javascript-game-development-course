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
        this.image.src = '../img/enemy1.png';
        // creates a number between 0 and 1. 
        // creates a random number between 0 and 4 (wouldnt ever return 4 or 0 since math.random wont return 0 (seed is a non-zero number) or 1)
        // then subtracts 2, meaning it creates a random number between -2 and 2 (exclusive of both)
        //this.speed = (Math.random() * 4) - 2;
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        // resize but preserve aspect ratio
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        // controls the flap speed
        this.flapSpeed = Math.floor(Math.random() * 9 + 6);
    }
    update(){
        // delta time and request animation frame.
        // this.x += this.speed;
        // this.y += this.speed;
        // in order to get positive and negative numbers, subtract by half f the value
        // controls how much they wiggle around (like how fast)
        this.x += Math.random() * 1.5 - 0.75;
        this.y += Math.random() * 1.5 - 0.75;
        // animate sprites
        if (gameFrame % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        // first 5 args are the cropping of the image, the last 4 are the location and size on screen
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