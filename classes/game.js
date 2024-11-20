import { GAME_SPEED } from '../main.js';
import JellyFish from './JellyFish';
import PufferFish from './PufferFish';
import Player from './Player';
import BackgroundLayer from './BackgroundLayer';
import Boss from './Boss';

export default class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.player = new Player(this);
        this.enemies = [];
        this.bullets = [];
        this.coins = [];
        this.poisons = [];
        this.lastEnemySpawn = Date.now();
        this.isRunning = true;
        this.backgroundLayerCounter = 0;
        this.levelTimeOut = 60;
        this.bossSpawned = false;
        this.boss = null;

        this.backgroundLayers = [
            new BackgroundLayer('/assets/background/Layers/water/D.png', 0.5 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/fondo2/D.png', 1 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/fondo1/D.png', 1.5 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/floor/D.png', 2 * GAME_SPEED)
        ];

        this.lightImage = new Image();
        this.lightImage.src = '/assets/background/Layers/light/COMPLETO.png';
        this.lightImageX = canvas.width;
        this.lightImageSpeed = 1 * GAME_SPEED;

        this.startTime = Date.now();
    }

    start() {
        requestAnimationFrame(() => this.update());
    }

    update() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        const elapsedTime = (Date.now() - this.startTime) / 1000;
        if (elapsedTime >= this.levelTimeOut) {
            this.backgroundLayers.forEach(layer => {
                layer.speed = 0;
            });
            this.lightImageSpeed = 0;

            this.enemies.forEach(enemy => {
                enemy.hitbox = { x: -100, y: -100, width: 0, height: 0 };
                enemy.x -= GAME_SPEED * 3;
            });

            if (!this.bossSpawned) {
                this.boss = new Boss(this);
                this.bossSpawned = true;
            }
        }

        // Background layers
        this.backgroundLayers.forEach(layer => {
            layer.update();
            layer.draw(this.ctx);
        });

        // Bullets
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.isCollided) {
                return false;
            }
            bullet.update();
            bullet.draw(this.ctx);
            return bullet.isInBounds();
        });

        // Enemies
        this.enemies = this.enemies.filter(enemy => enemy.isInBounds());
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw(this.ctx);
        });

        // Player
        this.player.update();
        this.player.draw(this.ctx);

        // Boss
        if (this.bossSpawned) {
            this.boss.update();
            this.boss.draw(this.ctx);
        }

        // Coins
        this.coins = this.coins.filter(coin => coin.isInBounds());
        this.coins.forEach(coin => {
            coin.update();
            coin.draw(this.ctx);
            if (coin.isCollidingWith(this.player)) {
                this.coins.splice(this.coins.indexOf(coin), 1);
                this.player.coins++;
                this.player.updateUI();
            }
        });

        // Poisons
        this.poisons = this.poisons.filter(poison => poison.isInBounds());
        this.poisons.forEach(poison => {
            poison.update();
            poison.draw(this.ctx);
            if (poison.isCollidingWith(this.player)) {
                this.poisons.splice(this.poisons.indexOf(poison), 1);
                this.player.potions++;
                this.player.updateUI();
            }
        });

        this.checkCollisions();

        this.lightImageX -= this.lightImageSpeed;
        if (this.lightImageX + this.lightImage.width < 0) {
            this.lightImageX = canvas.width; // Reset position to the right side
        }
        if (this.lightImage.complete && !this.lightImage.broken) {
            this.ctx.drawImage(this.lightImage, this.lightImageX, 0, this.lightImage.width / 2, canvas.height);
        }

        if (elapsedTime < this.levelTimeOut) {
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

        if (this.isRunning) requestAnimationFrame(() => this.update());
    }

    showEndScreen(winCondition) {
        this.isRunning = false;
        const endScreen = document.getElementById('end-screen');
        if (winCondition === 'win') {
            endScreen.src = '/assets/buttons/Try again/win.png'
        } else {
            endScreen.src = '/assets/buttons/Try again/lose.png'
        }
        endScreen.style.display = 'block';
        const retryBtn = document.getElementById('retry');
        retryBtn.style.display = 'block';
    }

    spawnEnemy() {
        if ((Date.now() - this.startTime) / 1000 >= this.levelTimeOut) {
            return;
        }

        const type = Math.random();
        let newEnemy;

        if (type < 0.25) {
            newEnemy = new JellyFish(this);
        } else {
            newEnemy = new PufferFish(this);
        }

        this.enemies.push(newEnemy);
    }

    checkCollisions() {
        if (!this.bossSpawned) {
            this.enemies.forEach(enemy => {
                if (this.player.isCollidingWith(enemy)) {
                    this.player.handleCollisionWithEnemy(enemy);
                } else {
                    this.bullets.forEach(bullet => {
                        if (bullet.isCollidingWith(enemy)) {
                            enemy.handleCollisionWithBullet(bullet);
                        }
                    });
                }
            });
        } else {
            if (this.player.isCollidingWith(this.boss)) {
                this.player.handleCollisionWithEnemy(this.boss);
            } else {
                this.bullets.forEach(bullet => {
                    if (bullet.isCollidingWith(this.boss)) {
                        this.boss.handleCollisionWithBullet(bullet);
                    }
                });
            }
        }
    }
}