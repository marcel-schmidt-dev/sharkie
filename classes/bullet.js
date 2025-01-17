import { canvas, GAME_SPEED } from "../main";

class Bullet {

    /**
     * Creates an instance of Bullet.
     * 
     * @constructor
     * @param {number} x - The x-coordinate of the bullet.
     * @param {number} y - The y-coordinate of the bullet.
     * @param {boolean} [special=false] - Indicates if the bullet is special.
     * @param {boolean} [buffed=false] - Indicates if the bullet is buffed.
     */
    constructor(x, y, special = false, buffed = false) {
        this.x = x;
        this.y = y;
        this.width = canvas.width * 0.025;
        this.height = canvas.width * 0.025;
        this.speed = canvas.width * 0.003 * GAME_SPEED;
        this.damage = special ? (buffed ? 4 : 3) : (buffed ? 2 : 1);
        this.image = new Image();
        if (buffed) {
            this.image.src = './assets/sharkie/4.Attack/Bubble trap/Buffed.png';
        }
        else {
            this.image.src = './assets/sharkie/4.Attack/Bubble trap/Bubble.png';
        }
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
        this.isCollided = false;
    }

    /**
     * Updates the position of the bullet and its hitbox.
     * Increases the x-coordinate by the bullet's speed and updates the hitbox dimensions.
     */
    update() {
        this.x += this.speed;
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    /**
     * Draws the bullet image on the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw the bullet on.
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if the bullet is within the bounds of the canvas.
     * 
     * @returns {boolean} True if the bullet is within the canvas bounds, false otherwise.
     */
    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

    /**
     * Checks if the bullet is colliding with another object.
     *
     * @param {Object} other - The other object to check collision with.
     * @param {Object} other.hitbox - The hitbox of the other object.
     * @param {number} other.hitbox.x - The x-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.y - The y-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.width - The width of the other object's hitbox.
     * @param {number} other.hitbox.height - The height of the other object's hitbox.
     * @returns {boolean} - Returns true if the bullet is colliding with the other object, otherwise false.
     */
    isCollidingWith(other) {
        const bulletHitbox = this.hitbox;
        const otherHitbox = other.hitbox;

        if (bulletHitbox.x < otherHitbox.x + otherHitbox.width &&
            bulletHitbox.x + bulletHitbox.width > otherHitbox.x &&
            bulletHitbox.y < otherHitbox.y + otherHitbox.height &&
            bulletHitbox.y + bulletHitbox.height > otherHitbox.y) {
            this.isCollided = true;
            return true;
        }
    }
}

export default Bullet;