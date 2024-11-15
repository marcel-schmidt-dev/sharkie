class Bullet {
    constructor(x, y, speed = 3, damage = 1) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.damage = damage; // Standard-Schaden ist 1
        this.hasHitbox = true;
        this.image = new Image();
        this.image.src = '/assets/sharkie/4.Attack/Bubble trap/Bubble.png';
        this.updateHitbox();
    }

    update() {
        this.x += this.speed;
        this.updateHitbox();
    }

    updateHitbox() {
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

    isCollidingWith(other) {
        const bulletHitbox = this.getHitbox();
        const otherHitbox = other.getHitbox();
        return (
            bulletHitbox.x < otherHitbox.x + otherHitbox.width &&
            bulletHitbox.x + bulletHitbox.width > otherHitbox.x &&
            bulletHitbox.y < otherHitbox.y + otherHitbox.height &&
            bulletHitbox.y + bulletHitbox.height > otherHitbox.y
        );
    }

    getHitbox() {
        return this.hitbox;
    }

    shouldDelete(enemies) {
        if (!this.isInBounds()) {
            return true;
        }

        for (let enemy of enemies) {
            if (this.isCollidingWith(enemy)) {
                enemy.handleCollisionWithBullet(this);
                return true;
            }
        }

        return false;
    }
}

export default Bullet;