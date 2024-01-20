// captures the last key pressed value.
export class InputHandler {
    constructor(){
        this.lastKey = '';
        // arrow functions do not bind their own this, but they inherit the one from their parent scope (lexical scoping)
        window.addEventListener('keydown', (e) => {
            switch(e.key){
                case 'ArrowLeft':
                    this.lastKey = "PRESS left";
                    break;
                case 'ArrowRight':
                    this.lastKey = "PRESS right";
                    break;
                case 'ArrowDown':
                    this.lastKey = "PRESS down";
                    break;
                case 'ArrowUp':
                    this.lastKey = "PRESS up";
                    break;
            }
        });
        window.addEventListener('keyup', (e) => {
            switch(e.key){
                case 'ArrowLeft':
                    this.lastKey = "RELEASE left";
                    break;
                case 'ArrowRight':
                    this.lastKey = "RELEASE right";
                    break;
                case 'ArrowDown':
                    this.lastKey = "RELEASE down";
                    break;
                case 'ArrowUp':
                    this.lastKey = "RELEASE up";
                    break;
            }
        });
    }
}