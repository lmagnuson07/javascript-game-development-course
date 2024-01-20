const canvas = document.getElementById('canvas1');
// getContext can only be called on an element that has a handle to a canvas element.
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 5; 
//let gameFrame = 0;

const backgroundLayer1 = new Image();
backgroundLayer1.src = '../img/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '../img/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '../img/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '../img/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '../img/layer-5.png';

// event listener to ensure the page is fully loaded before running the code.
window.addEventListener('load', function() {
    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;
    
    slider.addEventListener('change', (e) => {
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    });
    
    class Layer {
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update(){
            this.speed = gameSpeed * this.speedModifier;
            // if (this.x <= -this.width){
            //     this.x = 0;
            // }
            // Youtube comment that simplifies it. No need for the gameframe variable.
            this.x = Math.floor(this.x - this.speed) % this.width;
            //this.x = Math.floor(this.x - this.speed);
            // his original alternate method that didn't work (makes transition choppy)
            //this.x = gameFrame * this.speed % this.width;
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }
    
    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);
    
    const gameObjects = [layer1, layer2, layer3, layer4, layer5];
    
    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameObjects.forEach(object => {
            object.update();
            object.draw();
        });
        //gameFrame--;
        requestAnimationFrame(animate);
    };
    animate();
});









// let x = 0;
// let x2 = 2400;

// function animate() {
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     ctx.drawImage(backgroundLayer4, x, 0);
//     ctx.drawImage(backgroundLayer4, x2, 0);
//     // the x2, and x variables are small numbers (somewhere around 0) when the check returns true
//     if (x < -2400) x = 2400 + x2 - gameSpeed;
//     else x -= gameSpeed;
//     if (x2 < -2400) x2 = 2400 + x - gameSpeed;
//     else x2 -= gameSpeed;
//     requestAnimationFrame(animate);
// };
// animate();