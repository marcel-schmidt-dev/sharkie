import { GAME_SPEED } from '../main';
import Enemy from './enemy';
import playSound from '../utils/sound';

const animations = {
    transition: [...Array(10).keys()].map(i => `./assets/enemy/boss/introduce/${i + 1}.png`),
    swim: [...Array(13).keys()].map(i => `./assets/enemy/boss/floating/${i + 1}.png`),
    die: [...Array(6).keys()].map(i => `./assets/enemy/boss/dead/${i + 1}.png`),
    attack: [...Array(6).keys()].map(i => `./assets/enemy/boss/attack/${i + 1}.png`)
};

export default class Boss extends Enemy {
    constructor(game) {
        super(animations);
        this.game = game;
        this.width = canvas.width * 0.4;
        this.height = canvas.width * 0.4;
        this.speed = this.canvas.width * 0.15 * GAME_SPEED;
        this.health = 100;
        this.x = canvas.width - this.width;
        this.y = 0;
        this.movingDown = true;
        this.attackPhase = null; // 'announce', 'attack', 'retreat'
        this.standbyTime = 500;
        this.isAttacking = false;
        this.isReturning = false;
        this.attackCooldown = this.getRandomCooldown();
        this.originalPosition = { x: this.x, y: this.y };
        this.targetPosition = null;
        this.lastUpdateTime = Date.now();
        this.hitbox = this.createHitbox();
        this.currentAnimation = 'transition';
        this.frameTick = 0;
        this.frameSpeed = 0.1 / GAME_SPEED;
        this.attackFrameSpeed = 0.1 / GAME_SPEED;
    }

    createHitbox() {
        return {
            x: this.x + this.width / 12,
            y: this.y + this.height / 2,
            width: this.width / 1.2,
            height: this.height / 3
        };
    }

    getRandomCooldown() {
        return Math.floor(Math.random() * 5000) + 5000;
    }

    update(deltaTime) {
        this.handleHealthBar();
        if (this.isDying) {
            this.handleDying(deltaTime);
        } else if (this.isReturning) {
            this.returnToOriginalPosition(deltaTime);
        } else if (this.isAttacking) {
            this.performAttack(deltaTime);
        } else {
            this.handleIdle(deltaTime);
        }
        this.updateHitbox();
    }

    updateHitbox() {
        this.hitbox = this.createHitbox();
    }

    handleDying(deltaTime) {
        this.y -= (this.speed / 2) * deltaTime;
        this.x -= (this.speed * 2) * deltaTime;
        this.advanceAnimation(deltaTime);
    }

    handleIdle(deltaTime) {
        this.attackCooldown -= deltaTime * 1000;

        if (this.attackCooldown <= 0) {
            this.startAttack();
        } else {
            this.patrol(deltaTime);
        }
    }

    patrol(deltaTime) {
        this.y += this.movingDown ? this.speed * deltaTime : -this.speed * deltaTime;
        if (this.movingDown && this.hitbox.y + this.hitbox.height >= canvas.height) {
            this.movingDown = false;
        } else if (!this.movingDown && this.hitbox.y <= 0) {
            this.movingDown = true;
        }
        this.updateAnimation(deltaTime);
    }

    startAttack() {
        this.setPlayerPosition();
        this.isAttacking = true;
        this.attackPhase = 'announce';
        this.switchToAnimation('attack');
        this.currentFrameIndex = 0;
        this.announceStartTime = null;
        playSound('bossAttack');
    }

    setPlayerPosition() {
        const player = this.game.player.hitbox;
        const bossCenterOffset = {
            x: this.hitbox.width / 2,
            y: this.hitbox.height / 2
        };

        this.targetPosition = {
            x: player.x + player.width / 2 - (bossCenterOffset.x - this.width / 4),
            y: player.y + player.height / 2 - (bossCenterOffset.y + this.height / 2)
        };
    }

    performAttack(deltaTime) {
        if (this.attackPhase === 'announce') {
            this.handleAnnouncePhase(deltaTime);
        } else if (this.attackPhase === 'attack') {
            this.moveToTarget(deltaTime);
        } else if (this.attackPhase === 'retreat') {
            if (this.advancePhase(this.frames.length - 1, deltaTime)) {
                this.endAttack();
            }
        }
    }

    handleAnnouncePhase(deltaTime) {
        if (!this.announceStartTime) {
            this.updateAnimation(deltaTime);
            if (this.currentFrameIndex >= 1) {
                this.announceStartTime = Date.now();
            }
        } else {
            const elapsedTime = Date.now() - this.announceStartTime;
            if (elapsedTime >= this.standbyTime) {
                this.attackPhase = 'attack';
            }
        }
    }

    moveToTarget(deltaTime) {
        const attackSpeed = this.speed * 4 * deltaTime;
        const directionX = this.targetPosition.x - this.x;
        const directionY = this.targetPosition.y - this.y;
        const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

        if (distance <= attackSpeed) {
            this.x = this.targetPosition.x;
            this.y = this.targetPosition.y;
            this.attackPhase = 'retreat';
        } else {
            this.x += (directionX / distance) * attackSpeed;
            this.y += (directionY / distance) * attackSpeed;
        }
    }


    endAttack() {
        this.isAttacking = false;
        this.isReturning = true;
        this.switchToAnimation('swim');
        this.lastUpdateTime = Date.now();
    }

    returnToOriginalPosition(deltaTime) {
        const speed = this.speed * 2 * deltaTime;
        const dx = this.originalPosition.x - this.x;
        const dy = this.originalPosition.y - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance > speed) {
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        } else {
            this.x = this.originalPosition.x;
            this.y = this.originalPosition.y;
            this.isReturning = false;
            this.attackCooldown = this.getRandomCooldown();
        }
        this.updateAnimation(deltaTime);
    }

    switchToAnimation(animation) {
        if (this.currentAnimation !== animation) {
            this.currentAnimation = animation;
            this.frames = this.loadImages(animations[animation]);
            this.currentFrameIndex = 0;
            this.frameTick = 0;
        }
    }

    updateAnimation(deltaTime) {
        if (!this.isLoaded) return;

        this.frameTick += deltaTime;
        const speed = this.currentAnimation === 'attack' ? this.attackFrameSpeed : this.frameSpeed;

        if (this.frameTick >= speed) {
            this.frameTick = 0;

            if (this.currentAnimation === 'transition') {
                if (this.currentFrameIndex < this.frames.length - 1) {
                    this.currentFrameIndex++;
                } else {
                    this.switchToAnimation('swim');
                }
            } else {
                this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
            }
        }
    }

    advancePhase(deltaTime) {
        this.advanceAnimation(deltaTime);
        return this.currentFrameIndex >= deltaTime;
    }

    advanceAnimation(deltaTime) {
        this.frameTick += deltaTime;
        const speed = this.currentAnimation === 'attack' ? this.attackFrameSpeed : this.frameSpeed;

        if (this.frameTick >= speed) {
            this.frameTick = 0;
            this.currentFrameIndex = Math.min(this.currentFrameIndex + 1, this.frames.length - 1);
        }
    }

    handleHealthBar() {
        const healthBar = document.getElementById('boss-bar');
        const maxHealth = 100;
        const healthPercentage = (this.health / maxHealth) * 100;
        healthBar.style.width = `${healthPercentage}%`;
    }
}
