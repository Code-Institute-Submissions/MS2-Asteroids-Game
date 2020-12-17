//code for Asteroids game

const FPS = 30; //game's frames per second
const SPACESHIP_SIZE = 30; //spaceship size in px

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
    let background = new Image();
    background.src = 'assets/images/nathan_anderson_unsplash_galaxy_image.jpg';

    background.onload = function(){
    ctx.drawImage(background,0, 0, canvas.width, canvas.height);   
}

    //2. build the spaceship

    //3. build functions to move the ship

    //4. build functions to rotate the ship
}