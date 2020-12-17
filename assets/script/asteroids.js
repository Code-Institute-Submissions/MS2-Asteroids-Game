//code for Asteroids game

/** @type {HTMLCanvasElement} */
const FPS = 30; //game's frames per second
const SPACESHIP_SIZE = 10; //spaceship size in px

let canvas = document.getElementById('asteroid-canvas');
let ctx = canvas.getContext('2d');
//spaceship properties
let spaceship = {
    x: canvas.width / 2, //spaceship appears in center of canvas
    y: canvas.height / 2,
    r: SPACESHIP_SIZE / 2, //size of the spaceship
    a: 90 / 180 * Math.PI, //direction of the spaceship + convert to radians
}

//game loop to achieve the required animation
setInterval(update, 1000 / FPS);

function update() {
    //to do list to build game:
    //1. build a galaxy background
    ctx.fillStyle = 'black';
    ctx.fillRect (0, 0, canvas.width, canvas.height);   
};
    //2. build the spaceship
    ctx.strokeStyle = '#6331F6';
    ctx.lineWidth = SPACESHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo( //the spaceship's nose
        spaceship.x + spaceship.r * Math.cos(spaceship.a),
        spaceship.y - spaceship.r * Math.sin(spaceship.a)
    );
    ctx.lineTo( //rear left of the spaceship
        spaceship.x - spaceship.r * (Math.cos(spaceship.a) + Math.sin(spaceship.a)),
        spaceship.y + spaceship.r * (Math.sin(spaceship.a) - Math.cos(spaceship.a))
    );
    ctx.stroke();
    //3. build functions to move the ship

    //4. build functions to rotate the ship