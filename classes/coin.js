import { canvas, GAME_SPEED, imageCache } from '../main';

export default class Coin {
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

    update(deltaTime) {
        this.x -= GAME_SPEED * 500 * deltaTime;
        this.tickCount += deltaTime;
        if (this.tickCount > this.ticksPerFrame * deltaTime) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        }
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    draw(ctx) {
        const currentFrame = imageCache[this.frames[this.frameIndex]];
        ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
    }

    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

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