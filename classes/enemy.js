import { loadImage } from '../main';

export default class Enemy {
    constructor(animations) {
        if (!animations) {
            throw new Error('Animations must be provided');
        }
        this.canvas = document.getElementById('canvas');
        this.rect = this.canvas.getBoundingClientRect();
        this.animations = animations;
        this.currentAnimation = animations.hasOwnProperty('transition') ? 'transition' : 'swim';
        this.frames = this.loadImages(this.animations[this.currentAnimation]);
        this.currentFrameIndex = 0;
        this.frameTick = 0;
        this.frameSpeed = 20;
        this.isLoaded = this.frames.length > 0;
        this.isDying = false;
        this.health = 2; // Standard-Health-Wert
        this.x = 0; // Standardwert, sollte in der Unterklasse gesetzt werden
        this.y = 0; // Standardwert, sollte in der Unterklasse gesetzt werden
        this.width = 100; // Standardwert, sollte in der Unterklasse gesetzt werden
        this.height = 100; // Standardwert, sollte in der Unterklasse gesetzt werden
    }

    loadImages(paths) {
        if (!paths) {
            throw new Error('Paths must be provided');
        }
        return paths.map(src => {
            const img = loadImage(src);
            img.onload = () => {
                this.isLoaded = true;
            };
            img.onerror = () => {
                img.broken = true;
            };
            return img;
        });
    }

    draw(ctx) {
        if (this.isLoaded && this.frames.length > 0) {
            const currentFrame = this.frames[this.currentFrameIndex];
            if (currentFrame instanceof HTMLImageElement && !currentFrame.broken) {
                ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
            }
        }

        // Draw hitbox for debugging
        this.drawHitbox(ctx);
    }

    drawHitbox(ctx) {
        const hitbox = this.getHitbox();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    handleCollisionWithBullet(bullet) {
        if (this.checkVisibility()) {
            this.health -= bullet.damage; // Reduziere den health-Wert um den Schaden der Kugel
            if (this.health <= 0) {
                this.die();
            }
        }
    }

    die() {
        console.log(`${this.color} Enemy died!`);
        this.isDying = true;
        if (this.animations.die) {
            this.frames = this.loadImages(this.animations.die);
            this.currentAnimation = 'die';
            this.currentFrameIndex = 0;
            this.frameTick = 0;
        }
    }

    getHitbox() {
        if (this.isDying) {
            return { x: 0, y: 0, width: 0, height: 0 }; // Return an empty hitbox when dying
        }
        return {
            x: this.x + 25,
            y: this.y + 225,
            width: this.width - 50,
            height: this.height - 300
        };
    }

    isInBounds() {
        return this.x + this.width > 0;
    }

    checkVisibility() {
        return (
            this.x + this.width > 0 &&
            this.x < this.rect.width &&
            this.y + this.height > 0 &&
            this.y < this.rect.height
        );
    }
}