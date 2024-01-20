const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// we create a separate canvas to scan color from that doesnt have any images drawn on it.
// we do this to address security concerns with canvas, such that images that are drawn on a canvas may possible contain viruses if clicked on.
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = '50px Impact'

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
let explosions = [];
let particles = [];

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        // random number between 0.4 and 1 
        // the multiplication makes it a number from 0 to 0.6, than we add 0.4 (0.4 - 1)
        this.sizeModifier = Math.random() * 0.6 + 0.4; 
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        // sets the ravens to start at the right side of canvas, so they can move to the left
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3; // 5 - 8
        this.directionY = Math.random() * 5 - 2.5 // -2.5 to + 2.5
        this.toBeDeleted = false;
        this.image = new Image();
        this.image.src = '../img/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltaTime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.toBeDeleted = true;

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            this.frame > this.maxFrame ? this.frame = 0 : this.frame++;
            this.timeSinceFlap -= this.flapInterval;
            if (this.hasTrail){
                // the loop draws extra particles to make it look better
                for (let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        // gives it a random color
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Explosions {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = '../img/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = '../audio/iceattack2.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.toBeDeleted = false;
    }
    update(deltaTime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame -= this.frameInterval;
            // when all the frames of the explosion sprite sheet have been cycled through
            if (this.frame > 5) this.toBeDeleted = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y - this.size * 0.25, this.size, this.size);
    }
}

class Particle {
    constructor(x, y, size, color){
        this.size = size;
        // the random number makes the trail look more interesting
        this.x = x + this.size * 0.5 + (Math.random() * 50 - 25);
        this.y = y + this.size * 0.3333333 + (Math.random() * 50 - 25);
        this.radius = Math.random() * this.size * 0.1;
        this.maxRadius = Math.random() * 20 + 35;
        this.toBeDeleted = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    // move particles to the right horizontally. 
    update(){
        this.x += this.speedX;
        this.radius += 0.3;
        // we subract from the radius to stop blinking by triggering toBeDeleted sonner since javascript runs over the entire array 
        // before it filters the particles that are to large out.
        if (this.radius > this.maxRadius - 5) this.toBeDeleted = true;
    }
    draw(){
        // set the alpha to 1 (visible) minus the current size of the particle divided by max size
        // if we want to change golbal canvas properties, and you want those properties to affect only a single element wrapping it in save and restore.
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath(); // begins the drawing
        ctx.fillStyle = this.color;
        // draws a circle. The last 2 arguments are the start angle and the end angle (Math.PI is 180, so *2 is 360)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 55, 80);
}
function drawGameOver(){
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'
    ctx.fillText(`GAME OVER, your score is ${score}`, canvas.width * 0.5, canvas.height * 0.5);
    ctx.fillStyle = 'white';
    ctx.fillText(`GAME OVER, your score is ${score}`, canvas.width * 0.5 + 5, canvas.height * 0.5 + 5);
}

window.addEventListener('click', function(evt){
    // getImageData returns an object with data about the location of the event, including an array of colors, which we use here
    const detectPixelColor = collisionCtx.getImageData(evt.x, evt.y, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] &&
            object.randomColors[1] === pc[1] &&
            object.randomColors[2] === pc[2])
        {
            object.toBeDeleted = true;
            score++;
            explosions.push(new Explosions(object.x, object.y, object.width));
            console.log(explosions)
        }
    });
    console.log(detectPixelColor);
});

// we use a timestamp to make sure the timings in the game are consistant and based on time in miliseconds instead of the power of the computer and its ability to
// serve frames at a cetain speed.
// we compare how many miliseconds passed since the last loop, and only when we reach certain amount of time between frames, will we draw the next frame.
// timestamp is a default javascript behaviour when using requestAnimationFrame
// the timestamp parameter is initially undefined because it only gets created on the second loop (when requestAnimationFrame is first called) 
// so we pass 0 to the animate() call
function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    // timestamp is the timestamp value from this loop - lastTime is the saved timestamp from the previous loop
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp; 
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        //timeToNextRaven = 0;
        // youtube comment mentioned how it is better for cross-support to decrament timeToNextRaven instead of setting it back to 0.
        timeToNextRaven -= ravenInterval;
        // sorts the array so that the smaller birds appear behind the larger ones.
        ravens.sort(function(a, b){
            return a.width - b.width;
        });
    };
    // default javascript behaviour for callback here is to pass it an automatic timestamp as an argument.
    // dropping square brackets [] creates an array literal

    // we need to use the spread operator here so that when we crate a partical class, we can just spread the particals into the same array along with the ravens
    // as long as the particals class has an update and draw methods to call, the code will work and you can call all the classes by just expanding more classes
    // in here, spreading them all into a single array and calling all their draw and update methods at once.
    drawScore();
    // the order in the spread array matters when drawing things to canvas
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    // only adds objects with toBeDeleted set to false.
    ravens = ravens.filter(object => !object.toBeDeleted);
    explosions = explosions.filter(object => !object.toBeDeleted);
    particles = particles.filter(object => !object.toBeDeleted);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
};
animate(0);