import MoveableObject from "./moveableObject.class";

class StaticObject extends MoveableObject {
    constructor(x, y, width, height, imageUrl) {
        super(x, y, width, height);
        this.image.src = imageUrl;
    }
}

export default StaticObject;