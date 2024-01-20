let playerState = 'roll';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', (e) => {
    playerState = e.target.value;
});

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//console.log(ctx)

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = '../img/shadow_dog.png';
// 6876 (width) / 12 (number of columns)
const spriteWidth = 575;
// 5230 (height) / 10 (number of rows)
const spriteHeight = 523;

let gameFrame = 0;
const staggerFrames = 15;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7
    },
    {
        name: 'jump',
        frames: 7
    },
    {
        name: 'fall',
        frames: 7
    },
    {
        name: 'run',
        frames: 9
    },
    {
        name: 'dizzy',
        frames: 11
    },
    {
        name: 'sit',
        frames: 5
    },
    {
        name: 'roll',
        frames: 7
    },
    {
        name: 'bite',
        frames: 7
    },
    {
        name: 'ko',
        frames: 12
    },
    {
        name: 'gethit',
        frames: 4
    },
];
animationStates.forEach((state, index) => {
    let frames = {
        loc: []
    }
    for (let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // if the array has 7 items, it will go from 0 to 6 (0,1,2,3,4,5,6) 7 times each number.
    // game frames 5: (0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3 etc...)
    let position = Math.floor(gameFrame / staggerFrames) % (spriteAnimations[playerState].loc.length);
    console.log(position)
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameFrame++; 

    requestAnimationFrame(animate);
}
animate();

//let x = 0;
// function animate(){
//     //ctx.fillRect(100,50,100,100);
//     // can pass 3, 5, or 9 arguments, depending on the amount of control you want over the image you are drawing
//     // the first argument is always the image you want to draw, then x and y cordinates 
//     // if you pass it 5 arguments, it sets the image size (width, height). Will stretch the image
//     // if you pass it 9 arguments, image, the next 4 are the rectangular area you want to cut out of the image.
//     //  the last 4 arguments tell where to draw the cut out image (x and y cordinates, and the width and height of the cut out image).
//     // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
//     // if (gameFrame % staggerFrames == 0){
//     //     if (frameX < 6) frameX ++;
//     //     else frameX = 0;
//     // }    

//     // gameFrame/staggerFrame = ??
//     // 1/5 = 0.2
//     // 2/5 = 0.4
//     // 3/5 = 0.6
//     // 4/5 = 0.8
//     // 5/5 = 1
//     // 0 % 6 = 0
//     // 1 % 6 = 1 when this is one, 1 divided by 6 is zero, so remainder from 0 to 1 is 1
//     // 2 % 6 = 2
//     // 3 % 6 = 3
//     // 4 % 6 = 4
//     // 6 % 6 = 0
//     // 7 % 6 = 1
//     // 8 % 6 = 2
//     // 9 % 6 = 3
//     // 10 % 6 = 4
//     // 11 % 6 = 5
//     // 12 % 6 = 0
//     // 13 % 6 = 1
//     // 14 % 6 = 2
//     // this value increases by 1 everytime gameFrame increases by 5, slowing/staggering the animation 5 times (5 times slower)
//     // ensures the position variable only cycles between 0 and 6
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     let position = Math.floor(gameFrame / staggerFrames) % 6;
//     frameX = spriteWidth * position;
//     ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     gameFrame++;

//     //ctx.drawImage(playerImage, 0, 0, CANVAS_WIDTH ,CANVAS_HEIGHT);
//     // ctx.fillRect(x,50,100,100);
//     // x++;
//     requestAnimationFrame(animate);
// }
// animate();