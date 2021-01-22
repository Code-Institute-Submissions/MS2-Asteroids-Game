/**=================================================================== */
/** A S T E R O I D   G A M E   C O D E   S T A R T */
/**=================================================================== */

/**=================================================================== */
/** Variables */
/**=================================================================== */
// explanation on line 85 (*window.devicePixelRatio)
const GAME_LIVES = 3; // starting number of lives
const FPS = 30; // frames per second
const LASER_MAX = 10; // maximun number of lasers on screen at once
const LASER_EXPLODE_DUR = 0.1; // duration of lasers' explosion in seconds
const LASER_DIST = 0.6; // laser distance in fractions
const LASER_SPD = 500; // speed of lasers in pixels per second
const SHIP_SIZE = 25 * window.devicePixelRatio; // ship height in pixels
const ROIDS_PTS_LGE = 20; // points scored for large asteroid
const ROIDS_PTS_MED = 50; // points scored for medium asteroid
const ROIDS_PTS_SML = 100; // points scored for small asteroid
const ROIDS_SIZE = 125 * window.devicePixelRatio; // starting size of asteroids
const ROIDS_SPD = 50; // starting speed of asteroids
const ROIDS_VERT = 10; // average number of vertices on asteroids
const ROIDS_NUM = 3; // starting number of asteroids
const SHIP_EXPLODE_DUR = 0.3; // duration of ship's explosion 
const SHIP_BLINK_DUR = 0.3; // duration of ship's blinking during invisibility 
const SHIP_INV_DUR = 3.0; // duration of the ship's invisibility in seconds
const TURN_SPEED = 360; // turn speed in degrees per second
const SHIP_THRUST = 5; // ship acceleration speed
const SHOW_BOUNDING = false; // show or hide collision bounding
const FRICTION = 0.7; // friction control for ship (0 = no friction 1 = lots of friction)
const SOUND_ON = true; // game starts off with the sound playing
const TEXT_FADE_TIME = 2.5; // text fade time in seconds
const TEXT_SIZE = 90 * window.devicePixelRatio; // text font size in pixels
const SCORE_SIZE = 150 * window.devicePixelRatio; // score size in pixels
const SAVE_KEY_SCORE = "highscore"; // save key for local storage of highscores

let SOUND_MUTE = false; // mutes the sounds and FX
let GAME_PAUSED = false; // pauses the game

let PLAY_GAME = false; //Are we playing the game? not yet
/**=================================================================== */


/**=================================================================== */
/** The below code is used to: Restart, Pause and Mute Sounds */
/**=================================================================== */

//play the game 
document.getElementById('playgame').addEventListener('click', function(evt) {
    //now we are playing the game
    PLAY_GAME = true;
    GAME_PAUSED = false;
    //hides the how-to game instructions
    document.getElementById('how-to').style.display = "none";
});

// pause the game
document.getElementById('pausegame').addEventListener('click', function(evt) {
    if (evt.target.innerHTML === 'Pause') {
        GAME_PAUSED = true; // pauses the gameplay
        PLAY_GAME = false; // resumes the game from its frozen state
        evt.target.innerHTML = 'Resume';
    } else {
        GAME_PAUSED = false;
        PLAY_GAME = true;
        evt.target.innerHTML = 'Pause';
    }
});

// mute sound
document.getElementById('mute').addEventListener('click', function(evt) {
    if (evt.target.innerHTML === 'Mute') {
        SOUND_MUTE = true;
        evt.target.innerHTML = 'Unmute'; // unmutes the sound FX and bong-bong music
    } else {
        SOUND_MUTE = false;
        evt.target.innerHTML = 'Mute'; // mutes the sound FX and bong-bong music
    }
});
/**=================================================================== */

/* Fix for stretching/squeezing 
it is not true responsive but the canvas will adapt to what ever device
the game is loaded on. For example, on mobile devices, switching between landscape and portrait may cause a bit of a distortiom. A browser refresh resolves this.
*/

/** @type {HTMLCanvasElement} */
//get canvas
let canv = document.getElementById("asteroid-canvas");
//get context
let ctx = canv.getContext("2d");

/**=================================================================== */
/** The below code is used to: deal with the difference between rendering on a standard display versus a HiDPI or Retina display, which use more screen pixels to draw the same objects, resulting in a sharper image.  */
/**=================================================================== */
//get DPI
let dpi = window.devicePixelRatio;
//https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio

function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canv).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(canv).getPropertyValue("width").slice(0, -2);

    // set/scale the canvas
    canv.setAttribute('height', style_height * dpi);
    canv.setAttribute('width', style_width * dpi);
}
fix_dpi();
/**=================================================================== */

/**=================================================================== */
/** The below code is used to: set up the sounds */
/**=================================================================== */
// in-game sound fx
let fxLaser = new Sound("assets/sounds/laser.mp3", 7, 0.5);
let fxExplode = new Sound("assets/sounds/explode.m4a");
let fxHit = new Sound("assets/sounds/hit.m4a", 5);
let fxThrust = new Sound("assets/sounds/thrust.m4a");

// set up the in-game music
let music = new Music("assets/sounds/music-high.m4a", "assets/sounds/music-low.m4a");
let roidsLeft, roidsTotal;
/**=================================================================== */

// set up game paramaters
let level, lives, roids, score, scoreHigh, ship, text, textAlpha;
newGame();

// set up event handlers
document.addEventListener("keydown", keyDown);

// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

/**=================================================================== */
/** The below code is used to: Set up the game loop
/**=================================================================== */
setInterval(update, 1000 / FPS);

//this function creates a new asteroid belt with each level. With each level you beat the amount of asteroids increases. Their location on the canvas is random by using the function Math.random().
function createAsteroidBelt() {
    roids = [];
    roidsTotal = (ROIDS_NUM + level) * 7;
    roidsLeft = roidsTotal;
    let x, y;
    for (let i = 0; i < ROIDS_NUM + level; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
    }
}

// destroy asteroids. Takes in the x and y value of the asteroids and r takes in the radius.
function destroyAsteroid(index) {
    let x = roids[index].x;
    let y = roids[index].y;
    let r = roids[index].r;

    // split asteroids in 2 if necessary
    if (r == Math.ceil(ROIDS_SIZE / 2)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        score += ROIDS_PTS_LGE;
    } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        score += ROIDS_PTS_MED;
    } else {
        score += ROIDS_PTS_SML;
    }

    // check high score 
    if (score > scoreHigh) {
        scoreHigh = score;
        localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
    }

    // destroy the asteroid
    roids.splice(index, 1);
    if (SOUND_MUTE == false) {
        fxHit.play();
    }

    // remaining asteroids to determine music tempo
    roidsLeft--;
    music.setAsteroidRatio(roidsLeft == 0 ? 1 : roidsLeft / roidsTotal);

    // new level for no more asteroids
    if (roids.length == 0) {
        level++;
        newLevel();
    }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**=================================================================== */
/** The below function is used to create the triangular ship */
/**=================================================================== */
function drawShip(x, y, a, colour = "magenta") {
    ctx.strokeStyle = colour;
    ctx.lineWidth = (SHIP_SIZE) / 5;
    ctx.beginPath();
    ctx.moveTo( // nose of the ship
        x + 4 / 3 * ship.r * Math.cos(a),
        y - 4 / 3 * ship.r * Math.sin(a)
    );
    ctx.lineTo( // rear left
        x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo( // rear right
        x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
}

/**=================================================================== */
/** The function explodeShip sets the explode time and the duration of 
the actual explosion in frames per second.
*/
/**=================================================================== */
function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
    if (SOUND_MUTE == false) {
        fxExplode.play();
    }
}

//Writes "Game Over" to the screen when all 3 lives are lost
function gameOver() {
    ship.dead = true;
    text = "Game Over!";
    textAlpha = 1.0;
}

/**=================================================================== */
/** The function for the key down events */
/**=================================================================== */
function keyDown( /** @type {KeyboardEvent} */ ev) {

    if (ship.dead) {
        return;
    }

    //There's a tiny bit of vertical scrolling which when the spacebar was being pressed to shoot, the page would jump, the below code prevents window scrolling
    ev.preventDefault();

    switch (ev.keyCode) {
        case 32: // spacebar (shoots the laser)
            shootLaser();
            break;
        case 37: // left arrow (rotate ship left)
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 38: // up arrow (thrust the ship forward)
            ship.thrusting = true;
            break;
        case 39: // right arrow (rotate ship right)
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            break;
    }
}

/**=================================================================== */
/** The function for the key up events */
/**=================================================================== */
function keyUp( /** @type {KeyboardEvent} */ ev) {

    if (ship.dead) {
        return;
    }

    //prevent window scrolling
    ev.preventDefault();

    switch (ev.keyCode) {
        case 32: // spacebar (allow shooting again)
            ship.canShoot = true;
            break;
        case 37: // left arrow (stop rotating left)
            ship.rot = 0;
            break;
        case 38: // up arrow (stop thrusting)
            ship.thrusting = false;
            break;
        case 39: // right arrow (stop rotating right)
            ship.rot = 0;
            break;
    }
}

/**=================================================================== */
/** The event listeners for the Fake Arrow Keys used to control the game with mobile devices.
/**=================================================================== */
let fakekeys = document.querySelectorAll('.key');
for (let i = 0; i < fakekeys.length; i++) {

    fakekeys[i].addEventListener('touchstart', function(ev) {
        let thepressedkey = ev.target.getAttribute('data-key');

        switch (thepressedkey) {
            case "shoot": // spacebar (shoots the laser)
                shootLaser();
                break;
            case "left": // left arrow (rotate ship left)
                ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
                break;
            case "up": // up arrow (thrust the ship forward)
                ship.thrusting = true;
                break;
            case "right": // right arrow (rotate ship right)
                ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
                break;
        }
    });

    fakekeys[i].addEventListener('touchend', function(ev) {
        let thepressedkey = ev.target.getAttribute('data-key');

        switch (thepressedkey) {
            case "shoot": // spacebar (allow shooting again)
                ship.canShoot = true;
                break;
            case "left": // left arrow (stop rotating left)
                ship.rot = 0;
                break;
            case "up": // up arrow (stop thrusting)
                ship.thrusting = false;
                break;
            case "right": // right arrow (stop rotating right)
                ship.rot = 0;
                break;
        }
    });
}
/**=================================================================== */

/**=================================================================== */
/** The function newAsteroid increases the amount of asteroids with each level that you get past. It also makes the asteroids appear in random locations with a gradual increase in the speed at which the asteroids move. */
/**=================================================================== */
function newAsteroid(x, y, r) {
    let lvlMult = 1 + 0.1 * level;
    let roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2, // radians
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2)
    };
    return roid;
}

/**=================================================================== */
/** The function for newGame includes Game Lives, the score, level and ship. Each new game starts off with 3 lives, score of zero and on level 1. Within this function we also store the highscore in the local storage on the web browser */
/**=================================================================== */
function newGame() {
    lives = GAME_LIVES;
    score = 0;
    level = 0;
    ship = newShip();
    PLAY_GAME = false;

    // retreive the highscore from local storage 
    let scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
    if (scoreStr == null) {
        scoreHigh = 0;
    } else {
        scoreHigh = parseInt(scoreStr);
    }
    //shows the how-to game instructions
    document.getElementById('how-to').style.display = "block";
    newLevel();
}

//Creates a new level with a new asteroid belt when all asteroids on screen have been destroyed
function newLevel() {
    text = "Level " + (level + 1);
    textAlpha = 1.0;
    createAsteroidBelt();
}

//When a life is lost or at the start of a game the function newShip puts a new ship directly in the centre of the screen. It also blinks for a few seconds giving the ship some invincibility. This gives the user a bit of breathing room incase an asteroid appears on top of the ship, without the brief invincibilty period, with a restart, should an asteroid appear on top of the ship, a life would instantly be lost.
function newShip() {
    return {
        x: canv.width / 2,
        y: canv.height / 2,
        r: SHIP_SIZE / 2,
        a: 90 / 180 * Math.PI, // convert to radians
        explodeTime: 0,
        blinkTime: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
        blinkNum: Math.ceil(SHIP_BLINK_DUR * FPS),
        canShoot: true,
        dead: false,
        lasers: [],
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    };
}

// The shootLaser function defines the distance and length of the lasers. It also controls where we want the lasers to shoot from. 
function shootLaser() {
    // create the laser object
    if (ship.canShoot && ship.lasers.length < LASER_MAX) {
        ship.lasers.push({ // shoot from the nose of the ship
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPD * Math.cos(ship.a) / FPS,
            yv: -LASER_SPD * Math.sin(ship.a) / FPS,
            dist: 0,
            explodeTime: 0
        });
        if (SOUND_MUTE == false && PLAY_GAME == true) {
            fxLaser.play();
        }
    }

    // prevent the laser from further shooting
    ship.canShoot = false;
}

function Music(srcLow, srcHigh) {
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0; // seconds per beat
    this.beatTime = 0; // frames until next beat


    this.play = function() {

        if (this.low) {
            this.soundLow.play();
        } else {
            this.soundHigh.play();
        }
        this.low = !this.low;

    };
    this.setAsteroidRatio = function(ratio) {
        this.tempo = 1.0 - 0.75 * (1.0 - ratio);
    };

    this.tick = function() {
        if (this.beatTime == 0) {
            // we do not want the bing/bong sound before we play the game
            if (SOUND_MUTE == false && PLAY_GAME == true) {
                this.play();
            }
            this.beatTime = Math.ceil(this.tempo * FPS);
        } else {
            this.beatTime--;
        }
    };
}

function Sound(src, maxStream = 1, vol = 1.0) {
    this.streamNum = 0;
    this.streams = [];
    for (let i = 0; i < maxStream; i++) {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }
    this.play = function() {
        if (SOUND_ON) {
            this.streamNum = (this.streamNum + 1) % maxStream;
            this.streams[this.streamNum].play();
        }
    };
    this.stop = function() {
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    };
}

function update() {

    if (GAME_PAUSED == false) {

        //every time the game is updatet we update the dpi/pixel density of screen the 
        //game is running on and scale the canvas acording 
        fix_dpi();

        let blinkOn = ship.blinkNum % 2 == 0;
        let exploing = ship.explodeTime > 0;

        // music tick
        music.tick();

        // space background
        let spacebg = document.getElementById("asteroid-canvas");
        spacebg.style.background = "url('assets/images/galaxy_image.jpg')";
        spacebg.style.backgroundSize = "cover";

        ctx.clearRect(0, 0, canv.width, canv.height);

        // thrust the ship
        if (ship.thrusting && !ship.dead) {

            if (SOUND_MUTE == false) {
                fxThrust.play();
            }
            ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
            ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;

            // draw the thrusters
            if (!exploing && blinkOn) {
                ctx.fillStyle = "#F6D838"; // yellow colour
                ctx.strokeStyle = "cyan";
                ctx.lineWidth = SHIP_SIZE / 15;
                ctx.beginPath();
                ctx.moveTo( // rear left
                    ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                    ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
                );
                ctx.lineTo( // rear centre behind the ship
                    ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
                    ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
                );
                ctx.lineTo( // rear right
                    ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                    ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
                );
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        } else { // otherwise they're not pushing the thrust button
            ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
            ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
            fxThrust.stop();
        }

        // draw the asteroids
        ctx.strokeStyle = "#15F00A"; // neon green
        ctx.lineWidth = SHIP_SIZE / 2;
        let x, y, r, a, vert;
        for (let i = 0; i < roids.length; i++) {

            // asteroids properties
            x = roids[i].x;
            y = roids[i].y;
            r = roids[i].r;
            a = roids[i].a;
            vert = roids[i].vert;

            // draw a path
            ctx.beginPath();
            ctx.moveTo(
                x + r * Math.cos(a),
                y + r * Math.sin(a)
            );

            // draw the polygon
            for (let j = 0; j < vert; j++) {
                ctx.lineTo(
                    x + r * Math.cos(a + j * Math.PI * 2 / vert),
                    y + r * Math.sin(a + j * Math.PI * 2 / vert)
                );
            }
            ctx.closePath();
            ctx.stroke();

            if (SHOW_BOUNDING) {
                ctx.strokeStyle = "cyan";
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                ctx.stroke();
            }
        }

        // draw the triangular ship
        if (!exploing) {
            if (blinkOn && !ship.dead) {
                drawShip(ship.x, ship.y, ship.a);
            }

            // handle blinking
            if (ship.blinkNum > 0) {

                // reduce the blink time
                ship.blinkTime--;

                // reduce the blink num
                if (ship.blinkTime == 0) {
                    ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                    ship.blinkNum--;
                }
            }

        } else {
            // draw the explosion 
            ctx.fillStyle = "#F61638"; // red colour
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "#F68738"; // orange colour
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 1.2, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "#F6D438"; // yellow colour
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 0.9, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 0.6, 0, Math.PI * 2, false);
            ctx.fill();
        }

        if (SHOW_BOUNDING) {
            ctx.strokeStyle = "cyan";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
            ctx.stroke();
        }

        // draw the lasers
        for (let i = 0; i < ship.lasers.length; i++) {
            if (ship.lasers[i].explodeTime == 0) {
                ctx.fillStyle = "#F6FF38"; // yellow colour
                ctx.beginPath();
                ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
                ctx.fill();
            } else {
                // draw the explosion
                ctx.fillStyle = "#F70A49"; // red colour
                ctx.beginPath();
                ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = "#F77349"; // orange colour
                ctx.beginPath();
                ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = "#F7CA49"; // yellow colour
                ctx.beginPath();
                ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }

        // draw the game over text
        if (textAlpha >= 0) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(247, 243, 15, " + textAlpha + ")"; // 247, 243, 15 = Yellow colour
            ctx.font = "small-caps " + TEXT_SIZE + "px Impact, Arial, Helvetica, sans-serif";
            ctx.fillText(text, canv.width / 2, canv.height * 0.75);
            textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
        } else if (ship.dead) {
            newGame();
        }

        // draw the lives
        let lifeColour;
        for (let i = 0; i < lives; i++) {
            lifeColour = exploing && i == lives - 1 ? "cyan" : "yellow";
            drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.5, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
        }

        // draw the score
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = SCORE_SIZE + "% Arial, Helvetica, sans-serif";
        ctx.fillText("Score: " + score, canv.width - SHIP_SIZE / 2, SHIP_SIZE);

        // draw the high score
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = SCORE_SIZE + "% Arial, Helvetica, sans-serif";
        ctx.fillText("High: " + scoreHigh, canv.width / 2, SHIP_SIZE);

        // detect laser hits asteroid
        let ax, ay, ar, lx, ly; // ax = asteroids x, ay = asteroids y, lx = lasers x, ly = lasers y

        for (let i = roids.length - 1; i >= 0; i--) {

            // asteroid properties
            ax = roids[i].x;
            ay = roids[i].y;
            ar = roids[i].r;

            // loop over the lasers
            for (let j = ship.lasers.length - 1; j >= 0; j--) {

                // laser properties
                lx = ship.lasers[j].x;
                ly = ship.lasers[j].y;

                // detect hits
                if (ship.lasers[j].explodeTime == 0 && distanceBetweenPoints(ax, ay, lx, ly) < ar) {

                    // destroy asteroid and activate laser explosion
                    destroyAsteroid(i);
                    ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);

                    break;
                }
            }
        }

        // check for asteroids collisions
        if (!exploing) {
            if (ship.blinkNum == 0 && !ship.dead) {
                for (let i = 0; i < roids.length; i++) {
                    if (distanceBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                        explodeShip();
                        destroyAsteroid(i);

                        break;
                    }
                }
            }

            // rotate the ship
            ship.a += ship.rot;

            // move the ship
            ship.x += ship.thrust.x;
            ship.y += ship.thrust.y;
        } else {
            ship.explodeTime--;

            if (ship.explodeTime == 0) {
                lives--;
                if (lives == 0) {
                    gameOver();
                } else {
                    ship = newShip();
                }
            }
        }

        // handle edge of screen
        if (ship.x < 0 - ship.r) {
            ship.x = canv.width + ship.r;
        } else if (ship.x > canv.width + ship.r) {
            ship.x = 0 - ship.r;
        }
        if (ship.y < 0 - ship.r) {
            ship.y = canv.height + ship.r;
        } else if (ship.y > canv.height + ship.r) {
            ship.y = 0 - ship.r;
        }

        // move the lasers
        for (let i = ship.lasers.length - 1; i >= 0; i--) {

            //check distance travelled
            if (ship.lasers[i].dist > LASER_DIST * canv.width) {
                ship.lasers.splice(i, 1);
                continue;
            }

            // handle the explosion
            if (ship.lasers[i].explodeTime > 0) {
                ship.lasers[i].explodeTime--;

                // destroy the laser after the duration is up
                if (ship.lasers[i].explodeTime == 0) {
                    ship.lasers.splice(i, 1);
                    continue; // stops from going over the remaining code
                }

            } else {
                // move the lasers
                ship.lasers[i].x += ship.lasers[i].xv;
                ship.lasers[i].y += ship.lasers[i].yv;

                // calculate distance lasers travel
                ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
            }

            // handle edge of screen for lasers
            if (ship.lasers[i].x < 0) {
                ship.lasers[i].x = canv.width;
            } else if (ship.lasers[i].x > canv.width) {
                ship.lasers[i].x = 0;
            }
            if (ship.lasers[i].y < 0) {
                ship.lasers[i].y = canv.height;
            } else if (ship.lasers[i].y > canv.height) {
                ship.lasers[i].y = 0;
            }
        }

        // move the asteroids
        for (let i = 0; i < roids.length; i++) {
            roids[i].x += roids[i].xv;
            roids[i].y += roids[i].yv;

            // handle edge of screen
            if (roids[i].x < 0 - roids[i].r) {
                roids[i].x = canv.width + roids[i].r;
            } else if (roids[i].x > canv.width + roids[i].r) {
                roids[i].x = 0 - roids[i].r;
            }
            if (roids[i].y < 0 - roids[i].r) {
                roids[i].y = canv.height + roids[i].r;
            } else if (roids[i].y > canv.height + roids[i].r) {
                roids[i].y = 0 - roids[i].r;
            }

            if (ship.y < 0 - ship.r) {
                ship.y = canv.height + ship.r;
            } else if (ship > canv.height + ship.r) {
                ship.y = 0 - ship.r;
            }
        }
    }
    /*we need to draw the game to the canvas and then pause it!
    so the game do not start before the play button is pressed
    */
    if (PLAY_GAME == false) {
        GAME_PAUSED = true;
    }
}

/**=================================================================== */
/** A S T E R O I D   G A M E   C O D E   E N D */
/**=================================================================== */