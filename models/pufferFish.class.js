import MoveableObject from "./moveableObject.class"

class PufferFish extends MoveableObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.image.src = "/assets/pufferFish/1.IDLE/1.png";
        this.animateIdle();
    }
}