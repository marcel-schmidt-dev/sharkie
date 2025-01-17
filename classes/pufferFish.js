import { GAME_SPEED } from '../main';
import Enemy from './enemy';
import { imageCache } from '../utils/preload';

/**
 * Object containing animations for different colored puffer fish.
 * Each color has its own set of animations for different actions.
 * 
 * @typedef {Object} Animations
 * @property {Object} green - Animations for the green puffer fish.
 * @property {string[]} green.swim - Array of file paths for the green puffer fish swimming animation.
 * @property {string[]} green.bubbleswim - Array of file paths for the green puffer fish bubble swimming animation.
 * @property {string[]} green.transition - Array of file paths for the green puffer fish transition animation.
 * @property {string[]} green.die - Array of file paths for the green puffer fish dying animation.
 * 
 * @property {Object} brown - Animations for the brown puffer fish.
 * @property {string[]} brown.swim - Array of file paths for the brown puffer fish swimming animation.
 * @property {string[]} brown.bubbleswim - Array of file paths for the brown puffer fish bubble swimming animation.
 * @property {string[]} brown.transition - Array of file paths for the brown puffer fish transition animation.
 * @property {string[]} brown.die - Array of file paths for the brown puffer fish dying animation.
 * 
 * @property {Object} pink - Animations for the pink puffer fish.
 * @property {string[]} pink.swim - Array of file paths for the pink puffer fish swimming animation.
 * @property {string[]} pink.bubbleswim - Array of file paths for the pink puffer fish bubble swimming animation.
 * @property {string[]} pink.transition - Array of file paths for the pink puffer fish transition animation.
 * @property {string[]} pink.die - Array of file paths for the pink puffer fish dying animation.
 */
const animations = {
    green: {
        swim: ['./assets/enemy/pufferFish/swim/1.swim1.png', './assets/enemy/pufferFish/swim/1.swim2.png', './assets/enemy/pufferFish/swim/1.swim3.png', './assets/enemy/pufferFish/swim/1.swim4.png', './assets/enemy/pufferFish/swim/1.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/1.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/1.transition1.png', './assets/enemy/pufferFish/transition/1.transition2.png', './assets/enemy/pufferFish/transition/1.transition3.png', './assets/enemy/pufferFish/transition/1.transition4.png', './assets/enemy/pufferFish/transition/1.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/1.1.png', './assets/enemy/pufferFish/die/1.2.png', './assets/enemy/pufferFish/die/1.3.png']
    },
    brown: {
        swim: ['./assets/enemy/pufferFish/swim/2.swim1.png', './assets/enemy/pufferFish/swim/2.swim2.png', './assets/enemy/pufferFish/swim/2.swim3.png', './assets/enemy/pufferFish/swim/2.swim4.png', './assets/enemy/pufferFish/swim/2.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/2.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/2.transition1.png', './assets/enemy/pufferFish/transition/2.transition2.png', './assets/enemy/pufferFish/transition/2.transition3.png', './assets/enemy/pufferFish/transition/2.transition4.png', './assets/enemy/pufferFish/transition/2.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/2.1.png', './assets/enemy/pufferFish/die/2.2.png', './assets/enemy/pufferFish/die/2.3.png']
    },
    pink: {
        swim: ['./assets/enemy/pufferFish/swim/3.swim1.png', './assets/enemy/pufferFish/swim/3.swim2.png', './assets/enemy/pufferFish/swim/3.swim3.png', './assets/enemy/pufferFish/swim/3.swim4.png', './assets/enemy/pufferFish/swim/3.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/3.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/3.transition1.png', './assets/enemy/pufferFish/transition/3.transition2.png', './assets/enemy/pufferFish/transition/3.transition3.png', './assets/enemy/pufferFish/transition/3.transition4.png', './assets/enemy/pufferFish/transition/3.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/3.1.png', './assets/enemy/pufferFish/die/3.2.png', './assets/enemy/pufferFish/die/3.3.png']
    }
};

export default class PufferFish extends Enemy {
    /**
     * Creates an instance of a PufferFish.
     * 
     * @param {Object} game - The game instance.
     * @property {Object} game - The game instance.
     * @property {string} fishType - The type of fish, set to 'pufferFish'.
     * @property {string} color - The color of the puffer fish, randomly selected from the animations.
     * @property {number} width - The width of the puffer fish, calculated as 7% of the canvas width.
     * @property {number} height - The height of the puffer fish, calculated as 7% of the canvas width.
     * @property {number} speed - The speed of the puffer fish, calculated as 40% of the canvas width multiplied by the game speed.
     * @property {number} health - The health of the puffer fish, set to 2.
     * @property {string} currentAnimation - The current animation state, set to 'transition'.
     * @property {number} frameTick - The current frame tick, initialized to 0.
     * @property {number} frameSpeed - The speed of the frame, set to 20.
     * @property {number} x - The x-coordinate of the puffer fish, set to the canvas width.
     * @property {number} y - The y-coordinate of the puffer fish, randomly set within the canvas height minus the fish height.
     * @property {Object} hitbox - The hitbox of the puffer fish.
     */
    constructor(game) {
        const colors = Object.keys(animations);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        super(animations[randomColor]);

        this.game = game;
        this.fishType = 'pufferFish';
        this.color = randomColor;
        this.width = this.canvas.width * 0.07;
        this.height = this.canvas.width * 0.07;
        this.speed = this.canvas.width * 0.4 * GAME_SPEED;
        this.health = 2;
        this.currentAnimation = 'transition';
        this.frameTick = 0;
        this.frameSpeed = 20;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.hitbox;
    }

    /**
     * Updates the state of the puffer fish.
     * 
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        this.isDying ? this.handleDying(deltaTime) : this.handleSwimming(deltaTime);
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Handles the dying animation and movement of the puffer fish.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to update the position and animation frame.
     */
    handleDying(deltaTime) {
        this.frameSpeed = 0.1;
        this.y -= this.speed * deltaTime;
        this.updateFrame(deltaTime);
    }

    /**
     * Handles the swimming behavior of the puffer fish.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to calculate movement.
     * @memberof PufferFish
     */
    handleSwimming(deltaTime) {
        this.x -= this.speed * deltaTime;
        this.frameTick++;
        if (this.frameTick >= this.frameSpeed) {
            this.frameTick = 0;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
            if (this.currentAnimation === 'transition' && this.currentFrameIndex === 0) {
                this.frames = animations[this.color].bubbleswim.map(src => imageCache[src]);
                this.currentAnimation = 'bubbleswim';
            }
        }
    }

    /**
     * Updates the current frame of the animation based on the elapsed time.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame update.
     */
    updateFrame(deltaTime) {
        this.frameTick += deltaTime;
        if (this.frameTick >= this.frameSpeed) {
            this.frameTick = 0;
            if (this.currentFrameIndex < this.frames.length - 1) {
                this.currentFrameIndex++;
            }
        }
    }

    /**
     * Handles the collision event with a bullet.
     * Decreases the health of the puffer fish by one.
     * If the health reaches zero or below, the puffer fish dies.
     */
    onCollisionWithBullet() {
        this.health--;
        if (this.health <= 0) this.die();
    }
}