//code for Asteroids game

const FPS = 30; //game's frames per second

let canvas = document.getElementById('asteroid-canvas');
let ctx = canvas.getContext('2d');

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