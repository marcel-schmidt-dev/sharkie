import { loadImage } from '../main';
import Coin from './coin';
import Poison from './poison';

export default class Enemy {
    constructor(animations) {
        if (!animations) {
            throw new Error('Animations must be provided');
        }
        this.canvas = document.getElementById('canvas');
        this.animations = animations;
        this.currentAnimation = animations.hasOwnProperty('transition') ? 'transition' : 'swim';
        this.frames = this.loadImages(this.animations[this.currentAnimation]);
        this.currentFrameIndex = 0;
        this.frameTick = 0;
        this.frameSpeed = 20;
        this.isLoaded = this.frames.length > 0;
        this.isDying = false;
        this.health = 2;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.hitbox = { x: 0, y: 0, width: 0, height: 0 };
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
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    }

    handleCollisionWithBullet(bullet) {
        if (!this.isInBounds()) {
            return;
        }
        this.health -= bullet.damage;
        if (this.health <= 0 && !this.isDying) {
            this.die();
        }
    }

    die() {
        this.isDying = true;
        this.frames = this.animations.die.map(src => {
            const img = loadImage(src);
            img.onload = () => {
                this.isLoaded = true;
            };
            img.onerror = () => {
                img.broken = true;
            };
            return img;
        });
        this.currentAnimation = 'die';
        this.currentFrameIndex = 0;
        this.frameTick = 0;

        if (this.constructor.name === 'PufferFish') {
            const coin = new Coin(this.x, this.y);
            this.game.coins.push(coin);
        }
        else if (this.constructor.name === 'JellyFish') {
            const poison = new Poison(this.x, this.y);
            this.game.poisons.push(poison);
        }
    }

    isInBounds() {
        return this.x + this.width > 0 && this.y + this.height > 0;
    }
}