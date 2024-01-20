import { 
    StandingLeft, StandingRight, 
    SittingLeft, SittingRight, 
    RunningLeft, RunningRight, 
    JumpingLeft, JumpingRight, 
    FallingLeft, FallingRight 
} from "./state.js";

export class Player {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [
            new StandingLeft(this), new StandingRight(this), 
            new SittingLeft(this), new SittingRight(this),
            new RunningLeft(this), new RunningRight(this),
            new JumpingLeft(this), new JumpingRight(this),
            new FallingLeft(this), new FallingRight(this)   
        ]; // passes the player object that we are currently in.
        this.currentState = this.states[1]; // need it set to 1 or you get a bug
        this.image = dogImage;
        this.width = 200;
        this.height = 181.83;
        this.x = this.gameWidth * 0.5 - this.width * 0.5;
        this.y = this.gameHeight - this.height;
        this.vy = 0; // velocity y
        this.weight = 0.5;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.speed = 0;
        this.maxSpeed = 15;
        // helper variables for deltaTime
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
    }
    draw(context, deltaTime){
        if (this.frameTimer > this.frameInterval){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer -= this.frameInterval;
        } else {
            // wait until it accumulates enough milliseconds.
            this.frameTimer += deltaTime;
        }
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
    update(input){
        this.currentState.handleInput(input);
        // horizontal movement/boundries
        this.x += this.speed;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width;

        // vertical movement
        // if vy is at 0 we are at the peak of the jump
        this.y += this.vy;
        if (!this.onGround()){
            this.vy += this.weight;
        } else { // player is on the ground
            this.vy = 0;
        }
        
        // prevents sprite from falling through floor. Might not be needed.
        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    setState(state){
        this.currentState = this.states[state]; // swaps to a specific state.
        this.currentState.enter(); // enters the state
    }
    // utility method
    onGround(){
        return this.y >= this.gameHeight - this.height;
    }
}