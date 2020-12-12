![Asteroids promotional image](assets/readme_imgs/asteroids.jpg)

# Asteroids!

## An Interactive Frontend Project by Michael McCann

For my second milestone project, I have deciced to put my JavaScript knowledge to the test and create my version of my version of the classic 1979 classic Atari game, Asteroids. Built using HTML5, CSS3 and JavaScript. I aim to make the user experience more enjoyable for the gamer than its Daddy by giving the game an overhaul on the design.

# Contents

- [A Bit Of Info On The Game](#a-bit-of-info-on-the-game)

- [The Strategy Plane](#the-strategy-plane)
- [The Scope Plane](#the-scope-plane)
- [The Structure Plane](#the-structure-plane)
- [The Skeleton Plane](#the-skeleton-plane)
- [Wireframes](#wireframes)
- [User Stories](#user-stories)
- [User Testing](#user-testing)

# A Bit Of Info On The Game 

[^ Back To Contents ^](#contents)

Asteroids is a space-themed multidirectional shooter arcade game designed by Lyle Rains, Ed Logg, and Dominic Walsh and released in November 1979 by Atari, Inc. The player controls a single spaceship in an asteroid field which is periodically traversed by flying saucers. The object of the game is to shoot and destroy the asteroids and saucers, while not colliding with either, or being hit by the saucers' counter-fire. The game becomes harder as the number of asteroids increases.

Asteroids was one of the first major hits of the golden age of arcade games; the game sold over 70,000 arcade cabinets and proved both popular with players and influential with developers. In the 1980s it was ported to Atari's home systems, and the Atari VCS version sold over three million copies. The game was widely imitated, and it directly influenced Defender, Gravitar, and many other video games.

Asteroids was conceived during a meeting between Logg and Rains, who decided to use hardware developed by Howard Delman previously used for Lunar Lander. Asteroids was based on an unfinished game titled Cosmos; its physics model, control scheme, and gameplay elements were derived from Spacewar!, Computer Space, and Space Invaders and refined through trial and error. The game is rendered on a vector display in a two-dimensional view that wraps around both screen axes.

The above text is taken from [Wikipedia](https://en.wikipedia.org/wiki/Asteroids_(video_game)).

___

# The Strategy Plane

[^ Back To Contents ^](#contents)

What I'm aiming to achieve by building a game (my first!) is that it will give me a better insight into my currant knowledge of JavaScript. And what better way than to dive straight in and tackle this classic game, Asteroids!

The use of the arrow keys to move and spacebar to fire will mean that it'll make the game a "pick-up and play" type of game, which makes it suitale for ages 6 and up. So it is ideally for anyone who has an interest in gaming with this game primarily focusing on the retro-gamer who would be very familiar siting in front of a TV (that weighed as much as a washing machine) playing it on their old Atari. Hopefully it will make people feel nostalgic about the hours they played and maybe the fights they had with their siblings over it too! The game will be playable by one person. 

The game is for: 

* Me, the developer to expand my knowledge of JavaScript.
* The retro gamer, to rekindle their love of Asteroids.

# The Scope Plane

[^ Back To Contents ^](#contents)

The features I plan to include in my design are:

* A spaceship

* Asteroids
* Pressing the spacebar to shoot
* Arrow keys to maneuver, up arrow to thrust
* When asteroids are shot, they'll break apart into smaller asteroids
* Scoring system
* High score is saved
* Sound FX and music
* Levels
* Lives 

# The Structure Plane

[^ Back To Contents ^](#contents)

The information or in this case the game will be structured with an ease-of-use interface with all menu items easily accessible for the user. The game will be presented around a fun and enjoyable gameplay with the user wanting to come back for more with the aim of beating their previous high score.

# The Skeleton Plane

[^ Back To Contents ^](#contents)

## Gameplay

The main objective of Asteroids is to blast the oncoming asteroids and flying saucers that will occassionally appear. The player controls a triangular ship that can rotate left and right, fire shots straight forward, and thrust forward. Once the ship begins moving in a direction, it will continue in that direction for a time without player intervention unless the player applies thrust in a different direction. The ship eventually comes to a stop when not thrusting. The player can also send the ship into hyperspace, causing it to disappear and reappear in a random location on the screen, at the risk of self-destructing or appearing on top of an asteroid.

Each level starts with a few large asteroids drifting in various directions on the screen. Objects wrap around screen edges – for instance, an asteroid that drifts off the top edge of the screen reappears at the bottom and continues moving in the same direction. As the player shoots asteroids, they break into smaller asteroids that move faster and are more difficult to hit. Smaller asteroids are also worth more points. Two flying saucers appear periodically on the screen; the "big saucer" shoots randomly and poorly, while the "small saucer" fires frequently at the ship. After reaching a score of 40,000, only the small saucer appears. As the player's score increases, the angle range of the shots from the small saucer diminishes until the saucer fires extremely accurately. Once the screen has been cleared of all asteroids and flying saucers, a new set of large asteroids appears, thus starting the next level. The player starts with 3 lives when the player loses all their lives, the game ends.

# Wireframes

## Tablet and larger screen view

- [Asteroids wireframes image 1](assets/wireframes/asteroid_wireframe_1.png)

- [Asteroids wireframes image 2](assets/wireframes/asteroid_wireframe_2.png)

- [Asteroids wireframes image 3](assets/wireframes/asteroid_wireframe_3.png)

- [Asteroids wireframes image 4](assets/wireframes/asteroid_wireframe_4.png)

## Mobile view

- [Asteroids wireframes image 5](assets/wireframes/asteroid_wireframe_5.png)

## Rough sketch

- [Rough wireframe sketch](assets/wireframes/rough_wireframe.JPG)

[^ Back To Contents ^](#contents)

---

# User Stories

[^ Back To Contents ^](#contents)

## User stories for a new gamer

## As a new gamer I expect :-

* Asteroids target audience 6+

* To be excited to play 
* To have fun 
* To be intrigued 
* To find the navigation ease to use 
* There to be gameplay instructions 
* The game to be easily playable
* The game to work on all devices
* The controls to be easily accessible 
* There to be a scoring feature
* My high score to be saved
* There to be contact details
* There to be social network links 

## User stories for a returning gamer

## As a returning gamer I expect :-

* To be able to jump in and immediately play

* Menu items to be in the same location
* The design to be the same
* My highscore to be still there
* If the developer made any updates to the game, I expect this information to be easily located 

---

# User Testing

[^ Back To Contents ^](#contents)

TEST            | OUTCOME                          | PASS / FAIL  
--------------- | -------------------------------- | ---------------
Move ship with arrow keys. At the start my main opjection here is just to rotate the ship in place                           | Outcome | Pass/Fail
Next I'd like to add more functionality for the ship. For example: to make it fly                                             | Outcome | Pass/Fail
Making the ship shoot bullets by pressing spacebar | Outcome | Pass/Fail
Make asteroids appear randomly in clusters         | Outcome | Pass/Fail
Make asteroids rotate for added affects            | Outcome | Pass/Fail
When asteroids are blasted they sperate into smaller asteroids |  Outcome | Pass/Fail
Add thrusters to ship by pressing the UP arrow     | Outcome | Pass/Fail
Implement a scoring system                         | Outcome | Pass/Fail
Save players highscore                             | Outcome | Pass/Fail
If ship hits an asteroid, ship is destroyed and player loses a life |  Outcome | Pass/Fail