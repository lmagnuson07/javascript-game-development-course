// state design pattern allows objects to change their behaviour based on their current state 
// in each state we can limit what keys player will react to and we can write logic that defines behaviour for each key press separately 
export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    JUMPING_LEFT: 6,
    JUMPING_RIGHT: 7,
    FALLING_LEFT: 8,
    FALLING_RIGHT: 9
}

class State { // super class
    constructor(state){
        this.state = state;
    }
}

// using super here in the constructor will execute all the code in the constructor of the parent class .
// placing methods with the same name in different objects is an example of polymorphism. Allows methods to display different behaviour depending 
// on which class calls it
export class StandingLeft extends State { // sub class
    constructor(player){
        super('STANDING LEFT');
        this.player = player;
    }
    // will do everything that needs to be done when player enters this particular state
    // will run once, when standing left state is entered
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 1;
        this.player.speed = 0;
    }
    // will listen for a predefined set of inputs and swap to a different state when the correct key is pressed
    // will run over and over for each animation frame
    // the state is only set if the input is changed
    handleInput(input){
        if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT); // this passes a number which represeents an index in player.setState
        else if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT);
        else if (input === 'PRESS down') this.player.setState(states.SITTING_LEFT);
        else if (input === 'PRESS up') this.player.setState(states.JUMPING_LEFT);
    }
}
export class StandingRight extends State { 
    constructor(player){
        super('STANDING RIGHT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 0;
        this.player.speed = 0;
    }
    handleInput(input){
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT);
        // how we enter the sitting states
        else if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT);
        else if (input === 'PRESS down') this.player.setState(states.SITTING_RIGHT);
        else if (input === 'PRESS up') this.player.setState(states.JUMPING_RIGHT);
    }
}
export class SittingLeft extends State { // sub class
    constructor(player){
        super('SITTING LEFT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 4;
        this.player.frameY = 9;
        this.player.speed = 0;
    }
    handleInput(input){
        if (input === 'PRESS right') this.player.setState(states.SITTING_RIGHT); 
        else if (input === 'RELEASE down') this.player.setState(states.STANDING_LEFT);
    }
}
export class SittingRight extends State { // sub class
    constructor(player){
        super('SITTING RIGHT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 4;
        this.player.frameY = 8;
        this.player.speed = 0;
    }
    handleInput(input){
        if (input === 'PRESS left') this.player.setState(states.SITTING_LEFT); 
        else if (input === 'RELEASE down') this.player.setState(states.STANDING_RIGHT);
    }
}
export class RunningLeft extends State { // sub class
    constructor(player){
        super('RUNNING LEFT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 8;
        this.player.frameY = 7;
        this.player.speed = -this.player.maxSpeed;
    }
    handleInput(input){
        if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT); 
        else if (input === 'RELEASE left') this.player.setState(states.STANDING_LEFT);
        else if (input === 'PRESS down') this.player.setState(states.SITTING_LEFT);
    }
}
export class RunningRight extends State { // sub class
    constructor(player){
        super('RUNNING RIGHT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 8;
        this.player.frameY = 6;
        this.player.speed = this.player.maxSpeed;
    }
    handleInput(input){
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT); 
        else if (input === 'RELEASE right') this.player.setState(states.STANDING_RIGHT);
        else if (input === 'PRESS down') this.player.setState(states.SITTING_RIGHT);
    }
}
export class JumpingLeft extends State {
    constructor(player){
        super('JUMPING LEFT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 3;
        if (this.player.onGround()) this.player.vy -= 20;
        this.player.speed = -this.player.maxSpeed * 0.5;
    }
    handleInput(input){
        if (input === 'PRESS right') this.player.setState(states.JUMPING_RIGHT);
        else if (this.player.onGround()) this.player.setState(states.STANDING_LEFT);
        else if (this.player.vy > 0) this.player.setState(states.FALLING_LEFT);
    }
}
export class JumpingRight extends State { 
    constructor(player){
        super('JUMPING RIGHT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 2;
        if (this.player.onGround()) this.player.vy -= 20;
        this.player.speed = this.player.maxSpeed * 0.5;
    }
    handleInput(input){
        if (input === 'PRESS left') this.player.setState(states.JUMPING_LEFT);
        else if (this.player.onGround()) this.player.setState(states.STANDING_RIGHT);
        else if (this.player.vy > 0) this.player.setState(states.FALLING_RIGHT);
    }
}
export class FallingLeft extends State { 
    constructor(player){
        super('FALLING LEFT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 5;
    }
    handleInput(input){
        if (input === 'PRESS right') this.player.setState(states.FALLING_RIGHT);
        else if (this.player.onGround()) this.player.setState(states.STANDING_LEFT);
    }
}
export class FallingRight extends State { 
    constructor(player){
        super('FALLING RIGHT');
        this.player = player;
    }
    enter(){
        this.player.maxFrame = 6;
        this.player.frameY = 4;
    }
    handleInput(input){
        if (input === 'PRESS left') this.player.setState(states.FALLING_LEFT);
        else if (this.player.onGround()) this.player.setState(states.STANDING_RIGHT);
    }
}