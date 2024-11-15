import { GAME_SPEED, loadImage } from '../main.js';
import Enemy from './Enemy';
import Poison from './poison.js';

const animations = {
    purple: {
        swim: ['/assets/enemy/jellyFish/regular/lila1.png', '/assets/enemy/jellyFish/regular/lila2.png', '/assets/enemy/jellyFish/regular/lila3.png', '/assets/enemy/jellyFish/regular/lila4.png'],
        die: ['/assets/enemy/jellyFish/dead/Lila/L1.png', '/assets/enemy/jellyFish/dead/Lila/L2.png', '/assets/enemy/jellyFish/dead/Lila/L3.png', '/assets/enemy/jellyFish/dead/Lila/L4.png']
    },
    yellow: {
        swim: ['/assets/enemy/jellyFish/regular/yellow1.png', '/assets/enemy/jellyFish/regular/yellow2.png', '/assets/enemy/jellyFish/regular/yellow3.png', '/assets/enemy/jellyFish/regular/yellow4.png'],
        die: ['/assets/enemy/jellyFish/dead/Yellow/y1.png', '/assets/enemy/jellyFish/dead/Yellow/y2.png', '/assets/enemy/jellyFish/dead/Yellow/y3.png', '/assets/enemy/jellyFish/dead/Yellow/y4.png']
    },
    green: {
        swim: ['/assets/enemy/jellyFish/dangerous/green1.png', '/assets/enemy/jellyFish/dangerous/green2.png', '/assets/enemy/jellyFish/dangerous/green3.png', '/assets/enemy/jellyFish/dangerous/green4.png'],
        die: ['/assets/enemy/jellyFish/dead/green/g1.png', '/assets/enemy/jellyFish/dead/green/g2.png', '/assets/enemy/jellyFish/dead/green/g3.png', '/assets/enemy/jellyFish/dead/green/g4.png']
    },
    pink: {
        swim: ['/assets/enemy/jellyFish/dangerous/pink1.png', '/assets/enemy/jellyFish/dangerous/pink2.png', '/assets/enemy/jellyFish/dangerous/pink3.png', '/assets/enemy/jellyFish/dangerous/pink4.png'],
        die: ['/assets/enemy/jellyFish/dead/Pink/P1.png', '/assets/enemy/jellyFish/dead/Pink/P2.png', '/assets/enemy/jellyFish/dead/Pink/P3.png', '/assets/enemy/jellyFish/dead/Pink/P4.png']
    }
};

export default class JellyFish extends Enemy {
    constructor(game) {
        const jellyFishType = Math.random();
        let type;
        if (jellyFishType < 0.5) {
            type = jellyFishType < 0.25 ? 'green' : 'pink';
        } else {
            type = jellyFishType < 0.75 ? 'yellow' : 'purple';
        }

        super(animations[type]);

        this.game = game;
        this.type = type;
        this.width = 150;
        this.height = 150;
        this.health = 5;
        this.speed = (type === 'green' || type === 'pink') ? 6 * GAME_SPEED : 4 * GAME_SPEED; // Geschwindigkeit anpassen
        this.frameSpeed = 12.5 / GAME_SPEED; // Frame-Geschwindigkeit anpassen
        this.tickCount = 0;
        this.x = canvas.width; // Startposition am rechten Rand des Canvas
        this.y = Math.random() * (canvas.height - this.height); // Zufällige y-Position
    }

    update() {
        if (this.isDying) {
            this.y -= this.speed / 2; // Adjust the speed as needed
            this.frameTick++;
            if (this.frameTick >= this.frameSpeed) {
                this.frameTick = 0;
                if (this.currentFrameIndex < this.frames.length - 1) {
                    this.currentFrameIndex++;
                }
            }
        } else {
            this.x -= this.speed;

            if (this.isLoaded) {
                this.tickCount++;
                if (this.tickCount >= this.frameSpeed) {
                    this.tickCount = 0;
                    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
                }
            }
        }

    }

    getHitbox() {
        if (this.isDying) {
            return { x: 0, y: 0, width: 0, height: 0 }; // Return an empty hitbox when dying
        }
        return {
            x: this.x + 20,
            y: this.y + 15,
            width: this.width - 40,
            height: this.height - 40
        };
    }

    onCollisionWithBullet() {
        this.health--;
        if (this.health <= 0) this.die();
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

        const poison = new Poison(this.x, this.y);
        this.game.poisons.push(poison);
    }
}