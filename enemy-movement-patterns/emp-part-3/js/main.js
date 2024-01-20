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
        this.image.src = '../img/enemy3.png';
        this.speed = Math.random() * 2 + 1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        // resize but preserve aspect ratio
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        // controls the flap speed
        this.flapSpeed = Math.floor(Math.random() * 9 + 6);
        // determines where on the sin wave the sprite starts
        this.angle = Math.random() * 500;
        //this.angle = 0;
        // you can also adjust the speed of the sprites by adjusting this value.
        this.angleSpeed = Math.random() * 0.5 + 0.5;
        // determins the radius of the circle the characters are moving in.
        //this.curve = Math.random() * 200 + 50;
    }
    update(){
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
        this.x = canvas.width/2 * Math.cos(this.angle * Math.PI/200) + (canvas.width/2 - this.width/2);
        // we devide by two because the value is the radius of their movement, half circle.
        this.y = canvas.height/2 * Math.sin(this.angle * Math.PI/300) + (canvas.height/2 - this.height/2);
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