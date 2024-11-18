class Bullet {
    constructor(x, y, speed = 3, damage = 1) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.damage = damage;
        this.image = new Image();
        this.image.src = '/assets/sharkie/4.Attack/Bubble trap/Bubble.png';
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
        this.isCollided = false;
    }

    update() {
        this.x += this.speed;
        this.hitbox = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    }

    isInBounds() {
        return this.x + this.width > 0 && this.x < canvas.width && this.y + this.height > 0 && this.y < canvas.height;
    }

    isCollidingWith(other) {
        const bulletHitbox = this.hitbox;
        const otherHitbox = other.hitbox;

        if (bulletHitbox.x < otherHitbox.x + otherHitbox.width &&
            bulletHitbox.x + bulletHitbox.width > otherHitbox.x &&
            bulletHitbox.y < otherHitbox.y + otherHitbox.height &&
            bulletHitbox.y + bulletHitbox.height > otherHitbox.y) {
            this.isCollided = true;
            return true;
        }
    }
}

export default Bullet;