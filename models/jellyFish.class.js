import MoveableObject from "./moveableObject.class";

class JellyFish extends MoveableObject {
    regularDangerous = "regular";
    randomSprite = Math.floor(Math.random() * 2);

    jellyImages = {
        regular: [[
            "/assets/enemy/jellyFish/regular/lila1.png",
            "/assets/enemy/jellyFish/regular/lila2.png",
            "/assets/enemy/jellyFish/regular/lila3.png",
            "/assets/enemy/jellyFish/regular/lila4.png",
        ], [
            "/assets/enemy/jellyFish/regular/yellow1.png",
            "/assets/enemy/jellyFish/regular/yellow2.png",
            "/assets/enemy/jellyFish/regular/yellow3.png",
            "/assets/enemy/jellyFish/regular/yellow4.png",
        ]],
        dangerous: [[
            "/assets/enemy/jellyFish/dangerous/green1.png",
            "/assets/enemy/jellyFish/dangerous/green2.png",
            "/assets/enemy/jellyFish/dangerous/green3.png",
            "/assets/enemy/jellyFish/dangerous/green4.png",
        ], [
            "/assets/enemy/jellyFish/dangerous/pink1.png",
            "/assets/enemy/jellyFish/dangerous/pink2.png",
            "/assets/enemy/jellyFish/dangerous/pink3.png",
            "/assets/enemy/jellyFish/dangerous/pink4.png",
        ]]
    }

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.image.src = this.jellyImages[this.regularDangerous][this.randomSprite][0];
        this.loadImages(this.jellyImages[this.regularDangerous][this.randomSprite]);
        this.animateIdle(this.jellyImages[this.regularDangerous][this.randomSprite]);
    }
}

export default JellyFish;