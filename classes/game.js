import { GAME_SPEED } from '../main.js';
import JellyFish from './JellyFish';
import PufferFish from './PufferFish';
import Player from './Player';
import BackgroundLayer from './BackgroundLayer';
import Boss from './Boss'; // Importiere die Boss-Klasse

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
        this.backgroundLayerCounter = 0; // Zähler für die Hintergrundebenen
        this.levelTimeOut = 2; // Level-Timeout auf 60 Sekunden gesetzt
        this.bossSpawned = false; // Flagge, um zu überprüfen, ob der Boss gespawnt wurde

        this.backgroundLayers = [
            new BackgroundLayer('/assets/background/Layers/water/D.png', 0.5 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/fondo2/D.png', 1 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/fondo1/D.png', 1.5 * GAME_SPEED),
            new BackgroundLayer('/assets/background/Layers/floor/D.png', 2 * GAME_SPEED)
        ];

        // Statisches Lichtbild
        this.lightImage = new Image();
        this.lightImage.src = '/assets/background/Layers/light/COMPLETO.png';
        this.lightImageX = canvas.width; // Startposition des Lichtbilds rechts außerhalb des Canvas
        this.lightImageSpeed = 1 * GAME_SPEED; // Geschwindigkeit des Lichtbilds

        this.startTime = Date.now(); // Startzeit des Spiels
    }

    start() {
        requestAnimationFrame(() => this.update());
    }

    update() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Überprüfe, ob das Level-Timeout erreicht wurde
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        if (elapsedTime >= this.levelTimeOut) {
            // Setze die Geschwindigkeit der Hintergrundebenen auf 0
            this.backgroundLayers.forEach(layer => {
                layer.speed = 0;
            });
            this.lightImageSpeed = 0; // Stoppe auch das Lichtbild

            // Deaktiviere die Hitboxen der bestehenden Gegner und lasse sie aus dem Bild schwimmen
            this.enemies.forEach(enemy => {
                enemy.hasHitbox = false;
                enemy.x += enemy.speed; // Lasse die Gegner nach rechts aus dem Bild schwimmen
            });

            // Spawne den Boss, wenn er noch nicht gespawnt wurde
            if (!this.bossSpawned) {
                const boss = new Boss(this);
                this.enemies.push(boss);
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
            bullet.update();
            bullet.draw(this.ctx);
            return bullet.isInBounds() && !this.checkBulletCollision(bullet);
        });

        // Enemies
        this.enemies = this.enemies.filter(enemy => enemy.isInBounds());
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw(this.ctx); // Pass the ctx parameter to the draw method
        });

        // Player
        this.player.update();
        this.player.draw(this.ctx);

        // Coins
        this.coins = this.coins.filter(coin => coin.isInBounds());
        this.coins.forEach(coin => {
            coin.update();
            coin.draw(this.ctx);
            if (coin.isCollidingWith(this.player)) {
                this.coins.splice(this.coins.indexOf(coin), 1); // Entferne die Coin bei Kollision mit dem Spieler
            }
        });

        // Poisons
        this.poisons = this.poisons.filter(poison => poison.isInBounds());
        this.poisons.forEach(poison => {
            poison.update();
            poison.draw(this.ctx);
            if (poison.isCollidingWith(this.player)) {
                this.poisons.splice(this.poisons.indexOf(poison), 1); // Entferne die Coin bei Kollision mit dem Spieler
            }
        });

        // Collision checks
        this.checkCollisions();

        // Update and draw static light image
        this.lightImageX -= this.lightImageSpeed;
        if (this.lightImageX + this.lightImage.width < 0) {
            this.lightImageX = canvas.width; // Reset position to the right side
        }
        if (this.lightImage.complete && !this.lightImage.broken) {
            this.ctx.drawImage(this.lightImage, this.lightImageX, 0, this.lightImage.width / 2, canvas.height);
        }

        // Spawn new enemies
        if (elapsedTime < this.levelTimeOut) {
            if (Date.now() - this.lastEnemySpawn > 1000 / GAME_SPEED) {
                this.spawnEnemy();
                this.lastEnemySpawn = Date.now();
            }

            // Randomize spawn times
            const minSpawnTime = 500; // Minimum spawn time in milliseconds
            const maxSpawnTime = 1500; // Maximum spawn time in milliseconds
            const randomSpawnTime = Math.random() * (maxSpawnTime - minSpawnTime) + minSpawnTime;

            if (Date.now() - this.lastEnemySpawn > randomSpawnTime / GAME_SPEED) {
                this.spawnEnemy();
                this.lastEnemySpawn = Date.now();
            }
        }

        if (this.isRunning) requestAnimationFrame(() => this.update());
    }

    checkBulletCollision(bullet) {
        for (let enemy of this.enemies) {
            if (bullet.isCollidingWith(enemy)) {
                enemy.handleCollisionWithBullet(bullet);
                return true;
            }
        }
        return false;
    }

    spawnEnemy() {
        if ((Date.now() - this.startTime) / 1000 >= this.levelTimeOut) {
            return; // Keine neuen Gegner spawnen, wenn das Level-Timeout erreicht wurde
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
        this.enemies.forEach(enemy => {
            if (this.player.isCollidingWith(enemy)) {
                this.player.handleCollisionWithEnemy(enemy);
            }
        });
    }
}