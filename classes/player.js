import { GAME_SPEED } from '../main.js';
import Bullet from './Bullet';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 250;
        this.height = 250;
        this.x = 50;
        this.y = canvas.height / 2 - this.height / 2;
        this.speed = 2 * GAME_SPEED;
        this.up = false;
        this.down = false;
        this.isShooting = false;
        this.isSpecialShooting = false;
        this.isInCollision = false;
        this.collisionAnimationTimer = 0;
        this.swimFrames = this.loadFrames('/assets/sharkie/swim/', 6);
        this.shootFrames = this.loadFrames('/assets/sharkie/4.Attack/Bubble trap/Op2 (Without Bubbles)/', 7);
        this.hitFrames = this.loadFrames('/assets/sharkie/4.Attack/Fin slap/', 8);
        this.jellyFishCollisionFrames = this.loadFrames('/assets/sharkie/5.Hurt/2.Electric shock/', 3);
        this.pufferFishCollisionFrames = this.loadFrames('/assets/sharkie/5.Hurt/1.Poisoned/', 4);
        this.currentFrames = this.swimFrames;
        this.currentFrame = 0;
        this.frameSpeed = 10 / GAME_SPEED;
        this.shootFrameSpeed = 5 / GAME_SPEED;
        this.tickCount = 0;
        this.hitbox = {
            offsetX: this.width * 0.2,
            offsetY: this.width * 0.54,
            width: this.width * 0.6,
            height: this.height * 0.2
        };
        this.isSpecialActive = false;
        this.animationQueue = [];
        this.specialBullet = null;
        this.potions = 0;
        document.addEventListener("keydown", this.move.bind(this));
        document.addEventListener("keyup", this.stop.bind(this));
    }

    loadFrames(basePath, frameCount) {
        return Array.from({ length: frameCount }, (_, index) => {
            const img = new Image();
            img.src = `${basePath}${index + 1}.png`;
            img.onload = () => {
                img.isLoaded = true;
            };
            img.onerror = () => {
                img.broken = true;
            };
            return img;
        });
    }

    move(e) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                this.up = true;
                break;
            case "ArrowDown":
            case "s":
                this.down = true;
                break;
            case " ":
                if (!this.isSpecialActive) {
                    this.isShooting = true;
                    this.switchAnimation('shoot');
                }
                break;
            case "e":
                if (!this.isSpecialActive && this.currentFrames === this.swimFrames) {
                    this.isSpecialActive = true;
                    this.isSpecialShooting = true;
                    this.switchAnimation('shoot');
                }
                break;
        }
    }

    stop(e) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                this.up = false;
                break;
            case "ArrowDown":
            case "s":
                this.down = false;
                break;
            case " ":
                this.isShooting = false;
                break;
            case "e":
                if (!this.isSpecialActive && this.currentFrames === this.swimFrames) {
                    this.isSpecialActive = false;
                    this.isSpecialShooting = false;
                }
                break;
        }
    }

    switchAnimation(animationType) {
        let frames;
        if (animationType === 'shoot') {
            frames = this.shootFrames;
        } else if (animationType === 'swim') {
            frames = this.swimFrames;
        } else if (animationType === 'special') {
            frames = this.hitFrames;
        }

        if (this.currentFrames !== frames) {
            this.currentFrames = frames;
            this.currentFrame = 0;
            this.tickCount = 0;
        }
    }

    startCollisionAnimation(collisionType) {
        this.isInCollision = true;
        this.collisionAnimationTimer = 120 / GAME_SPEED;
        this.currentFrames = collisionType === 'jellyFish' ? this.jellyFishCollisionFrames : this.pufferFishCollisionFrames;
        this.currentFrame = 0;
        this.tickCount = 0;
        this.isSpecialActive = false;
        this.animationQueue = [];
    }

    update() {
        if (this.up) this.y -= this.speed;
        if (this.down) this.y += this.speed;
        this.y = Math.max(-115, Math.min(canvas.height - (this.height - 60), this.y));

        if (this.isInCollision) {
            this.collisionAnimationTimer--;
            if (this.collisionAnimationTimer <= 0) {
                this.isInCollision = false;
                this.switchAnimation('swim');
            }
        }

        if (!this.isInCollision && this.isShooting && !this.isSpecialShooting) {
            this.switchAnimation('shoot');
        }

        this.tickCount++;
        const currentFrameSpeed = this.currentFrames === this.shootFrames ? this.shootFrameSpeed : this.frameSpeed;
        if (this.tickCount >= currentFrameSpeed) {
            this.tickCount = 0;
            this.currentFrame = (this.currentFrame + 1) % this.currentFrames.length;

            if (this.currentFrames === this.shootFrames && this.currentFrame === this.shootFrames.length - 1 && this.isSpecialShooting) {
                this.specialBullet = new Bullet(this.x + this.width, this.y + this.height / 2 - 15, 0, 2); // Setze den Schaden auf 2
                this.specialBullet.width *= 2;
                this.specialBullet.height *= 2;
                this.specialBullet.speed = 0;
                this.specialBullet.hasHitbox = false;
                this.game.bullets.push(this.specialBullet);
                this.switchAnimation('special');
                this.isSpecialShooting = false;
            }

            if (this.currentFrames === this.hitFrames && this.currentFrame === this.hitFrames.length - 1) {
                if (this.specialBullet) {
                    this.specialBullet.speed = 10 * GAME_SPEED;
                    this.specialBullet.hasHitbox = true;
                    this.specialBullet = null;
                }
                this.isSpecialActive = false;
                this.switchAnimation('swim');
            }

            if (this.currentFrames === this.shootFrames && this.currentFrame === this.shootFrames.length - 1 && !this.isSpecialActive) {
                if (this.isShooting) {
                    this.game.bullets.push(new Bullet(this.x + this.width - 60, this.y + this.height - 110));
                } else {
                    this.switchAnimation('swim');
                }
            }

            if (this.animationQueue.length > 0 && this.currentFrame === this.currentFrames.length - 1) {
                const nextAnimation = this.animationQueue.shift();
                if (nextAnimation === 'special') {
                    this.isSpecialActive = true;
                }
                this.switchAnimation(nextAnimation);
            }
        }

        if (this.specialBullet && this.isSpecialActive) {
            this.specialBullet.x = this.x + this.width - 50;
            this.specialBullet.y = this.y + this.height / 2 - 15;
        }

        if (this.specialBullet && this.specialBullet.hasHitbox) {
            this.specialBullet.updateHitbox();
        }
    }

    draw(ctx) {
        const currentFrame = this.currentFrames[this.currentFrame];
        if (currentFrame.isLoaded && !currentFrame.broken) {
            ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
        }
    }

    getHitbox() {
        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width,
            height: this.hitbox.height
        };
    }

    isCollidingWith(other) {
        const playerHitbox = this.getHitbox();
        const otherHitbox = other.getHitbox();
        return (
            playerHitbox.x < otherHitbox.x + otherHitbox.width &&
            playerHitbox.x + playerHitbox.width > otherHitbox.x &&
            playerHitbox.y < otherHitbox.y + otherHitbox.height &&
            playerHitbox.y + playerHitbox.height > otherHitbox.y
        );
    }

    handleCollisionWithEnemy(enemy) {
        this.startCollisionAnimation(enemy.type);
        if (this.specialBullet) {
            this.game.bullets = this.game.bullets.filter(bullet => bullet !== this.specialBullet);
            this.specialBullet = null;
            this.isSpecialActive = false;
        }
    }
}