/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numEnemies = 30;
const aEnemies = [];

let gameFrame = 0;

// factory function
class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = '../img/enemy4.png';
        this.speed = Math.random() * 2 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 212;
        // resize but preserve aspect ratio
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * canvas.width;
        this.newY = Math.random() * canvas.height;
        this.frame = 0;
        // controls the flap speed
        this.flapSpeed = Math.floor(Math.random() * 9 + 6);
        // random interval for resetting the movement of sepereate sprites.
        this.interval = Math.floor(Math.random() * 200 + 50);
    }
    update(){
        // every 30 game frames
        if (gameFrame % this.interval ===0){
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        // d stands for distance here
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        // dividing by a number ensures the current position is always moving to the new position
        // by decramenting the value each animation loop, it redraws it each loop and makes it appear to move. It wont move again until a new newX and newY value
        this.x -= dx/20;
        this.y -= dy/20;
        //this.x -= this.speed;
        //this.y += this.curve * Math.sin(this.angle);
        // Math.sin(this.angle * Math.PI/180) returns + and - decimal values
        // (canvas.width/2 - this.width/2) centers the sprites
        // sin(angle) = opposite/hypotenuse(radius)
        // cos(angle) = adjacent/hypotenuse(radius)
        // sin and cos compliment each other to map a circle path
        // since were creating a circle path, Math.PI/180 splits the paths between sin and cos?
        // the number that PI is divided by controls the speed of the sprites rotation (if they are the same)
        // if they are different numbers, you will get different, unique movement patterns.
        // the larger this number is, the slower the speed.
        // this.x = 0;
        // this.y = 0;
        // reset check - redraws the sprite after it leave screen
        if (this.x + this.width < 0) this.x = canvas.width;
        // animate sprites
        if (gameFrame % this.flapSpeed === 0){
            this.frame > 7 ? this.frame = 0 : this.frame++;
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
        // experiment with adding an event listener to the mouse to make sprites avoid it. Would have to pass values to draw and update, and possibly 
        // make them both/one return values. 
        enemy.draw();
        enemy.update();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();