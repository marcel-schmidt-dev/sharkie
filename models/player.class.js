import MoveableObject from "./moveableObject.class";

class Player extends MoveableObject {

    idleImages = [
        "/assets/sharkie/1.IDLE/1.png",
        "/assets/sharkie/1.IDLE/2.png",
        "/assets/sharkie/1.IDLE/3.png",
        "/assets/sharkie/1.IDLE/4.png",
        "/assets/sharkie/1.IDLE/5.png",
        "/assets/sharkie/1.IDLE/6.png",
        "/assets/sharkie/1.IDLE/7.png",
        "/assets/sharkie/1.IDLE/8.png",
        "/assets/sharkie/1.IDLE/9.png",
        "/assets/sharkie/1.IDLE/10.png",
        "/assets/sharkie/1.IDLE/11.png",
        "/assets/sharkie/1.IDLE/12.png",
        "/assets/sharkie/1.IDLE/13.png",
        "/assets/sharkie/1.IDLE/14.png",
        "/assets/sharkie/1.IDLE/15.png",
        "/assets/sharkie/1.IDLE/16.png",
        "/assets/sharkie/1.IDLE/17.png",
        "/assets/sharkie/1.IDLE/18.png",
    ]

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImages(this.idleImages);
        this.image.src = "/assets/sharkie/1.IDLE/1.png";
        this.animateIdle(this.idleImages);
    }

    shoot() {
        console.log("Pew pew");
    }
}

export default Player;