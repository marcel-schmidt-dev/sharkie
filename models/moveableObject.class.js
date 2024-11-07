class MoveableObject {
    imageCache = {};
    frameCount = 0;
    animationSpeed = 30;
    health = 100;

    constructor(x, y, width, height, imageUrl) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageUrl;
        this.imagesLoaded = false;
    }

    async loadImages(arrayOfUrls) {
        const loadPromises = arrayOfUrls.map(url => {
            return new Promise((resolve) => {
                const image = new Image();
                image.src = url;
                image.onload = () => {
                    this.imageCache[url] = image;
                    resolve();
                }
            });
        });

        await Promise.all(loadPromises);
        this.imagesLoaded = true;
    }

    animateIdle() {
        this.frameCount++;

        if (this.frameCount >= this.animationSpeed) {
            this.frameCount = 0;
            this.currentImage++;

            if (this.currentImage >= this.idleImages.length) {
                this.currentImage = 0;
            }
        }

        if (this.imagesLoaded) {
            this.image = this.imageCache[this.idleImages[this.currentImage]];
        }

        requestAnimationFrame(() => this.animateIdle());
    }

    moveRight() {
        this.x += 20;
    }

    moveLeft() {
        this.x -= 20;
    }

    moveUp() {
        this.y -= 20;
    }

    moveDown() {
        this.y += 20;
    }

    loadImage(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default MoveableObject;