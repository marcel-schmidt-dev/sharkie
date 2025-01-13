import { GAME_SPEED, loadImage } from "../main";

export default class BackgroundLayer {
    constructor(imageSrc, speed) {
        this.image = loadImage(imageSrc);
        this.speed = speed * GAME_SPEED;
        this.x = 0;
        this.y = 0;
        this.width = canvas.width * 2;
        this.height = canvas.height;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;

        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + (this.width - 1), this.y, this.width, this.height);
    }

    reset() {
        this.x = 0;
    }
}