import Coin from './coin';
import Poison from './poison';
import playSound from '../utils/sound';
import { imageCache } from '../main';

export default class Enemy {
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

    draw(ctx) {
        if (this.frames.length > 0) {
            const currentFrame = this.frames[this.currentFrameIndex];
            if (currentFrame instanceof HTMLImageElement && !currentFrame.broken) {
                ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
            }
        }

        // Draw hitbox for debugging
        // this.drawHitbox(ctx);
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

    isInBounds() {
        return this.x + this.hitbox.width > 0 && this.y + this.hitbox.height > 0;
    }
}