import { GAME_SPEED } from '../main';
import { imageCache } from '../utils/preload';

export default class Poison {
    /**
     * Creates an instance of Poison.
     * 
     * @constructor
     * @param {number} x - The x-coordinate of the poison.
     * @param {number} y - The y-coordinate of the poison.
     * @property {number} x - The x-coordinate of the poison.
     * @property {number} y - The y-coordinate of the poison.
     * @property {number} width - The width of the poison, calculated as 6% of the canvas width.
     * @property {number} height - The height of the poison, calculated as 6% of the canvas width.
     * @property {number} frameIndex - The current frame index for animation.
     * @property {number} tickCount - The current tick count for animation.
     * @property {number} ticksPerFrame - The number of ticks per frame for animation.
     * @property {string[]} frames - The array of frame image paths for animation.
     * @property {Object} hitbox - The hitbox of the poison.
     * @property {number} hitbox.x - The x-coordinate of the hitbox.
     * @property {number} hitbox.y - The y-coordinate of the hitbox.
     * @property {number} hitbox.width - The width of the hitbox.
     * @property {number} hitbox.height - The height of the hitbox.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = canvas.width * 0.06;
        this.height = canvas.width * 0.06;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 15;
        this.frames = [
            './assets/marks/poison/1.png',
            './assets/marks/poison/2.png',
            './assets/marks/poison/3.png',
            './assets/marks/poison/4.png',
            './assets/marks/poison/5.png',
            './assets/marks/poison/6.png',
            './assets/marks/poison/7.png',
            './assets/marks/poison/8.png',
        ];

        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Updates the position and animation frame of the poison object.
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
     * Draws the current frame of the poison object onto the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context where the image will be drawn.
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
     * Checks if the current object is colliding with another object.
     *
     * @param {Object} other - The other object to check collision with.
     * @param {Object} other.hitbox - The hitbox of the other object.
     * @param {number} other.hitbox.x - The x-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.y - The y-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.width - The width of the other object's hitbox.
     * @param {number} other.hitbox.height - The height of the other object's hitbox.
     * @returns {boolean} - Returns true if the current object is colliding with the other object, otherwise false.
     */
    isCollidingWith(other) {
        const poison = this.hitbox;
        const otherHitbox = other.hitbox;
        return (
            poison.x < otherHitbox.x + otherHitbox.width &&
            poison.x + poison.width > otherHitbox.x &&
            poison.y < otherHitbox.y + otherHitbox.height &&
            poison.y + poison.height > otherHitbox.y
        );
    }
}