import { GAME_SPEED } from '../main.js';
import Bullet from './Bullet';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = canvas.width / 5;
        this.height = canvas.width / 5;
        this.x = 50;
        this.y = canvas.height / 2 - this.height / 2;
        this.speed = 2 * GAME_SPEED;
        this.up = false;
        this.down = false;
        this.isShooting = false;
        this.isSpecialShooting = false;
        this.isInCollision = false; // Eine Variable für Kollisionen und Animationen
        this.isDead = false; // Spielerstatus hinzugefügt
        this.collisionAnimationTimer = 0;
        this.swimFrames = this.loadFrames('/assets/sharkie/swim/', 6);
        this.shootFrames = this.loadFrames('/assets/sharkie/4.Attack/Bubble trap/Op2 (Without Bubbles)/', 7);
        this.hitFrames = this.loadFrames('/assets/sharkie/4.Attack/Fin slap/', 8);
        this.jellyFishCollisionFrames = this.loadFrames('/assets/sharkie/5.Hurt/2.Electric shock/', 3);
        this.pufferFishCollisionFrames = this.loadFrames('/assets/sharkie/5.Hurt/1.Poisoned/', 4);
        this.deathByJellyFishFrames = this.loadFrames('/assets/sharkie/6.dead/2.Electro_shock/', 10);
        this.deathByPufferFishFrames = this.loadFrames('/assets/sharkie/6.dead/1.Poisoned/', 12);
        this.sleepFrames = this.loadFrames('/assets/sharkie/2.Long_IDLE/', 13);
        this.currentFrames = this.swimFrames;
        this.currentFrame = 0;
        this.frameSpeed = 10 / GAME_SPEED;
        this.shootFrameSpeed = 5 / GAME_SPEED;
        this.tickCount = 0;
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
        this.isSpecialActive = false;
        this.animationQueue = [];
        this.specialBullet = null;
        this.potions = 0;
        this.health = 1; // Spieler hat 3 Leben
        this.coins = 0;
        this.isBuffed = false;
        document.addEventListener("keydown", this.move.bind(this));
        document.addEventListener("keyup", this.stop.bind(this));
        document.addEventListener("keypress", this.HandleBuff.bind(this)); // Hinzugefügt
        this.updateUI();
    }

    loadFrames(basePath, frameCount) {
        return Array.from({ length: frameCount }, (_, index) => {
            const img = new Image();
            img.src = `${basePath}${index + 1}.png`;
            img.onload = () => {
                img.isLoaded = true;
            };
            return img;
        });
    }

    HandleBuff(event) {
        if (event.key === 'd' && this.potions > 0) {
            this.potions--;
            this.isBuffed = true;
            this.updateUI();

            setTimeout(() => {
                this.isBuffed = false;
            }, 5000);
        }
    }

    move(e) {
        if (this.isDead) return; // Keine Eingaben, wenn der Spieler tot ist
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
        if (this.isDead) return; // Keine Eingaben, wenn der Spieler tot ist
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
        } else if (animationType === 'sleep') {
            frames = this.sleepFrames;
        }

        if (this.currentFrames !== frames) {
            this.currentFrames = frames;
            this.currentFrame = 0;
            this.tickCount = 0;
        }
    }

    startCollisionAnimation(collisionType) {
        if (!this.isInCollision) {
            this.isInCollision = true; // Blockiert weitere Animationen
            this.collisionAnimationTimer = 240 / GAME_SPEED;

            if (collisionType === 'deathByJellyFish') {
                this.currentFrames = this.deathByJellyFishFrames;
            } else if (collisionType === 'deathByPufferFish') {
                this.currentFrames = this.deathByPufferFishFrames;
            } else {
                this.currentFrames = collisionType === 'JellyFish'
                    ? this.jellyFishCollisionFrames
                    : this.pufferFishCollisionFrames;
            }

            this.currentFrame = 0;
            this.tickCount = 0;
            this.isSpecialActive = false;
            this.animationQueue = [];
        }
    }

    update() {
        if (this.isDead) {
            this.tickCount++;
            if (this.tickCount >= this.frameSpeed) {
                this.tickCount = 0;
                this.currentFrame = Math.min(this.currentFrame + 1, this.currentFrames.length - 1);

                // Todesanimation abgeschlossen
                if (this.currentFrame === this.currentFrames.length - 1) {
                    setTimeout(() => {
                        this.game.showEndScreen('lose');
                    }, 2000);
                }
            }
            return; // Stoppe weitere Logik
        }

        if (this.game.boss && this.game.boss.health <= 0) {
            this.tickCount++;
            this.switchAnimation('sleep');
            if (this.tickCount >= this.frameSpeed) {
                this.tickCount = 0;
                this.currentFrame = Math.min(this.currentFrame + 1, this.currentFrames.length - 1);

                // Todesanimation abgeschlossen
                if (this.currentFrame === this.currentFrames.length - 1) {
                    setTimeout(() => {
                        this.game.showEndScreen('win');
                    }, 3000);
                }
            }
            return; // Stoppe weitere Logik
        };


        if (this.up) this.y -= this.speed;
        if (this.down) this.y += this.speed;
        this.y = Math.max(-115, Math.min(canvas.height - (this.height - 60), this.y));

        if (this.isInCollision) {
            this.collisionAnimationTimer--;
            if (this.collisionAnimationTimer <= 0) {
                if (this.health > 0) {
                    this.isInCollision = false;
                    this.switchAnimation('swim');
                } else {
                    this.isDead = true;
                }
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
                this.specialBullet = new Bullet(this.x + this.width, this.y + this.height / 2 - 15, this.isSpecialShooting, this.isBuffed); // Setze den Schaden auf 2
                this.specialBullet.width *= 2;
                this.specialBullet.height *= 2;
                this.specialBullet.speed = 0;
                this.game.bullets.push(this.specialBullet);
                this.switchAnimation('special');
                this.isSpecialShooting = false;
            }

            if (this.currentFrames === this.hitFrames && this.currentFrame === this.hitFrames.length - 1) {
                if (this.specialBullet) {
                    this.specialBullet.speed = 10 * GAME_SPEED;
                    this.specialBullet = null;
                }
                this.isSpecialActive = false;
                this.switchAnimation('swim');
            }

            if (this.currentFrames === this.shootFrames && this.currentFrame === this.shootFrames.length - 1 && !this.isSpecialActive) {
                if (this.isShooting) {
                    this.game.bullets.push(new Bullet(this.x + this.width - 60, this.y + this.height - 110, this.isSpecialShooting, this.isBuffed));
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

        this.hitbox = { x: this.x + 60, y: this.y + 120, width: this.width - 110, height: this.height - 180 };
    }

    handleCollisionWithEnemy(enemy) {
        if (enemy.isDying || this.isInCollision || this.isDead) return; // Keine weitere Kollisionen verarbeiten, wenn tot
        this.health--; // Ziehe ein Leben ab
        if (this.specialBullet) {
            this.game.bullets.pop();
        }
        if (this.health <= 0) {
            this.isDead = true; // Spielerstatus auf tot setzen
            this.startCollisionAnimation(enemy.constructor.name === 'JellyFish' ? 'deathByJellyFish' : 'deathByPufferFish');
        } else {
            this.startCollisionAnimation(enemy.constructor.name);
        }
        this.updateUI();
    }

    draw(ctx) {
        const currentFrame = this.currentFrames[this.currentFrame];
        if (currentFrame.isLoaded && !currentFrame.broken) {
            ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
        }
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    }

    isCollidingWith(other) {
        const playerHitbox = this.hitbox;
        const otherHitbox = other.hitbox;

        return (
            playerHitbox.x < otherHitbox.x + otherHitbox.width &&
            playerHitbox.x + playerHitbox.width > otherHitbox.x &&
            playerHitbox.y < otherHitbox.y + otherHitbox.height &&
            playerHitbox.y + playerHitbox.height > otherHitbox.y
        );
    }

    updateUI() {
        document.getElementById('health').innerText = `${this.health}`;
        document.getElementById('potions').innerText = `${this.potions}`;
        document.getElementById('score').innerText = `${this.coins}`;
    }
}