import { canvas, GAME_SPEED } from '../main';
import { imageCache } from '../utils/preload';

export default class Coin {
    /**
     * Creates an instance of a Coin.
     * 
     * @constructor
     * @param {number} x - The x-coordinate of the coin.
     * @param {number} y - The y-coordinate of the coin.
     * @property {number} width - The width of the coin, calculated as 4% of the canvas width.
     * @property {number} height - The height of the coin, calculated as 4% of the canvas width.
     * @property {number} frameIndex - The current frame index for animation.
     * @property {number} tickCount - The current tick count for animation.
     * @property {number} ticksPerFrame - The number of ticks per frame for animation.
     * @property {string[]} frames - The array of image paths for the coin animation frames.
     * @property {Object} hitbox - The hitbox of the coin.
     * @property {number} hitbox.x - The x-coordinate of the hitbox.
     * @property {number} hitbox.y - The y-coordinate of the hitbox.
     * @property {number} hitbox.width - The width of the hitbox.
     * @property {number} hitbox.height - The height of the hitbox.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = canvas.width * 0.04;
        this.height = canvas.width * 0.04;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 20;
        this.frames = [
            './assets/marks/1. Coins/1.png',
            './assets/marks/1. Coins/2.png',
            './assets/marks/1. Coins/3.png',
            './assets/marks/1. Coins/4.png'
        ];
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Updates the position and animation frame of the coin.
     * 
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        this.x -= GAME_SPEED * 500 * deltaTime;
        this.tickCount += deltaTime;
        if (this.tickCount > this.ticksPerFrame * deltaTime) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        }
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Draws the current frame of the coin on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     */
    draw(ctx) {
        const currentFrame = imageCache[this.frames[this.frameIndex]];
        ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if the object is within the bounds of the canvas.
     * 
     * @returns {boolean} True if the object is within the canvas bounds, false otherwise.
     */
    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

    /**
     * Checks if this object is colliding with another object.
     *
     * @param {Object} other - The other object to check collision with.
     * @param {Object} other.hitbox - The hitbox of the other object.
     * @param {number} other.hitbox.x - The x-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.y - The y-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.width - The width of the other object's hitbox.
     * @param {number} other.hitbox.height - The height of the other object's hitbox.
     * @returns {boolean} True if this object is colliding with the other object, false otherwise.
     */
    isCollidingWith(other) {
        const coinHitbox = this.hitbox;
        const otherHitbox = other.hitbox;
        return (
            coinHitbox.x < otherHitbox.x + otherHitbox.width &&
            coinHitbox.x + coinHitbox.width > otherHitbox.x &&
            coinHitbox.y < otherHitbox.y + otherHitbox.height &&
            coinHitbox.y + coinHitbox.height > otherHitbox.y
        );
    }
}