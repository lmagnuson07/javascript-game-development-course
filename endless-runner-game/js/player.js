import { 
    Sitting, Running,
    Jumping, Falling,
    Rolling, Diving,
    Hit
} from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0; //vertical speed
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [
            new Sitting(this.game), new Running(this.game),
            new Jumping(this.game), new Falling(this.game),
            new Rolling(this.game), new Diving(this.game),
            new Hit(this.game)
        ];
        this.currentState = null;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        // allows player to move left and right in all states. Horizontal movement is handled not with the states.
        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;

        // horizontal boundries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement 
        this.y += this.vy; 
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // vertical boundries
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer -= this.frameInterval;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                // collision for squares.
                enemy.x < this.x + this.width  // top right corner of player, top left of enemy. if the point is to the left of horizontal axis
                && enemy.x + enemy.width > this.x // True most of the time, unless player ends up behind enemy. Than the two horizontal checks swap roles, and the other one is true most of the time. 
                && enemy.y < this.y + this.height // top left of enemy, bottom left on player. If the point is above on vertical axis
                && enemy.y + enemy.height > this.y // True most of the time until player is above enemy. Than the two vertical checks swap roles, and the other one is true most of the time.
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(
                    this.game, 
                    enemy.x + enemy.width * 0.5,
                    enemy.y + enemy.height * 0.5
                ));
                if (
                    this.currentState === this.states[4]
                    || this.currentState === this.states[5]
                ){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                } else {
                    this.setState(6, 0);
                    this.game.score -= 5;
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            } 
        });
    }
}