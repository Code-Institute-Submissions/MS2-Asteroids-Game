let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = [];

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
    canvas = document.getElementById('asteroid-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect = (0, 0, canvas.width, canvas.height);
    document.body.addEventListener('keydown', function(e){
        keys[e.keyCode] = true; 
    });
    document.body.addEventListener('keyup', function(e){
        keys[e.keyCode] = false; 
    });
    Render();
}
//Properties for the spaceship
class Spaceship {
    constructor() {
        //Sometimes I want the spaceship to be visible and sometimes I do not. E.g. at the start of the game 
        this.visible = true;
        //Makes spaceship appear in centre of screen
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotateSpeed = 0.001
    }
}

//Creates a new ship object
let spaceship = new Spaceship();

function Render() {

};