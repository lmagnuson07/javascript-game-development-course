
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    // its a good practice not to use global variables inside of your classes
    class Game {
        constructor(ctx, width, height){
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }
        update(deltaTime){
            // filtering through an array each game frame can be expensive. Consider adding an interval of some sort (or add it to the condition below)
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.enemyTimer -= this.enemyInterval;
                console.log(this.enemies)
            }
            else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(object => object.update(deltaTime));
        }
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx));
        }
        // the pound symbol means the method is private.
        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
            else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
            else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
            // we sort here so that we only sort when a new enemy is added, and not every game frame.
            // this.enemies.sort(function(a, b){
            //     return a.y - b.y;
            // }); 
        }
    }

    // if we want width and height of my game inside the enemy class because I want my enemies to appear behind the edges of game area.
    // when we create an enemy object, we pass it this keyword, which refers to the game object we are currently inside, meaning that game object will
    // carry all references to its properties with it.
    class Enemy {
        constructor(game){
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime){
            // to factor in time difference between animation frames when moving something around we have to multiply it.
            // That way faster refresh rate with lower delta time will move often but with smaller steps.
            // Slower refresh rate with higher delta time will move less often but with larger steps to compensate.
            // its being called every frame since it is ouside the condition for adding enemies. 
            this.x -= this.vx * deltaTime;
            // remove enemies
            if (this.x < 0 - this.width) this.markedForDeletion = true;
            if (this.frameTimer > this.frameInterval){
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer -= this.frameInterval;
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {
        // we dont have to declare a constructor on an extended class. It will automatically use the constructor of the base class.
        // we are overriding properties here, so we use both.
        constructor(game){
            // You have to first call super and run the parent construtor before you declare any additional properties. 
            super(game);
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = this.game.width;
            this.y = this.game.height - this.height;
            this.image = worm; // worm is the images id (html properties with an id become global variables in javascript)
            this.vx = Math.random() * 0.1 + 0.1; // 0.1 - 0.2
        }
    }

    class Ghost extends Enemy {
        // we dont have to declare a constructor on an extended class. It will automatically use the constructor of the base class.
        // we are overriding properties here, so we use both.
        constructor(game){
            // You have to first call super and run the parent construtor before you declare any additional properties. 
            super(game);
            this.spriteWidth = 261
            this.spriteHeight = 209;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = this.game.width;
            // ensures ghosts only take up the top 60% of the screen
            this.y = Math.random() * this.game.height * 0.6;
            this.image = ghost;
            this.vx = Math.random() * 0.2 + 0.1; // 0.1 - 0.2
            this.angle = 0;
            this.curve = Math.random() * 3;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }
        draw(ctx){
            // super represents the parent class (enemy)
            // extends the draw method of enemy to make the ghosts transparent 
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore();
        }
    }

    class Spider extends Enemy {
        // we dont have to declare a constructor on an extended class. It will automatically use the constructor of the base class.
        // we are overriding properties here, so we use both.
        constructor(game){
            // You have to first call super and run the parent construtor before you declare any additional properties. 
            super(game);
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;
            this.image = spider; // worm is the images id (html properties with an id become global variables in javascript)
            // we only want vertical movement, so we set vx to 0
            this.vx = 0; // 0.1 - 0.2
            this.vy = Math.random() * 0.1 + 0.1;
            this.maxLength = Math.random() * this.game.height;
        }
        update(deltaTime){
            super.update(deltaTime);
            if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
            this.y += this.vy * deltaTime;
            // makes vy a negative number;
            if (this.y > this.maxLength) this.vy *= -1;
        }
        draw(ctx){
            // draws a line/ the web
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.5, 0);
            ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
            ctx.stroke();
            super.draw(ctx);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    // timeStamp is automatically generated by JavaScript
    // the value of 1 will only be used once because it will be reassigned on the second loop
    let lastTime = 1;
    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw();
        requestAnimationFrame(animate);
    }
    // on the first loop, deltaTime is NaN because animate has no argument, so we pass it 0 to avoid problems.
    animate(0);
});