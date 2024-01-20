import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0; // 3 pixels per frame
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 100;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black'; // in case we need to draw fonts for other modules as well.
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer -= this.enemyInterval;
            } else {
                this.enemyTimer += deltaTime;
            }
            // this.enemies.forEach(enemy => {
            //     enemy.update(deltaTime);
            //     if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            // });
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            })
            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles){
                //this.particles = this.particles.slice(0, this.maxParticles); // only allows the first 50 particles to be in this array.
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(ctx){
            this.background.draw(ctx);
            this.player.draw(ctx);
            // this.enemies.forEach(enemy => {
            //     enemy.draw(ctx);
            // });
            // this.particles.forEach(particle => {
            //     particle.draw(ctx);
            // });
            [...this.enemies, ...this.particles, ...this.collisions, ...this.floatingMessages].forEach(item => {
                item.draw(ctx);
            });

            this.ui.draw(ctx);
        }
        addEnemy(){
            // prevents ground enemies from spawning if character isn't moving
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }
    
    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime; // 1000 / frefresh rate (for me 144)
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});

