import { GAME_SPEED } from "../main";
import { imageCache } from "../utils/preload";

export default class BackgroundLayer {
    /**
     * Creates an instance of the BackgroundLayer class.
     * 
     * @constructor
     * @param {string} imageSrc - The source of the image to be used for the background layer.
     * @param {number} speed - The speed at which the background layer moves.
     */
    constructor(imageSrc, speed) {
        this.image = imageCache[imageSrc];
        this.speed = speed * GAME_SPEED;
        this.x = 0;
        this.y = 0;
        this.width = canvas.width * 2;
        this.height = canvas.height;
    }

    /**
     * Updates the position of the background layer based on the elapsed time.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     */
    update(deltaTime) {
        this.x -= this.speed * deltaTime;

        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    /**
     * Draws the background layer on the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + (this.width - 1), this.y, this.width, this.height);
        }
    }
}