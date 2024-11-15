import { GAME_SPEED, loadImage } from '../main';

export default class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 20; // Geschwindigkeit der Animation
        this.frames = [
            '/assets/marks/1. Coins/1.png',
            '/assets/marks/1. Coins/2.png',
            '/assets/marks/1. Coins/3.png',
            '/assets/marks/1. Coins/4.png'
        ].map(src => {
            const img = loadImage(src);
            img.onload = () => {
                img.isLoaded = true;
            };
            img.onerror = () => {
                img.broken = true;
            };
            return img;
        });
    }

    update() {
        this.x -= GAME_SPEED * 2;
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        }
    }

    draw(ctx) {
        const currentFrame = this.frames[this.frameIndex];
        if (currentFrame.isLoaded && !currentFrame.broken) {
            ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
        }
    }

    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isCollidingWith(other) {
        const coinHitbox = this.getHitbox();
        const otherHitbox = other.getHitbox();
        return (
            coinHitbox.x < otherHitbox.x + otherHitbox.width &&
            coinHitbox.x + coinHitbox.width > otherHitbox.x &&
            coinHitbox.y < otherHitbox.y + otherHitbox.height &&
            coinHitbox.y + coinHitbox.height > otherHitbox.y
        );
    }
}