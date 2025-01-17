import { GAME_SPEED } from '../main.js';
import Enemy from './Enemy';

/**
 * An object containing animation data for different colored jellyfish.
 * Each color has its own set of animations for swimming and dying.
 * 
 * @typedef {Object} Animations
 * @property {Object} purple - Animations for the purple jellyfish.
 * @property {string[]} purple.swim - Array of file paths for the purple jellyfish swimming animation.
 * @property {string[]} purple.die - Array of file paths for the purple jellyfish dying animation.
 * @property {Object} yellow - Animations for the yellow jellyfish.
 * @property {string[]} yellow.swim - Array of file paths for the yellow jellyfish swimming animation.
 * @property {string[]} yellow.die - Array of file paths for the yellow jellyfish dying animation.
 * @property {Object} green - Animations for the green jellyfish.
 * @property {string[]} green.swim - Array of file paths for the green jellyfish swimming animation.
 * @property {string[]} green.die - Array of file paths for the green jellyfish dying animation.
 * @property {Object} pink - Animations for the pink jellyfish.
 * @property {string[]} pink.swim - Array of file paths for the pink jellyfish swimming animation.
 * @property {string[]} pink.die - Array of file paths for the pink jellyfish dying animation.
 */
const animations = {
    purple: {
        swim: ['./assets/enemy/jellyFish/regular/lila1.png', './assets/enemy/jellyFish/regular/lila2.png', './assets/enemy/jellyFish/regular/lila3.png', './assets/enemy/jellyFish/regular/lila4.png'],
        die: ['./assets/enemy/jellyFish/dead/Lila/L1.png', './assets/enemy/jellyFish/dead/Lila/L2.png', './assets/enemy/jellyFish/dead/Lila/L3.png', './assets/enemy/jellyFish/dead/Lila/L4.png']
    },
    yellow: {
        swim: ['./assets/enemy/jellyFish/regular/yellow1.png', './assets/enemy/jellyFish/regular/yellow2.png', './assets/enemy/jellyFish/regular/yellow3.png', './assets/enemy/jellyFish/regular/yellow4.png'],
        die: ['./assets/enemy/jellyFish/dead/Yellow/y1.png', './assets/enemy/jellyFish/dead/Yellow/y2.png', './assets/enemy/jellyFish/dead/Yellow/y3.png', './assets/enemy/jellyFish/dead/Yellow/y4.png']
    },
    green: {
        swim: ['./assets/enemy/jellyFish/dangerous/green1.png', './assets/enemy/jellyFish/dangerous/green2.png', './assets/enemy/jellyFish/dangerous/green3.png', './assets/enemy/jellyFish/dangerous/green4.png'],
        die: ['./assets/enemy/jellyFish/dead/green/g1.png', './assets/enemy/jellyFish/dead/green/g2.png', './assets/enemy/jellyFish/dead/green/g3.png', './assets/enemy/jellyFish/dead/green/g4.png']
    },
    pink: {
        swim: ['./assets/enemy/jellyFish/dangerous/pink1.png', './assets/enemy/jellyFish/dangerous/pink2.png', './assets/enemy/jellyFish/dangerous/pink3.png', './assets/enemy/jellyFish/dangerous/pink4.png'],
        die: ['./assets/enemy/jellyFish/dead/Pink/P1.png', './assets/enemy/jellyFish/dead/Pink/P2.png', './assets/enemy/jellyFish/dead/Pink/P3.png', './assets/enemy/jellyFish/dead/Pink/P4.png']
    }
};

export default class JellyFish extends Enemy {
    /**
     * Creates an instance of a JellyFish.
     * 
     * @constructor
     * @param {Object} game - The game object.
     * 
     * @property {string} type - The type of the jellyfish ('green', 'pink', 'yellow', 'purple').
     * @property {Object} game - The game object.
     * @property {string} fishType - The type of fish, always 'jellyFish'.
     * @property {number} width - The width of the jellyfish.
     * @property {number} height - The height of the jellyfish.
     * @property {number} health - The health of the jellyfish (4 for 'green' and 'pink', 3 for 'yellow' and 'purple').
     * @property {number} speed - The speed of the jellyfish.
     * @property {number} frameSpeed - The speed of the animation frames.
     * @property {number} tickCount - The tick count for animation.
     * @property {number} x - The x-coordinate of the jellyfish.
     * @property {number} y - The y-coordinate of the jellyfish.
     * @property {Object} hitbox - The hitbox of the jellyfish.
     */
    constructor(game) {
        const jellyFishType = Math.random();
        let type;
        if (jellyFishType < 0.5) {
            type = jellyFishType < 0.25 ? 'green' : 'pink';
        } else {
            type = jellyFishType < 0.75 ? 'yellow' : 'purple';
        }

        super(animations[type]);

        this.game = game;
        this.type = type;
        this.fishType = 'jellyFish';
        this.width = this.canvas.width * 0.13;
        this.height = this.canvas.width * 0.13;
        this.health = (type === 'green' || type === 'pink') ? 4 : 3;
        this.speed = (type === 'green' || type === 'pink') ? this.canvas.width * GAME_SPEED : this.canvas.width * 0.7 * GAME_SPEED;
        this.frameSpeed = 0.08;
        this.tickCount = 0;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.hitbox;
    }

    /**
     * Updates the state of the jellyfish.
     * If the jellyfish is dying, it updates the dying state.
     * Otherwise, it updates the swimming state.
     * Also updates the hitbox of the jellyfish.
     *
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        this.isDying ? this.updateDying(deltaTime) : this.updateSwimming(deltaTime);
        this.updateHitbox();
    }

    /**
     * Updates the position and animation frame of the jellyfish when it is dying.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     */
    updateDying(deltaTime) {
        this.y -= (this.speed / 2) * deltaTime;
        this.frameTick += deltaTime;
        if (this.frameTick >= this.frameSpeed) {
            this.frameTick = 0;
            if (this.currentFrameIndex < this.frames.length - 1) {
                this.currentFrameIndex++;
            }
        }
    }

    /**
     * Updates the swimming animation and position of the jellyfish.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     */
    updateSwimming(deltaTime) {
        this.x -= this.speed * deltaTime;
        this.tickCount += deltaTime;
        if (this.tickCount >= this.frameSpeed) {
            this.tickCount = 0;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
        }
    }

    /**
     * Updates the hitbox of the jellyfish based on its current state.
     * If the jellyfish is dying, the hitbox is set to zero dimensions.
     * Otherwise, the hitbox is calculated based on the jellyfish's current position and size.
     */
    updateHitbox() {
        this.hitbox = this.isDying ? { x: 0, y: 0, width: 0, height: 0 } : { x: this.x + 20, y: this.y + 15, width: this.width - 40, height: this.height - 40 };
    }

    /**
     * Handles the collision of the jellyfish with a bullet.
     * Decreases the health of the jellyfish by one.
     * If the health drops to zero or below, the jellyfish dies.
     */
    onCollisionWithBullet() {
        this.health--;
        if (this.health <= 0) this.die();
    }
}