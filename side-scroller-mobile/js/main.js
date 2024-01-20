window.addEventListener('load', function(){
    const fullScreenButton = document.getElementById('fullScreenButton');
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;

    // apply event listeners to keyboard events and hold an array of all currently active keys
    class InputHandler {
        constructor(){
            this.keys = [];
            this.touchY = '';
            this.thouchThreshhold = 200; // ensures the controls are not to sensitive, reacting to the smallest touch
            
            // since we are instantiating input inside the load event listener and the event listener is called from window object, 
            // JavaScript can't find the keys array. By the time that event listener is called, javascript forgot that this keyword refers 
            // to this InputHandler object and its properties. We can use Javascript Bind method, or use es6 arrow function since arrow functions
            // (as we did here) dont bind their own 'this', but inherit the one from their parent scope (lexical scoping)
            window.addEventListener('keydown', (e) => {
                // for javascript arrays, if indexOf is equal to -1, it means the element is not present in the array.
                // ArrowDown is only added to the array if it already does not exist.
                // having the inner parenthesis is important. If you are missing them, when you hold a key down, it will add a bunch of key events to the array, instead of one.
                if ((e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight') && 
                this.keys.indexOf(e.key) === -1
                ){
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) restartGame();
            });
            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight'
                ){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
            // fires once when we start interacting with screen 
            // set something up
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY;
            });
            // touchmove fires over and over as long as we are moving finger over screen
            // calculation such as direction and time of the event
            window.addEventListener('touchmove', e => {
                // as you are moving up, the y vertical value is decreasing. Subtracting from the saved previous value will return a negative number if swipped up.
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.thouchThreshhold && this.keys.indexOf('swipe up') === -1){
                    this.keys.push('swipe up');
                } else if (swipeDistance > this.thouchThreshhold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
            });
            // fires once when we stop interacting with screen
            // do some clean up and discard recent values we no longer need
            window.addEventListener('touchend', e => {
                console.log(e.changedTouches[0].pageY)
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
            });
        }
    }

    // player class will react to the InputHandler keys as they are being pressed (updating and drawing the player).
    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, 
                this.x, this.y, this.width, this.height);
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5 + 20, this.width * 0.3333333, 0, Math.PI * 2);
            context.stroke();
        }
        // context.arc(this.x + this.width * 0.5 - 20, this.y + this.height * 0.5, this.width * 0.3333333, 0, Math.PI * 2);
        update(input, deltaTime, enemies){
            // collision detection
            // we need to offset the dx and dy positions by their radius since they default to a center point of the top left corner (the blue circle)
            // of the rectangular cut out of the sprite sheet.
            // which means collision detection isnt accurate.
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width * 0.5 - 20) - (this.x + this.width * 0.5);
                const dy = (enemy.y + enemy.height * 0.5) - (this.y + this.height * 0.5 + 20);
                const distance = Math.sqrt(dx * dx + dy * dy); // hypontanouse 
                if (distance < enemy.width * 0.3333333 + this.width * 0.3333333){ // the hypotenuse compared to the 2 radii
                    gameOver = true;
                }
            });
            // sprite animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer -= this.frameInterval;
            } else {
                this.frameTimer += deltaTime;
            }
            
            // code from the video.
            // if the array contains ArrowRight -1 means it does not exist
            // if (input.keys.indexOf('ArrowRight') > -1){
            //     this.speed = 5;
            // } else if (input.keys.indexOf('ArrowLeft') > -1) {
            //     this.speed = -5;
            // } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
            //     this.vy -= 32;
            // }else {
            //     this.speed = 0;
            // }
            // this makes sure you can move horizontally and jump at the same time.
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } 
            if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } 
            if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
                this.vy -= 32;
            }
            // if both ArrowRight and ArrowLeft are missing.
            if (input.keys.indexOf('ArrowRight') === -1 &&
                input.keys.indexOf('ArrowLeft') === -1
            ){
                this.speed = 0;
            }
            // stops the character from moving if you have both right and left arrow keys pressed simultaneously
            // if both ArrowRight and ArrowLeft are pressed at the same time.
            if (input.keys.indexOf('ArrowRight') > -1 &&
                input.keys.indexOf('ArrowLeft') > -1
            ){
                this.speed = 0;
            }

            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            // controls the jumping
            this.y += this.vy; // incrament by delta time until it reaches this.vy value maybe? Do something similar for the weight (the way down)
            if (!this.onGround()){
                this.vy += this.weight;
                this.frameY = 1;
                this.maxFrame = 5;
            }
            else {
                this.vy = 0;
                this.frameY = 0;
                this.maxFrame = 8;
            }
            
            // prevents the player from going below the bottom of the screen/ground (which can happen if the jump is too high)
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = backgroundImage;
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update(){
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
        restart(){
            this.x = 0;
        }
    }

    // the sprite sheets are optimized for 20-30 fps
    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = enemyImage;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, 
                this.x, this.y, this.width, this.height);
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width * 0.5 - 20, this.y + this.height * 0.5, this.width * 0.3333333, 0, Math.PI * 2);
            context.stroke();
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer -= this.frameInterval;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    // adds, animates, and removes enemies from the game.
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer -= enemyInterval;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    // displays score, game over message, etc
    function displayStatusText(context){
        context.textAlign = 'left'; // sets the textalign back to left. when the game resets, it sets it to center
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText(`Score: ${score}`, 20, 50);
        context.fillStyle = 'white';
        context.fillText(`Score: ${score}`, 22, 52);
        if (gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width * 0.5, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width * 0.5 + 2, 202);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullScreen(){
        console.log(document.fullScreenElement)
        if (!document.fullScreenElement){
            // requestFullScreen is asynchronous, returns a Promise
            // err is an auto generated message
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            })
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;

    // runs 60 times per second, updating and drawing the game over and over
    // time stamp is a number that incraments for the life of the program
    function animate(timeStamp){ 
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        //background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx)
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});