//Asteroids game code

function init() {
//use requestAnimationFrame it is more consistent than a timer
  window.requestAnimationFrame(draw);
}
const SPACESHIP_SIZE = 20; //spaceship size in px

function draw() {
  
let canvas = document.getElementById('asteroid-canvas');
let ctx = canvas.getContext('2d');

      let spaceship = {
      x: canvas.width / 2, //spaceship appears in center of canvas
      y: canvas.height / 2,
      r: SPACESHIP_SIZE / 2, //size of the spaceship
      a: 90 / 180 * Math.PI, //direction of the spaceship + convert to radians
  } 
      ctx.save();
      
 
    //2. build the spaceship
    ctx.strokeStyle = 'yellow';
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

    ctx.lineTo( //rear right of the spaceship
        spaceship.x - spaceship.r * (Math.cos(spaceship.a) - Math.sin(spaceship.a)),
        spaceship.y + spaceship.r * (Math.sin(spaceship.a) + Math.cos(spaceship.a))
    );
    ctx.fillStyle = 'yellow';
    ctx.closePath();
    ctx.stroke();
 
}

init()