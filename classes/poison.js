import { GAME_SPEED, loadImage } from '../main';

export default class Poison {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 20; // Geschwindigkeit der Animation
        this.frames = [
            '/assets/marks/poison/1.png',
            '/assets/marks/poison/2.png',
            '/assets/marks/poison/3.png',
            '/assets/marks/poison/4.png',
            '/assets/marks/poison/5.png',
            '/assets/marks/poison/6.png',
            '/assets/marks/poison/7.png',
            '/assets/marks/poison/8.png',
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
        const poisonHitbox = this.getHitbox();
        const otherHitbox = other.getHitbox();
        return (
            poisonHitbox.x < otherHitbox.x + otherHitbox.width &&
            poisonHitbox.x + poisonHitbox.width > otherHitbox.x &&
            poisonHitbox.y < otherHitbox.y + otherHitbox.height &&
            poisonHitbox.y + poisonHitbox.height > otherHitbox.y
        );
    }
}