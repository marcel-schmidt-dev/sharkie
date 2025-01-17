import { canvas, GAME_SPEED } from '../main.js';
import Bullet from './Bullet';
import playSound from '../utils/sound.js';
import { imageCache } from '../utils/preload.js';

export default class Player {
    /**
     * Creates an instance of the Player class.
     * 
     * @constructor
     * @param {Object} game - The game instance.
     * @property {Object} game - The game instance.
     * @property {number} width - The width of the player.
     * @property {number} height - The height of the player.
     * @property {number} x - The x-coordinate of the player.
     * @property {number} y - The y-coordinate of the player.
     * @property {number} speed - The speed of the player.
     * @property {boolean} up - Indicates if the player is moving up.
     * @property {boolean} down - Indicates if the player is moving down.
     * @property {boolean} isShooting - Indicates if the player is shooting.
     * @property {boolean} isSpecialShooting - Indicates if the player is performing a special shot.
     * @property {boolean} isInCollision - Indicates if the player is in collision.
     * @property {boolean} isDead - Indicates if the player is dead.
     * @property {number} collisionAnimationTimer - Timer for collision animation.
     * @property {Array} swimFrames - Frames for swimming animation.
     * @property {Array} shootFrames - Frames for shooting animation.
     * @property {Array} hitFrames - Frames for hit animation.
     * @property {Array} jellyFishCollisionFrames - Frames for jellyfish collision animation.
     * @property {Array} pufferFishCollisionFrames - Frames for pufferfish collision animation.
     * @property {Array} deathByJellyFishFrames - Frames for death by jellyfish animation.
     * @property {Array} deathByPufferFishFrames - Frames for death by pufferfish animation.
     * @property {Array} sleepFrames - Frames for sleep animation.
     * @property {Array} currentFrames - Current frames for animation.
     * @property {number} currentFrame - Current frame index.
     * @property {number} frameSpeed - Speed of frame animation.
     * @property {number} shootFrameSpeed - Speed of shooting frame animation.
     * @property {number} deathFrameSpeed - Speed of death frame animation.
     * @property {number} tickCount - Tick count for animation.
     * @property {Object} hitbox - Hitbox of the player.
     * @property {boolean} isSpecialActive - Indicates if special ability is active.
     * @property {Array} animationQueue - Queue for animations.
     * @property {Object|null} specialBullet - Special bullet instance.
     * @property {number} potions - Number of potions the player has.
     * @property {number} health - Health of the player.
     * @property {number} coins - Number of coins the player has.
     * @property {boolean} isBuffed - Indicates if the player is buffed.
     * @property {boolean} isRepeatingSleepFrames - Indicates if sleep frames are repeating.
     */
    constructor(game) {
        this.game = game;
        this.width = canvas.width / 5;
        this.height = canvas.width / 5;
        this.x = 50;
        this.y = canvas.height / 2 - this.height / 2;
        this.speed = 500 * GAME_SPEED;
        this.up = false;
        this.down = false;
        this.isShooting = false;
        this.isSpecialShooting = false;
        this.isInCollision = false;
        this.isDead = false;
        this.collisionAnimationTimer = 0;
        this.swimFrames = this.loadFrames('./assets/sharkie/swim/', 6);
        this.shootFrames = this.loadFrames('./assets/sharkie/4.Attack/Bubble trap/Op2 (Without Bubbles)/', 7);
        this.hitFrames = this.loadFrames('./assets/sharkie/4.Attack/Fin slap/', 6);
        this.jellyFishCollisionFrames = this.loadFrames('./assets/sharkie/5.Hurt/2.Electric shock/', 3);
        this.pufferFishCollisionFrames = this.loadFrames('./assets/sharkie/5.Hurt/1.Poisoned/', 4);
        this.deathByJellyFishFrames = this.loadFrames('./assets/sharkie/6.dead/2.Electro_shock/', 10);
        this.deathByPufferFishFrames = this.loadFrames('./assets/sharkie/6.dead/1.Poisoned/', 12);
        this.sleepFrames = this.loadFrames('./assets/sharkie/2.Long_IDLE/', 13);
        this.currentFrames = this.swimFrames;
        this.currentFrame = 0;
        this.frameSpeed = 0.05 / GAME_SPEED;
        this.shootFrameSpeed = 0.03 / GAME_SPEED;
        this.deathFrameSpeed = 0.05 / GAME_SPEED;
        this.tickCount = 0;
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
        this.isSpecialActive = false;
        this.animationQueue = [];
        this.specialBullet = null;
        this.potions = 0;
        this.health = 3;
        this.coins = 0;
        this.isBuffed = false;
        this.isRepeatingSleepFrames = false;
        document.addEventListener("keydown", this.move.bind(this));
        document.addEventListener("keyup", this.stop.bind(this));
        document.addEventListener("keypress", this.HandleBuff.bind(this));
        this.updateUI();
    }

    /**
     * Loads a series of image frames from the cache.
     *
     * @param {string} basePath - The base path for the image files.
     * @param {number} frameCount - The number of frames to load.
     * @returns {Array} An array of image elements from the cache.
     */
    loadFrames(basePath, frameCount) {
        return Array.from({ length: frameCount }, (_, index) => {
            return imageCache[`${basePath}${index + 1}.png`];
        });
    }

    /**
     * Handles the buff event when a specific key is pressed.
     * 
     * @param {KeyboardEvent} event - The keyboard event that triggers the buff.
     * @property {string} event.key - The key that was pressed.
     * @property {number} this.potions - The number of potions the player has.
     * @property {boolean} this.isBuffed - Indicates if the player is currently buffed.
     * @method playSound - Plays a sound effect.
     * @method this.updateUI - Updates the user interface.
     */
    HandleBuff(event) {
        if (event.key === 'd' && this.potions > 0) {
            this.potions--;
            this.isBuffed = true;
            playSound('powerUp');
            this.updateUI();

            setTimeout(() => {
                this.isBuffed = false;
            }, 5000);
        }
    }

    /**
     * Handles the player's movement and actions based on keyboard input.
     * 
     * @param {KeyboardEvent} e - The keyboard event triggered by the user's input.
     * @returns {void}
     */
    move(e) {
        if (this.isDead) return;
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

    /**
     * Handles the stop event for the player, updating the player's state based on the key released.
     * 
     * @param {KeyboardEvent} e - The keyboard event triggered when a key is released.
     * @returns {void}
     */
    stop(e) {
        if (this.isDead) return;
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

    /**
     * Switches the player's animation based on the provided animation type.
     *
     * @param {string} animationType - The type of animation to switch to. 
     *                                 Possible values are 'shoot', 'swim', 'special', and 'sleep'.
     *                                 - 'shoot': Switches to shooting animation frames.
     *                                 - 'swim': Switches to swimming animation frames.
     *                                 - 'special': Switches to special hit animation frames.
     *                                 - 'sleep': Switches to sleeping animation frames and adjusts frame speed.
     */
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
            this.frameSpeed = 0.1;
            this.isRepeatingSleepFrames = false;
        }
        if (this.currentFrames !== frames) {
            this.currentFrames = frames;
            this.currentFrame = 0;
            this.tickCount = 0;
        }
    }

    /**
     * Starts the collision animation based on the type of collision.
     * Sets the appropriate frames and plays the corresponding sound.
     * 
     * @param {string} collisionType - The type of collision. Possible values are:
     *   'deathByJellyFish', 'deathByPufferFish', 'JellyFish', 'PufferFish'.
     */
    startCollisionAnimation(collisionType) {
        if (!this.isInCollision) {
            this.isInCollision = true;
            this.collisionAnimationTimer = 1500 / GAME_SPEED;

            if (collisionType === 'deathByJellyFish') {
                this.currentFrames = this.deathByJellyFishFrames;
                playSound('die');
            } else if (collisionType === 'deathByPufferFish') {
                this.currentFrames = this.deathByPufferFishFrames;
                playSound('die');
            } else {
                if (collisionType === 'JellyFish') {
                    this.currentFrames = this.jellyFishCollisionFrames;
                    playSound('hurtJellyFish');
                }
                else {
                    this.currentFrames = this.pufferFishCollisionFrames;
                    playSound('hurtPufferFish');
                }
            }

            this.currentFrame = 0;
            this.tickCount = 0;
            this.isSpecialActive = false;
            this.animationQueue = [];
        }
    }

    /**
     * Updates the player's state based on the elapsed time.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     * @returns {void}
     */
    update(deltaTime) {
        if (this.isDead) return this.handleDeathAnimation(deltaTime);
        if (this.game.boss && this.game.boss.health <= 0) return this.handleBossDefeatAnimation(deltaTime);
        this.handleMovement(deltaTime);
        this.handleCollision(deltaTime);
        this.handleShooting();
        this.updateAnimation(deltaTime);
        this.updateHitbox();
    }

    /**
     * Handles the death animation of the player.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame.
     * 
     * Increments the tick count by the elapsed time and updates the current frame of the death animation.
     * If the current frame reaches the last frame and the end screen is not visible, it sets the end screen to visible
     * and shows the end screen after a delay of 2 seconds.
     */
    handleDeathAnimation(deltaTime) {
        this.tickCount += deltaTime;
        if (this.tickCount >= this.deathFrameSpeed) {
            this.tickCount = 0;
            this.currentFrame = Math.min(this.currentFrame + 1, this.currentFrames.length - 1);
            if (this.currentFrame === this.currentFrames.length - 1 && !this.game.endScreenVisible) {
                this.game.endScreenVisible = true;
                setTimeout(() => this.game.showEndScreen('lose'), 2000);
            }
        }
    }

    /**
     * Handles the boss defeat animation by switching to the sleep animation and repeating certain frames.
     * It also triggers the end screen after the animation completes.
     *
     * @param {number} deltaTime - The time elapsed since the last frame update.
     */
    handleBossDefeatAnimation(deltaTime) {
        this.tickCount += deltaTime;
        if (!this.isRepeatingSleepFrames) this.switchAnimation('sleep');
        if (this.tickCount >= this.frameSpeed) {
            this.tickCount = 0;
            this.currentFrame++;
            if (this.isRepeatingSleepFrames) {
                if (this.currentFrame === this.sleepFrames.length) this.currentFrame = this.sleepFrames.length - 3;
            } else if (this.currentFrame === this.sleepFrames.length - 1) {
                this.isRepeatingSleepFrames = true;
                this.currentFrame = this.sleepFrames.length - 3;
            }
            if (this.currentFrame === this.currentFrames.length - 1 && !this.game.endScreenVisible) {
                this.game.endScreenVisible = true;
                setTimeout(() => this.game.showEndScreen('win'), 3000);
            }
        }
    }

    /**
     * Handles the movement of the player based on the current direction flags and delta time.
     * Adjusts the player's position on the y-axis and ensures the player stays within the canvas boundaries.
     *
     * @param {number} deltaTime - The time elapsed since the last frame, used to ensure consistent movement speed.
     */
    handleMovement(deltaTime) {
        if (this.up) this.y -= this.speed * deltaTime;
        if (this.down) this.y += this.speed * deltaTime;
        this.y = Math.max(0 - (this.hitbox.y - this.y), Math.min(canvas.height - (this.hitbox.y + this.hitbox.height - this.y), this.y));
    }

    /**
     * Handles the collision logic for the player.
     * 
     * @param {number} deltaTime - The time elapsed since the last frame in seconds.
     * 
     * This method checks if the player is currently in a collision state. If so, it decreases the collision animation timer
     * by the elapsed time. If the timer reaches zero, it checks the player's health. If the player has health remaining,
     * it ends the collision state and switches the animation to 'swim'. If the player has no health remaining, it sets the
     * player's state to dead.
     */
    handleCollision(deltaTime) {
        if (this.isInCollision) {
            this.collisionAnimationTimer -= deltaTime * 1000;
            if (this.collisionAnimationTimer <= 0) {
                if (this.health > 0) {
                    this.isInCollision = false;
                    this.switchAnimation('swim');
                } else {
                    this.isDead = true;
                }
            }
        }
    }

    /**
     * Handles the shooting action of the player.
     * 
     * This method checks if the player is not in collision, is currently shooting, 
     * and is not performing a special shooting action. If all conditions are met, 
     * it switches the player's animation to the 'shoot' animation.
     */
    handleShooting() {
        if (!this.isInCollision && this.isShooting && !this.isSpecialShooting) this.switchAnimation('shoot');
    }

    /**
     * Updates the animation of the player based on the delta time.
     * Increments the tick count by the delta time and updates the current frame
     * if the tick count exceeds the current frame speed. Handles special shooting,
     * hit frames, shooting frames, and the animation queue.
     *
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    updateAnimation(deltaTime) {
        this.tickCount += deltaTime;
        const currentFrameSpeed = this.currentFrames === this.shootFrames ? this.shootFrameSpeed : this.frameSpeed;
        if (this.tickCount >= currentFrameSpeed) {
            this.tickCount = 0;
            this.currentFrame = (this.currentFrame + 1) % this.currentFrames.length;
            this.handleSpecialShooting();
            this.handleHitFrames();
            this.handleShootingFrames();
            this.handleAnimationQueue();
        }
    }

    /**
     * Handles the special shooting action for the player.
     * When the player is in the special shooting state and the animation frame matches the shooting frame,
     * a special bullet is created and added to the game's bullets array.
     * The special bullet has increased size and no initial speed.
     * The player's animation is switched to the 'special' animation, and a sound effect is played.
     * The special shooting state is then reset.
     */
    handleSpecialShooting() {
        if (this.currentFrames === this.shootFrames && this.currentFrame === this.shootFrames.length - 1 && this.isSpecialShooting) {
            this.specialBullet = new Bullet(this.x + this.width, this.y + this.height / 2 - 15, this.isSpecialShooting, this.isBuffed);
            this.specialBullet.width *= 2;
            this.specialBullet.height *= 2;
            this.specialBullet.speed = 0;
            this.game.bullets.push(this.specialBullet);
            this.switchAnimation('special');
            playSound('specialBullet');
            this.isSpecialShooting = false;
        }
    }

    /**
     * Handles the hit frames for the player.
     * 
     * This method checks if the current frame is the last frame in the hit frames sequence.
     * If a special bullet is active, it sets its speed and deactivates it.
     * Finally, it switches the player's animation back to 'swim'.
     */
    handleHitFrames() {
        if (this.currentFrames === this.hitFrames && this.currentFrame === this.hitFrames.length - 1) {
            if (this.specialBullet) {
                this.specialBullet.speed = 10 * GAME_SPEED;
                this.specialBullet = null;
            }
            this.isSpecialActive = false;
            this.switchAnimation('swim');
        }
    }

    /**
     * Handles the shooting frames for the player character.
     * 
     * This method checks if the current frame matches the shooting frames and if the shooting animation has reached its last frame.
     * If the player is shooting, it plays the shooting sound and creates a new bullet, adding it to the game's bullets array.
     * If the player is not shooting, it switches the animation back to swimming.
     * 
     * @method handleShootingFrames
     */
    handleShootingFrames() {
        if (this.currentFrames === this.shootFrames && this.currentFrame === this.shootFrames.length - 1 && !this.isSpecialActive) {
            if (this.isShooting) {
                playSound('shooting');
                this.game.bullets.push(new Bullet(this.x + this.width * 0.8, this.y + this.height * 0.55, this.isSpecialShooting, this.isBuffed));
            } else {
                this.switchAnimation('swim');
            }
        }
    }

    /**
     * Handles the animation queue by switching to the next animation in the queue
     * if the current animation has finished playing.
     * 
     * If the next animation is 'special', it activates the special animation mode.
     */
    handleAnimationQueue() {
        if (this.animationQueue.length > 0 && this.currentFrame === this.currentFrames.length - 1) {
            const nextAnimation = this.animationQueue.shift();
            if (nextAnimation === 'special') this.isSpecialActive = true;
            this.switchAnimation(nextAnimation);
        }
    }

    /**
     * Updates the player's hitbox and the position of the special bullet if it is active.
     * 
     * If the special bullet is active, its position is updated relative to the player's position.
     * The player's hitbox is then updated based on the player's current position and dimensions.
     * 
     * @method updateHitbox
     */
    updateHitbox() {
        if (this.specialBullet && this.isSpecialActive) {
            this.specialBullet.x = this.x + this.width - 50;
            this.specialBullet.y = this.y + this.height / 2 - 15;
        }
        this.hitbox = { x: this.x + canvas.width * 0.05, y: this.y + canvas.width * 0.1, width: this.width * 0.5, height: this.height * 0.25 };
    }

    /**
     * Handles the collision between the player and an enemy.
     * 
     * @param {Object} enemy - The enemy object that the player collides with.
     * @param {boolean} enemy.isDying - Indicates if the enemy is currently dying.
     * @param {string} enemy.constructor.name - The name of the enemy's constructor.
     * 
     * @returns {void}
     */
    handleCollisionWithEnemy(enemy) {
        if (enemy.isDying || this.isInCollision || this.isDead) return;
        this.health--;
        if (this.specialBullet) {
            this.game.bullets.pop();
        }
        if (this.health <= 0) {
            this.isDead = true;
            this.startCollisionAnimation(enemy.constructor.name === 'JellyFish' ? 'deathByJellyFish' : 'deathByPufferFish');
        } else {
            this.startCollisionAnimation(enemy.constructor.name);
        }
        this.updateUI();
    }

    /**
     * Draws the current frame of the player on the given canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context where the player will be drawn.
     */
    draw(ctx) {
        const currentFrame = this.currentFrames[this.currentFrame];
        ctx.drawImage(currentFrame, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks if the player is colliding with another object.
     *
     * @param {Object} other - The other object to check collision with.
     * @param {Object} other.hitbox - The hitbox of the other object.
     * @param {number} other.hitbox.x - The x-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.y - The y-coordinate of the other object's hitbox.
     * @param {number} other.hitbox.width - The width of the other object's hitbox.
     * @param {number} other.hitbox.height - The height of the other object's hitbox.
     * @returns {boolean} True if the player is colliding with the other object, false otherwise.
     */
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

    /**
     * Updates the UI elements with the player's current health, potions, and score.
     * 
     * This method updates the text content of the HTML elements with the IDs 'health', 
     * 'potions', and 'score' to reflect the player's current health, number of potions, 
     * and score (coins) respectively.
     */
    updateUI() {
        document.getElementById('health').innerText = `${this.health}`;
        document.getElementById('potions').innerText = `${this.potions}`;
        document.getElementById('score').innerText = `${this.coins}`;
    }
}
