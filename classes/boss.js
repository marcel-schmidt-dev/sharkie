import { GAME_SPEED } from '../main';
import Enemy from './enemy';
import { imageCache } from '../utils/preload';
import playSound from '../utils/sound';

const animations = {
    transition: [...Array(10).keys()].map(i => `./assets/enemy/boss/introduce/${i + 1}.png`),
    swim: [...Array(13).keys()].map(i => `./assets/enemy/boss/floating/${i + 1}.png`),
    die: [...Array(6).keys()].map(i => `./assets/enemy/boss/dead/${i + 1}.png`),
    attack: [...Array(6).keys()].map(i => `./assets/enemy/boss/attack/${i + 1}.png`)
};

export default class Boss extends Enemy {
    /**
     * Creates an instance of the Boss class.
     * 
     * @constructor
     * @param {Object} game - The game instance.
     * @property {Object} game - The game instance.
     * @property {number} width - The width of the boss, calculated as 40% of the canvas width.
     * @property {number} height - The height of the boss, calculated as 40% of the canvas width.
     * @property {number} speed - The speed of the boss, calculated based on canvas width and game speed.
     * @property {number} health - The health of the boss, initialized to 100.
     * @property {number} x - The x-coordinate of the boss, initialized to the right edge of the canvas.
     * @property {number} y - The y-coordinate of the boss, initialized to 0.
     * @property {boolean} movingDown - Indicates if the boss is moving down, initialized to true.
     * @property {null|string} attackPhase - The current attack phase of the boss, initialized to null.
     * @property {number} standbyTime - The standby time before the boss attacks, initialized to 500ms.
     * @property {boolean} isAttacking - Indicates if the boss is currently attacking, initialized to false.
     * @property {boolean} isReturning - Indicates if the boss is returning to its original position, initialized to false.
     * @property {number} attackCooldown - The cooldown time before the boss can attack again, initialized to a random value.
     * @property {Object} originalPosition - The original position of the boss, containing x and y coordinates.
     * @property {null|Object} targetPosition - The target position of the boss during an attack, initialized to null.
     * @property {number} lastUpdateTime - The last update time of the boss, initialized to the current time.
     * @property {Object} hitbox - The hitbox of the boss, created using the createHitbox method.
     * @property {string} currentAnimation - The current animation state of the boss, initialized to 'transition'.
     * @property {number} frameTick - The current frame tick for animations, initialized to 0.
     * @property {number} frameSpeed - The speed of the frame updates for animations, calculated based on game speed.
     * @property {number} attackFrameSpeed - The speed of the frame updates during attacks, calculated based on game speed.
     */
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
        this.attackPhase = null;
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

    /**
     * Creates a hitbox object for the boss character.
     * 
     * @returns {Object} The hitbox object with properties:
     * - `x` {number}: The x-coordinate of the hitbox.
     * - `y` {number}: The y-coordinate of the hitbox.
     * - `width` {number}: The width of the hitbox.
     * - `height` {number}: The height of the hitbox.
     */
    createHitbox() {
        return {
            x: this.x + this.width / 12,
            y: this.y + this.height / 2,
            width: this.width / 1.2,
            height: this.height / 3
        };
    }

    /**
     * Generates a random cooldown time between 5000 and 10000 milliseconds.
     * 
     * @returns {number} A random cooldown time in milliseconds.
     */
    getRandomCooldown() {
        return Math.floor(Math.random() * 5000) + 5000;
    }

    /**
     * Updates the state of the boss character.
     * 
     * @param {number} deltaTime - The time elapsed since the last update.
     * 
     * This method handles the following:
     * - Updates the health bar.
     * - Handles the dying state if the boss is dying.
     * - Returns the boss to its original position if it is returning.
     * - Performs an attack if the boss is attacking.
     * - Handles the idle state if none of the above conditions are met.
     * - Updates the hitbox of the boss.
     */
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

    /**
     * Updates the hitbox of the object by creating a new hitbox.
     * This method should be called whenever the object's dimensions or position change.
     */
    updateHitbox() {
        this.hitbox = this.createHitbox();
    }

    /**
     * Handles the dying animation and movement of the boss character.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to ensure consistent movement regardless of frame rate.
     */
    handleDying(deltaTime) {
        this.y -= (this.speed / 2) * deltaTime;
        this.x -= (this.speed * 2) * deltaTime;
        this.advanceAnimation(deltaTime);
    }

    /**
     * Handles the idle state of the boss character.
     * Decreases the attack cooldown by the elapsed time.
     * If the attack cooldown reaches zero or below, starts an attack.
     * Otherwise, continues patrolling.
     *
     * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
     */
    handleIdle(deltaTime) {
        this.attackCooldown -= deltaTime * 1000;
        if (this.attackCooldown <= 0) {
            this.startAttack();
        } else {
            this.patrol(deltaTime);
        }
    }

    /**
     * Patrols the boss character up and down within the canvas boundaries.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to ensure consistent movement speed.
     */
    patrol(deltaTime) {
        this.y += this.movingDown ? this.speed * deltaTime : -this.speed * deltaTime;
        if (this.movingDown && this.hitbox.y + this.hitbox.height >= canvas.height) {
            this.movingDown = false;
        } else if (!this.movingDown && this.hitbox.y <= 0) {
            this.movingDown = true;
        }
        this.updateAnimation(deltaTime);
    }

    /**
     * Initiates the boss attack sequence.
     * 
     * This method sets the player's position, marks the boss as attacking,
     * sets the attack phase to 'announce', switches to the attack animation,
     * resets the current frame index, and plays the boss attack sound.
     */
    startAttack() {
        this.setPlayerPosition();
        this.isAttacking = true;
        this.attackPhase = 'announce';
        this.switchToAnimation('attack');
        this.currentFrameIndex = 0;
        this.announceStartTime = null;
        playSound('bossAttack');
    }

    /**
     * Sets the target position for the boss based on the player's current position.
     * The target position is calculated to position the boss relative to the player's hitbox.
     */
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

    /**
     * Performs the attack sequence for the boss character.
     * The attack sequence consists of three phases: 'announce', 'attack', and 'retreat'.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to update the attack sequence.
     */
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

    /**
     * Handles the announce phase of the boss.
     * During the announce phase, the boss updates its animation until a certain frame is reached.
     * Once the frame is reached, the announce start time is recorded.
     * If the announce start time is already recorded, it checks if the elapsed time has passed the standby time.
     * If the elapsed time has passed the standby time, it transitions to the attack phase.
     *
     * @param {number} deltaTime - The time elapsed since the last frame update.
     */
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

    /**
     * Moves the boss character towards the target position.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame, used to ensure consistent movement speed.
     */
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

    /**
     * Ends the attack sequence for the boss character.
     * 
     * This method sets the `isAttacking` flag to false, 
     * the `isReturning` flag to true, switches the animation 
     * to 'swim', and updates the `lastUpdateTime` to the current time.
     */
    endAttack() {
        this.isAttacking = false;
        this.isReturning = true;
        this.switchToAnimation('swim');
        this.lastUpdateTime = Date.now();
    }

    /**
     * Moves the object back to its original position at a speed proportional to the delta time.
     * If the object is close enough to its original position, it snaps to the original position,
     * stops the returning process, and sets a new attack cooldown.
     *
     * @param {number} deltaTime - The time elapsed since the last frame, used to ensure smooth movement.
     */
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

    /**
     * Switches the current animation to the specified animation.
     * If the specified animation is different from the current one,
     * it updates the current animation, frames, current frame index, and frame tick.
     *
     * @param {string} animation - The name of the animation to switch to.
     */
    switchToAnimation(animation) {
        if (this.currentAnimation !== animation) {
            this.currentAnimation = animation;
            this.frames = this.animations[this.currentAnimation].map(src => imageCache[src]);
            this.currentFrameIndex = 0;
            this.frameTick = 0;
        }
    }

    /**
     * Updates the animation frame based on the elapsed time.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame update.
     * 
     * This method increments the frame tick by the elapsed time and checks if it has reached the speed threshold for the current animation.
     * If the threshold is reached, it resets the frame tick and updates the current frame index.
     * 
     * If the current animation is 'transition', it increments the frame index until the end of the frames array, then switches to the 'swim' animation.
     * Otherwise, it loops through the frames array based on the frame speed.
     */
    updateAnimation(deltaTime) {
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

    /**
     * Advances the phase of the boss by updating the animation and checking if the current frame index
     * is greater than or equal to the given delta time.
     *
     * @param {number} deltaTime - The time elapsed since the last update.
     * @returns {boolean} - Returns true if the current frame index is greater than or equal to deltaTime, otherwise false.
     */
    advancePhase(deltaTime) {
        this.advanceAnimation(deltaTime);
        return this.currentFrameIndex >= deltaTime;
    }

    /**
     * Advances the animation frame based on the elapsed time.
     *
     * @param {number} deltaTime - The time elapsed since the last frame update.
     */
    advanceAnimation(deltaTime) {
        this.frameTick += deltaTime;
        const speed = this.currentAnimation === 'attack' ? this.attackFrameSpeed : this.frameSpeed;

        if (this.frameTick >= speed) {
            this.frameTick = 0;
            this.currentFrameIndex = Math.min(this.currentFrameIndex + 1, this.frames.length - 1);
        }
    }

    /**
     * Updates the width of the boss's health bar based on the current health.
     * 
     * This function calculates the health percentage of the boss and adjusts
     * the width of the health bar element accordingly.
     * 
     * @function
     */
    handleHealthBar() {
        const healthBar = document.getElementById('boss-bar');
        const maxHealth = 100;
        const healthPercentage = (this.health / maxHealth) * 100;
        healthBar.style.width = `${healthPercentage}%`;
    }
}
