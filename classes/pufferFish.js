import { GAME_SPEED, loadImage } from '../main';
import Enemy from './enemy';

const animations = {
    green: {
        swim: ['./assets/enemy/pufferFish/swim/1.swim1.png', './assets/enemy/pufferFish/swim/1.swim2.png', './assets/enemy/pufferFish/swim/1.swim3.png', './assets/enemy/pufferFish/swim/1.swim4.png', './assets/enemy/pufferFish/swim/1.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/1.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/1.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/1.transition1.png', './assets/enemy/pufferFish/transition/1.transition2.png', './assets/enemy/pufferFish/transition/1.transition3.png', './assets/enemy/pufferFish/transition/1.transition4.png', './assets/enemy/pufferFish/transition/1.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/1.1.png', './assets/enemy/pufferFish/die/1.2.png', './assets/enemy/pufferFish/die/1.3.png']
    },
    brown: {
        swim: ['./assets/enemy/pufferFish/swim/2.swim1.png', './assets/enemy/pufferFish/swim/2.swim2.png', './assets/enemy/pufferFish/swim/2.swim3.png', './assets/enemy/pufferFish/swim/2.swim4.png', './assets/enemy/pufferFish/swim/2.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/2.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/2.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/2.transition1.png', './assets/enemy/pufferFish/transition/2.transition2.png', './assets/enemy/pufferFish/transition/2.transition3.png', './assets/enemy/pufferFish/transition/2.transition4.png', './assets/enemy/pufferFish/transition/2.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/2.1.png', './assets/enemy/pufferFish/die/2.2.png', './assets/enemy/pufferFish/die/2.3.png']
    },
    pink: {
        swim: ['./assets/enemy/pufferFish/swim/3.swim1.png', './assets/enemy/pufferFish/swim/3.swim2.png', './assets/enemy/pufferFish/swim/3.swim3.png', './assets/enemy/pufferFish/swim/3.swim4.png', './assets/enemy/pufferFish/swim/3.swim5.png'],
        bubbleswim: ['./assets/enemy/pufferFish/bubbleswim/3.bubbleswim1.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim2.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim3.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim4.png', './assets/enemy/pufferFish/bubbleswim/3.bubbleswim5.png'],
        transition: ['./assets/enemy/pufferFish/transition/3.transition1.png', './assets/enemy/pufferFish/transition/3.transition2.png', './assets/enemy/pufferFish/transition/3.transition3.png', './assets/enemy/pufferFish/transition/3.transition4.png', './assets/enemy/pufferFish/transition/3.transition5.png'],
        die: ['./assets/enemy/pufferFish/die/3.1.png', './assets/enemy/pufferFish/die/3.2.png', './assets/enemy/pufferFish/die/3.3.png']
    }
};

export default class PufferFish extends Enemy {
    constructor(game) {
        const colors = Object.keys(animations);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        super(animations[randomColor]);

        this.game = game;
        this.fishType = 'pufferFish';
        this.color = randomColor;
        this.width = this.canvas.width / 14;
        this.height = this.canvas.width / 14;
        this.speed = 500 * GAME_SPEED;
        this.health = 2;
        this.currentAnimation = 'transition';
        this.frameTick = 0;
        this.frameSpeed = 10;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.hitbox;
    }

    update(deltaTime) {
        if (this.isDying) {
            this.frameSpeed = 0.1;
            this.y -= this.speed * deltaTime;
            this.frameTick += deltaTime;
            if (this.frameTick >= this.frameSpeed) {
                this.frameTick = 0;
                if (this.currentFrameIndex < this.frames.length - 1) {
                    this.currentFrameIndex++;
                }
            }
        } else {
            this.x -= this.speed * deltaTime;

            if (this.isLoaded) {
                this.frameTick++;
                if (this.frameTick >= this.frameSpeed) {
                    this.frameTick = 0;
                    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;

                    if (this.currentAnimation === 'transition' && this.currentFrameIndex === 0) {
                        this.frames = animations[this.color].bubbleswim.map(src => {
                            const img = loadImage(src);
                            img.onload = () => {
                                this.isLoaded = true;
                            };
                            img.onerror = () => {
                                img.broken = true;
                            };
                            return img;
                        });
                        this.currentAnimation = 'bubbleswim';
                    }
                }
            }
        }

        if (this.isDying) {
            this.hitbox = { x: 0, y: 0, width: 0, height: 0 };
        } else {
            this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
        }
    }

    draw(ctx) {
        super.draw(ctx);
    }

    onCollisionWithBullet() {
        this.health--;
        if (this.health <= 0) this.die();
    }
}