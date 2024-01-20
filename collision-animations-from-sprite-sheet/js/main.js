const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
// built in javascript method that returns an object providing information about the size of an element and its position relative to the viewport
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition)

class Explosion {
    // x and y are the coordinates where the explosion is to happen (mouse event, overlap)
    constructor(x, y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        // division in javascript is more expensive, so it is better to use multiplication.
        // the multiplier must be the same to maintain the aspect ratio
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = '../img/boom.png';
        this.frame = 0;
        this.timer = 0;
        // the rotate method expects radians, so 360 degrees is roughly 6.2 radians
        this.angle = Math.random() * 6.2;
        this.sound = new Audio();
        this.sound.src = '../audio/iceattack2.wav';
    }
    update(){
        if (this.frame === 0) this.sound.play();
        this.timer++;
        // this condition lengthens the animation
        if (this.timer % 20 === 0){
            this.frame++;            
        }
    }
    draw(){
        // translate is setting the rotation center point (point on the circle) in this case
        // each one is rotated by a different random angle value
        // between the save and restore calls, x:0, y:0 is actually this.x and this.y thanks to translate
        // you rotate things on canvas by saving the current state of canvas to ensure that the following changes affect only one draw call.
        // you than translate the rotation center point on top of the current object we want to rotate.
        // you than rotate the entire canvas context by a random angle value.
        // you draw the image, than restore the canvas context to the original safepoint to ensure that translate and rotate only affects one draw call of one object. 
        // isn't this.x and this.y the top left of the canvas position, not the center point?
        // im assuming the angle value is a point on the circle, hence 6.2 radian. 
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 
        0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

window.addEventListener('click', function(evt) {
    createAnimation(evt);
    //ctx.fillStyle = 'white';
    // the -25 offsets (half of the width/height) the square so that it appears directly on the mouse. 
    //ctx.fillRect(positionX, positionY, 50, 50);
});
// window.addEventListener('mousemove', function(evt) {
//     createAnimation(evt);
//     //ctx.fillStyle = 'white';
//     // the -25 offsets (half of the width/height) the square so that it appears directly on the mouse. 
//     //ctx.fillRect(positionX, positionY, 50, 50);
// });

function createAnimation(evt){
    let positionX = evt.x - canvasPosition.left;
    let positionY = evt.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].frame > 5){
            explosions.splice(i, 1);
            // we decrament i to make sure the next object in the array is correctly updated and animated after removing its neighbour
            i--;
        }
    }
    requestAnimationFrame(animate);
};
animate();