import { GAME_SPEED, loadImage } from '../main';
import Enemy from './enemy';

const animations = {
    transition: [
        '/assets/enemy/boss/introduce/1.png',
        '/assets/enemy/boss/introduce/2.png',
        '/assets/enemy/boss/introduce/3.png',
        '/assets/enemy/boss/introduce/4.png',
        '/assets/enemy/boss/introduce/5.png',
        '/assets/enemy/boss/introduce/6.png',
        '/assets/enemy/boss/introduce/7.png',
        '/assets/enemy/boss/introduce/8.png',
        '/assets/enemy/boss/introduce/9.png',
        '/assets/enemy/boss/introduce/10.png',
    ],
    swim: [
        '/assets/enemy/boss/floating/1.png',
        '/assets/enemy/boss/floating/2.png',
        '/assets/enemy/boss/floating/3.png',
        '/assets/enemy/boss/floating/4.png',
        '/assets/enemy/boss/floating/5.png',
        '/assets/enemy/boss/floating/6.png',
        '/assets/enemy/boss/floating/7.png',
        '/assets/enemy/boss/floating/8.png',
        '/assets/enemy/boss/floating/9.png',
        '/assets/enemy/boss/floating/10.png',
        '/assets/enemy/boss/floating/11.png',
        '/assets/enemy/boss/floating/12.png',
        '/assets/enemy/boss/floating/13.png',
    ],
    die: [
        '/assets/enemy/boss/dead/1.png',
        '/assets/enemy/boss/dead/2.png',
        '/assets/enemy/boss/dead/3.png',
        '/assets/enemy/boss/dead/4.png',
        '/assets/enemy/boss/dead/5.png',
        '/assets/enemy/boss/dead/6.png',
    ]
};

export default class Boss extends Enemy {
    constructor(game) {
        super(animations);

        this.game = game;
        this.width = 500;
        this.height = 500;
        this.speed = 1 * GAME_SPEED; // Geschwindigkeit anpassen
        this.health = 2;
        this.currentAnimation = 'transition';
        this.frameTick = 0;
        this.frameSpeed = 10 / GAME_SPEED; // Frame-Geschwindigkeit anpassen
        this.x = canvas.width - this.width; // Startposition am rechten Rand des Canvas
        this.y = 0; // Zufällige y-Position
        this.transitionCompleted = false; // Flagge, um anzuzeigen, dass die transition-Animation abgeschlossen ist
        this.randomPosition = Math.floor(Math.random() * (canvas.height - this.height));
        this.tolerance = 5; // Toleranz in Pixeln

        // Lade die transition-Animation
        this.frames = animations.transition.map(src => {
            const img = loadImage(src);
            img.onload = () => {
                this.isLoaded = true;
            };
            img.onerror = () => {
                img.broken = true;
            };
            return img;
        });
    }

    update() {
        if (this.isDying) {
            // Move upwards when dying
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

            // Bewege den Boss zur zufälligen y-Position
            if (Math.abs(this.y - this.randomPosition) > this.tolerance) {
                if (this.y < this.randomPosition) {
                    this.y += this.speed;
                } else if (this.y > this.randomPosition) {
                    this.y -= this.speed;
                }
            } else {
                // Aktualisiere die zufällige Position, sobald die aktuelle Position erreicht ist
                this.randomPosition = Math.floor(Math.random() * (canvas.height - this.height));
            }

            if (this.isLoaded) {
                this.frameTick++;
                if (this.frameTick >= this.frameSpeed) {
                    this.frameTick = 0;
                    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;

                    // Switch to swim animation after transition animation completes
                    if (this.currentAnimation === 'transition' && this.currentFrameIndex === this.frames.length - 1 && !this.transitionCompleted) {
                        this.frames = animations.swim.map(src => {
                            const img = loadImage(src);
                            img.onload = () => {
                                this.isLoaded = true;
                            };
                            img.onerror = () => {
                                img.broken = true;
                            };
                            return img;
                        });
                        this.currentAnimation = 'swim';
                        this.currentFrameIndex = 0; // Reset frame index for swim animation
                        this.transitionCompleted = true; // Setze die Flagge, um anzuzeigen, dass die transition-Animation abgeschlossen ist
                    }
                }
            }
        }
    }

    draw(ctx) {
        super.draw(ctx); // Aufruf der draw-Methode der Enemy-Klasse
    }

    onCollisionWithBullet() {
        this.health--;
        if (this.health <= 0) {
            this.die();
        }
    }
}