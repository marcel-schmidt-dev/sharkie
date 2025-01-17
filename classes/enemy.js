import Coin from './coin';
import Poison from './poison';
import playSound from '../utils/sound';
import { imageCache } from '../utils/preload';

export default class Enemy {
    /**
     * Creates an instance of an enemy with animations.
     * 
     * @constructor
     * @param {Object} animations - An object containing animation frames.
     * @property {HTMLCanvasElement} canvas - The canvas element where the enemy will be drawn.
     * @property {Object} animations - The animations for the enemy.
     * @property {string} currentAnimation - The current animation being played.
     * @property {Array} frames - The frames of the current animation.
     * @property {number} currentFrameIndex - The index of the current frame in the animation.
     * @property {number} frameTick - The tick count for frame updates.
     * @property {number} frameSpeed - The speed at which frames are updated.
     * @property {boolean} isDying - Indicates if the enemy is in the dying state.
     * @property {number} health - The health of the enemy.
     * @property {number} x - The x-coordinate of the enemy.
     * @property {number} y - The y-coordinate of the enemy.
     * @property {number} width - The width of the enemy.
     * @property {number} height - The height of the enemy.
     * @property {Object} hitbox - The hitbox of the enemy.
     * @property {number} hitbox.x - The x-coordinate of the hitbox.
     * @property {number} hitbox.y - The y-coordinate of the hitbox.
     * @property {number} hitbox.width - The width of the hitbox.
     * @property {number} hitbox.height - The height of the hitbox.
     */
    constructor(animations) {
        this.canvas = document.getElementById('canvas');
        this.animations = animations;
        this.currentAnimation = animations.hasOwnProperty('transition') ? 'transition' : 'swim';
        this.frames = this.animations[this.currentAnimation].map(src => imageCache[src]);
        this.currentFrameIndex = 0;
        this.frameTick = 0;
        this.frameSpeed = 0.1;
        this.isDying = false;
        this.health = 2;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.hitbox = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Draws the current frame of the enemy on the given canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw the enemy on.
     */
    draw(ctx) {
        if (this.frames.length > 0) {
            const currentFrame = this.frames[this.currentFrameIndex];
            if (currentFrame instanceof HTMLImageElement && !currentFrame.broken) {
                ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
            }
        }
    }

    /**
     * Draws the hitbox of the enemy on the given canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw the hitbox on.
     */
    drawHitbox(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    }

    /**
     * Handles the collision of the enemy with a bullet.
     * Reduces the enemy's health by the bullet's damage.
     * If the enemy's health drops to 0 or below, triggers the enemy's death sequence.
     *
     * @param {Object} bullet - The bullet object that the enemy collides with.
     * @param {number} bullet.damage - The amount of damage the bullet inflicts.
     */
    handleCollisionWithBullet(bullet) {
        if (!this.isInBounds()) {
            return;
        }
        this.health -= bullet.damage;
        if (this.health <= 0 && !this.isDying) {
            this.die();
        }
    }

    /**
     * Handles the death of the enemy.
     * Sets the enemy's state to dying, updates the current animation to 'die',
     * and resets the hitbox. Depending on the type of fish, it may spawn a coin
     * or poison at the enemy's location.
     * 
     * @method die
     * @memberof Enemy
     */
    die() {
        this.isDying = true;
        this.currentAnimation = 'die';
        this.frames = this.animations[this.currentAnimation].map(src => imageCache[src]);
        this.currentFrameIndex = 0;
        this.hitbox = { x: -100, y: -100, width: 0, height: 0 };


        if (this.fishType === 'pufferFish') {
            const coin = new Coin(this.x, this.y);
            this.game.coins.push(coin);

        }
        else if (this.fishType === 'jellyFish') {
            const poison = new Poison(this.x, this.y);
            this.game.poisons.push(poison);
        }
        playSound('mobDie');
    }

    /**
     * Checks if the enemy is within the bounds of the game area.
     * 
     * @returns {boolean} True if the enemy is within bounds, false otherwise.
     */
    isInBounds() {
        return this.x + this.hitbox.width > 0 && this.y + this.hitbox.height > 0;
    }
}