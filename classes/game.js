import { canvas, GAME_SPEED } from '../main.js';
import JellyFish from './JellyFish';
import PufferFish from './PufferFish';
import Player from './Player';
import BackgroundLayer from './BackgroundLayer';
import Boss from './Boss';
import { backgroundAudio } from '../main.js';
import playSound from '../utils/sound.js';
import { muted } from '../main.js';

/**
 * Class representing the game.
*/
export default class Game {
    /**
     * Create a game.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
    */
    constructor(ctx) {
        this.initializeProperties(ctx);
        this.initializeBackgroundLayers();
        this.initializeLightImage();
        this.initializeEventListeners();
    }


    /**
     * Initializes the properties of the Game instance.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the game.
     * @property {CanvasRenderingContext2D} ctx - The rendering context for the game.
     * @property {Player} player - The player instance.
     * @property {Array} enemies - The array of enemy instances.
     * @property {Array} bullets - The array of bullet instances.
     * @property {Array} coins - The array of coin instances.
     * @property {Array} poisons - The array of poison instances.
     * @property {number} lastEnemySpawn - The timestamp of the last enemy spawn.
     * @property {boolean} isRunning - The state of the game (running or not).
     * @property {number} backgroundLayerCounter - The counter for background layers.
     * @property {number} levelTimeOut - The timeout for the level.
     * @property {boolean} bossSpawned - Indicates if the boss has been spawned.
     * @property {Object|null} boss - The boss instance or null if not spawned.
     * @property {boolean} endScreenVisible - Indicates if the end screen is visible.
     * @property {number} startTime - The timestamp when the game started.
     * @property {number} lastUpdateTime - The timestamp of the last update.
     */
    initializeProperties(ctx) {
        this.ctx = ctx;
        this.player = new Player(this);
        this.enemies = [];
        this.bullets = [];
        this.coins = [];
        this.poisons = [];
        this.lastEnemySpawn = Date.now();
        this.isRunning = false;
        this.backgroundLayerCounter = 0;
        this.levelTimeOut = 1;
        this.bossSpawned = false;
        this.boss = null;
        this.endScreenVisible = false;
        this.startTime = Date.now();
        this.lastUpdateTime = Date.now();
    }

    /**
     * Initialize background layers.
    */
    initializeBackgroundLayers() {
        this.backgroundLayers = [
            new BackgroundLayer('./assets/background/Layers/water/D.png', canvas.width * 0.2),
            new BackgroundLayer('./assets/background/Layers/fondo2/D.png', canvas.width * 0.16),
            new BackgroundLayer('./assets/background/Layers/fondo1/D.png', canvas.width * 0.23),
            new BackgroundLayer('./assets/background/Layers/floor/D.png', canvas.width * 0.3)
        ];
    }

    /**
     * Initialize the light image.
    */
    initializeLightImage() {
        this.lightImage = new Image();
        this.lightImage.src = './assets/background/Layers/light/COMPLETO.png';
        this.lightImageX = canvas.width;
        this.lightImageSpeed = canvas.width * 0.001 * GAME_SPEED;
    }


    /**
     * Initializes event listeners for touch controls.
     * Maps touch events to corresponding keyboard events.
     * 
     * @method initializeEventListeners
     * @memberof Game
     */
    initializeEventListeners() {
        this.addTouchEventListener('touch-up', 'ArrowUp');
        this.addTouchEventListener('touch-down', 'ArrowDown');
        this.addTouchEventListener('touch-shoot', ' ');
        this.addTouchEventListener('touch-special', 'e');
    }

    /**
     * Adds touch event listeners to an element to handle player movement.
     *
     * @param {string} elementId - The ID of the HTML element to attach the event listeners to.
     * @param {string} key - The key representing the direction or action for the player.
     */
    addTouchEventListener(elementId, key) {
        document.getElementById(elementId).addEventListener('touchstart', () => this.player.move({ key }));
        document.getElementById(elementId).addEventListener('touchend', () => this.player.stop({ key }));
    }

    /**
     * Starts the game by setting the running state to true, initiating the game loop,
     * and playing the background audio if it is not muted.
     */
    start() {
        this.isRunning = true;
        requestAnimationFrame(() => this.update());
        if (!muted) backgroundAudio.play();
    }

    /**
     * Stops the game by setting the running state to false,
     * removing event listeners, and pausing the background audio.
     */
    stop() {
        this.isRunning = false;
        this.removeEventListeners();
        backgroundAudio.pause();
    }

    /**
     * Removes event listeners for player controls.
     * 
     * This method detaches the event listeners for "keydown", "keyup", and "keypress" events
     * that were previously attached to the player controls. It ensures that the player
     * will no longer respond to these keyboard events.
     */
    removeEventListeners() {
        document.removeEventListener("keydown", this.player.move.bind(this.player));
        document.removeEventListener("keyup", this.player.stop.bind(this.player));
        document.removeEventListener("keypress", this.player.HandleBuff.bind(this.player));
    }

    /**
     * Updates the game state and renders the game elements.
     * This method is called recursively using requestAnimationFrame
     * to create a game loop.
     */
    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.updateGameElements(deltaTime);
        if (this.isRunning) requestAnimationFrame(() => this.update());
    }

    /**
     * Updates all game elements based on the elapsed time since the last update.
     *
     * @param {number} deltaTime - The time elapsed since the last update in milliseconds.
     */
    updateGameElements(deltaTime) {
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        if (elapsedTime >= this.levelTimeOut) this.handleLevelTimeout();
        this.updateBackgroundLayers(deltaTime);
        this.updateBullets(deltaTime);
        this.updateEnemies(deltaTime);
        this.updatePlayer(deltaTime);
        if (this.bossSpawned) this.updateBoss(deltaTime);
        this.updateCoins(deltaTime);
        this.updatePoisons(deltaTime);
        this.checkCollisions();
        this.updateLightImage();
        if (elapsedTime < this.levelTimeOut) this.spawnEnemies();
    }

    /**
     * Handles the timeout event for the current level.
     * 
     * This function stops the movement of background layers and the light image,
     * and moves enemies off-screen by setting their hitbox to an off-screen position
     * and reducing their x-coordinate. If the boss has not been spawned yet, it will
     * spawn the boss.
     */
    handleLevelTimeout() {
        this.backgroundLayers.forEach(layer => layer.speed = 0);
        this.lightImageSpeed = 0;
        this.enemies.forEach(enemy => {
            enemy.hitbox = { x: -100, y: -100, width: 0, height: 0 };
            enemy.x -= GAME_SPEED * 3;
        });
        if (!this.bossSpawned) this.spawnBoss();
    }

    /**
     * Spawns the boss in the game.
     * Initializes a new Boss instance, sets the bossSpawned flag to true,
     * and displays the boss health bar container.
     */
    spawnBoss() {
        this.boss = new Boss(this);
        this.bossSpawned = true;
        document.getElementById('boss-bar-container').style.display = 'flex';
    }

    /**
     * Updates and draws each background layer.
     *
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    updateBackgroundLayers(deltaTime) {
        this.backgroundLayers.forEach(layer => {
            layer.update(deltaTime);
            layer.draw(this.ctx);
        });
    }

    /**
     * Updates the state of all bullets, removing any that have collided or are out of bounds.
     *
     * @param {number} deltaTime - The time elapsed since the last update, used to update bullet positions.
     */
    updateBullets(deltaTime) {
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.isCollided) return false;
            bullet.update(deltaTime);
            bullet.draw(this.ctx);
            return bullet.isInBounds();
        });
    }

    /**
     * Updates the state of all enemies in the game.
     * 
     * This method filters out enemies that are out of bounds and updates the remaining enemies.
     * Each enemy's state is updated based on the provided delta time, and then each enemy is drawn on the canvas.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, used to update the enemies' state.
     */
    updateEnemies(deltaTime) {
        this.enemies = this.enemies.filter(enemy => enemy.isInBounds());
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            enemy.draw(this.ctx);
        });
    }

    /**
     * Updates the player state and renders the player on the canvas.
     *
     * @param {number} deltaTime - The time elapsed since the last update, used to update the player's state.
     */
    updatePlayer(deltaTime) {
        this.player.update(deltaTime);
        this.player.draw(this.ctx);
    }

    /**
     * Updates and draws the boss character.
     *
     * @param {number} deltaTime - The time elapsed since the last update, used for animations and movements.
     */
    updateBoss(deltaTime) {
        this.boss.update(deltaTime);
        this.boss.draw(this.ctx);
    }

    /**
     * Updates the state of all coins in the game.
     * 
     * This method filters out coins that are out of bounds, updates the remaining coins,
     * draws them on the canvas, and checks for collisions with the player. If a collision
     * is detected, it handles the coin collision.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, used to update the coin positions.
     */
    updateCoins(deltaTime) {
        this.coins = this.coins.filter(coin => coin.isInBounds());
        this.coins.forEach(coin => {
            coin.update(deltaTime);
            coin.draw(this.ctx);
            if (coin.isCollidingWith(this.player)) this.handleCoinCollision(coin);
        });
    }

    /**
     * Handles the collision between the player and a coin.
     * 
     * This function is called when the player collides with a coin. It plays a sound,
     * removes the coin from the game, increments the player's coin count, and updates the UI.
     * 
     * @param {Object} coin - The coin object that the player has collided with.
     */
    handleCoinCollision(coin) {
        playSound('coin');
        this.coins.splice(this.coins.indexOf(coin), 1);
        this.player.coins++;
        this.player.updateUI();
    }

    /**
     * Updates the poisons in the game.
     * 
     * This method filters out poisons that are out of bounds, updates the state of each poison,
     * draws each poison on the canvas, and handles collisions between poisons and the player.
     * 
     * @param {number} deltaTime - The time elapsed since the last update, used to update poison positions.
     */
    updatePoisons(deltaTime) {
        this.poisons = this.poisons.filter(poison => poison.isInBounds());
        this.poisons.forEach(poison => {
            poison.update(deltaTime);
            poison.draw(this.ctx);
            if (poison.isCollidingWith(this.player)) this.handlePoisonCollision(poison);
        });
    }

    /**
     * Handles the collision between the player and a poison object.
     * Plays the poison sound, removes the poison from the poisons array,
     * increments the player's potion count, and updates the player's UI.
     *
     * @param {Object} poison - The poison object that the player collides with.
     */
    handlePoisonCollision(poison) {
        playSound('poison');
        this.poisons.splice(this.poisons.indexOf(poison), 1);
        this.player.potions++;
        this.player.updateUI();
    }

    /**
     * Updates the position of the light image and draws it on the canvas.
     * 
     * This function moves the light image to the left by decreasing its x-coordinate
     * by the value of `lightImageSpeed`. If the image moves completely out of the canvas
     * on the left side, it resets its position to the right edge of the canvas.
     * 
     * If the light image is fully loaded and not broken, it draws the image on the canvas
     * at the updated x-coordinate, scaling its width to half and stretching its height to
     * match the canvas height.
     */
    updateLightImage() {
        this.lightImageX -= this.lightImageSpeed;
        if (this.lightImageX + this.lightImage.width < 0) this.lightImageX = canvas.width;
        if (this.lightImage.complete && !this.lightImage.broken) {
            this.ctx.drawImage(this.lightImage, this.lightImageX, 0, this.lightImage.width / 2, canvas.height);
        }
    }

    /**
     * Spawns enemies at intervals based on the game speed and random spawn times.
     * 
     * This method checks the time elapsed since the last enemy spawn and spawns a new enemy if the elapsed time exceeds a threshold.
     * The threshold is determined by the game speed and a random spawn time between a minimum and maximum value.
     * 
     * @method
     */
    spawnEnemies() {
        if (Date.now() - this.lastEnemySpawn > 1000 / GAME_SPEED) {
            this.spawnEnemy();
            this.lastEnemySpawn = Date.now();
        }
        const minSpawnTime = 500;
        const maxSpawnTime = 1500;
        const randomSpawnTime = Math.random() * (maxSpawnTime - minSpawnTime) + minSpawnTime;
        if (Date.now() - this.lastEnemySpawn > randomSpawnTime / GAME_SPEED) {
            this.spawnEnemy();
            this.lastEnemySpawn = Date.now();
        }
    }

    /**
     * Displays the end screen based on the win condition.
     * Stops the game, shows the appropriate end screen (win or lose),
     * and makes the retry button visible.
     *
     * @param {string} winCondition - The condition of the game end, either 'win' or 'lose'.
     */
    showEndScreen(winCondition) {
        this.stop();
        const endScreen = document.getElementById('end-screen');
        if (winCondition === 'win') this.displayWinScreen(endScreen);
        else this.displayLoseScreen(endScreen);
        endScreen.style.display = 'block';
        document.getElementById('retry').style.display = 'block';
    }

    /**
     * Displays the win screen with the player's score.
     *
     * @param {HTMLImageElement} endScreen - The image element to display the win screen.
     */
    displayWinScreen(endScreen) {
        endScreen.src = './assets/buttons/Try again/win.png';
        const highscore = document.getElementById('highscore');
        highscore.innerText = `you scored: ${this.player.coins}`;
        highscore.style.display = 'block';
    }

    /**
     * Updates the source of the end screen image to display the lose screen.
     *
     * @param {HTMLImageElement} endScreen - The image element that displays the end screen.
     */
    displayLoseScreen(endScreen) {
        endScreen.src = './assets/buttons/Try again/lose.png';
    }

    /**
     * Spawns a new enemy if the level timeout has not been reached.
     * The enemy can be either a JellyFish or a PufferFish, determined randomly.
     */
    spawnEnemy() {
        if ((Date.now() - this.startTime) / 1000 >= this.levelTimeOut) return;
        const type = Math.random();
        let newEnemy = type < 0.25 ? new JellyFish(this) : new PufferFish(this);
        this.enemies.push(newEnemy);
    }

    /**
     * Checks for collisions in the game.
     * If the boss has not spawned, it checks for enemy collisions.
     * Otherwise, it checks for boss collisions.
     */
    checkCollisions() {
        if (!this.bossSpawned) this.checkEnemyCollisions();
        else this.checkBossCollisions();
    }

    /**
     * Checks for collisions between the player and enemies.
     * If a collision is detected, the player handles the collision with the enemy.
     * If no collision is detected, it checks for bullet collisions with the enemy.
     */
    checkEnemyCollisions() {
        this.enemies.forEach(enemy => {
            if (this.player.isCollidingWith(enemy)) this.player.handleCollisionWithEnemy(enemy);
            else this.checkBulletCollisions(enemy);
        });
    }

    /**
     * Checks for collisions between bullets and a specified enemy.
     * If a collision is detected, it handles the collision.
     *
     * @param {Object} enemy - The enemy object to check for collisions with bullets.
     */
    checkBulletCollisions(enemy) {
        this.bullets.forEach(bullet => {
            if (bullet.isCollidingWith(enemy)) enemy.handleCollisionWithBullet(bullet);
        });
    }

    /**
     * Checks for collisions between the player and the boss.
     * If a collision is detected, the player handles the collision with the boss.
     * If no collision is detected, checks for bullet collisions with the boss.
     */
    checkBossCollisions() {
        if (this.player.isCollidingWith(this.boss)) this.player.handleCollisionWithEnemy(this.boss);
        else this.checkBulletCollisions(this.boss);
    }
}