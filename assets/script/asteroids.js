//Asteroids game code

const GAME_LIVES = 3; // starting number of lives
const FPS = 30; // frames per second
const LASER_MAX = 10; // maximun number of lasers on screen at once
const LASER_EXPLODE_DUR = 0.1; // duration of lasers' explosion in seconds
const LASER_DIST = 0.6; // laser distance in fractions
const LASER_SPD = 500; // speed of lasers in pixels per second
const SHIP_SIZE = 25; // ship height in pixels
const ROIDS_SIZE = 90; // starting size of asteroids
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
const TEXT_FADE_TIME = 2.5; // text fade time in seconds
const TEXT_SIZE = 90; // text font size in pixels

/** @type {HTMLCanvasElement} */
let canv = document.getElementById("asteroid-canvas");
let ctx = canv.getContext("2d");

// set up game paramaters
let level, lives, roids, ship, text, textAlpha;
newGame();

// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up the game loop
setInterval(update, 1000 / FPS);

function createAsteroidBelt() {
    roids = [];
    let x, y;
    for (let i = 0; i < ROIDS_NUM + level; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
    }
}

function destroyAsteroid(index) {
    let x = roids[index].x;
    let y = roids[index].y;
    let r = roids[index].r;

    // split asteroids in 2 if necessary
    if (r == Math.ceil(ROIDS_SIZE / 2)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    }

    // destroy the asteroid
    roids.splice(index, 1);

    // new level for no more asteroids
    if (roids.length == 0) {
        level++;
        newLevel();
    }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawShip(x, y, a) {
    ctx.strokeStyle = "magenta";
    ctx.lineWidth = SHIP_SIZE / 5;
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
};

function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
}

function keyDown(/** @type {KeyboardEvent} */ ev) {
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

function keyUp(/** @type {KeyboardEvent} */ ev) {
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

function newGame() {
    lives = GAME_LIVES;
    level = 0;
    ship = newShip();
    newLevel();
}

function newLevel() {
    text = "Level " + (level + 1);
    textAlpha = 1.0;
    createAsteroidBelt();
}

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
        lasers: [],
        rot: 0,
        thrusting: false,
        thrust: { x: 0, y: 0 }
    }
}

function shootLaser() {
    // create the laser object
    if (ship.canShoot && ship.lasers.length < LASER_MAX) {
        ship.lasers.push({ // shoot from the nose of the ship
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPD * Math.cos(ship.a) / FPS,
            yv: - LASER_SPD * Math.sin(ship.a) / FPS,
            dist: 0,
            explodeTime: 0
        });
    }

    // prevent the laser from further shooting
    ship.canShoot = false;
}

function update() {
    let blinkOn = ship.blinkNum % 2 == 0;
    let exploing = ship.explodeTime > 0;
    document.getElementById("asteroid-canvas").style.background = "url('assets/images/galaxy_image.jpg')";
    ctx.clearRect(0, 0, canv.width, canv.height);
    // draw space
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(0, 0, canv.width, canv.height);

    // thrust the ship
    if (ship.thrusting) {
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
    };

    // draw the triangular ship
    if (!exploing) {
        if (blinkOn) {
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
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false)
            ctx.fill();
        } else {
            // draw the explosion
            ctx.fillStyle = "#F70A49"; // red colour
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false)
            ctx.fill();
            ctx.fillStyle = "#F77349"; // orange colour
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false)
            ctx.fill();
            ctx.fillStyle = "#F7CA49"; // yellow colour
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false)
            ctx.fill();
        }
    }

    // draw the game text
    if (textAlpha >= 0) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(247, 243, 15, " + textAlpha + ")"; // 247, 243, 15 = Yellow colour
        ctx.font = "small-caps " + TEXT_SIZE + "px impact";
        ctx.fillText(text, canv.width / 2, canv.height * 0.75);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
    }

    // draw the lives
    for (let i = 0; i < lives; i++) {
        drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.5, SHIP_SIZE, 0.5 * Math.PI);
    }

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
        if (ship.blinkNum == 0) {
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
            ship = newShip();
        }
    }

    // handle edge of screen 
    if (ship.x < 0 - ship.r) {
        ship.x = canv.width + ship.r;
    } else if (ship > canv.width + ship.r) {
        ship.x = 0 - ship.r
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
            ship.lasers[i].x = canv.width
        } else if (ship.lasers[i].x > canv.width) {
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y < 0) {
            ship.lasers[i].y = canv.height
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
            roids[i].x = 0 - roids[i].r
        }
        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canv.height + roids[i].r;
        } else if (roids[i].y > canv.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r
        }

        if (ship.y < 0 - ship.r) {
            ship.y = canv.height + ship.r;
        } else if (ship > canv.height + ship.r) {
            ship.y = 0 - ship.r
        }
    }

}