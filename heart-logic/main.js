let div = document.getElementById('div');

let full = document.getElementById('full');
let half = document.getElementById('half');
let empty = document.getElementById('empty');

let lives = 10;
let maxLives = 10;
let heartArray = [];

// full hearts complete
for (i = 0; i < maxLives * 0.5; i++){
    heartArray.push(full);
}

if (lives !== maxLives){
    let flag = false;
    heartArray = heartArray.map((heart, i) => {
        if (Math.floor(lives * 0.5) === i){
            flag = true;
            if (lives % 2 !== 0){
                return heart = half;
            } else {
                return heart = empty;
            }
        }
        else {
            if (flag){
                return heart = empty;
            } else {
                return heart = full;
            }
        }
    });
}

heartArray.forEach((heart, i) => {
    let image = new Image();
    image.src = heart.src.slice(heart.src.indexOf('img'));
    div.appendChild(image);
});