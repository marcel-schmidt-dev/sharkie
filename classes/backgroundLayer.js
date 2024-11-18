export default class BackgroundLayer {
    constructor(imageSrc, speed) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
        this.width = canvas.width * 2;
        this.height = canvas.height;
    }

    update() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + (this.width - 1), this.y, this.width, this.height);
    }
}