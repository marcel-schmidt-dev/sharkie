import Player from './player.class.js';
import StaticObject from './staticObject.class.js';

class World {
    player = new Player(50, 50, 200, 200);
    ctx;
    canvas;
    backgroundObjects = [
        new StaticObject(0, 0, 1440, 480, "/assets/background/Layers/water/D.png"),
        new StaticObject(0, 0, 1440, 480, "/assets/background/Layers/fondo2/D.png"),
        new StaticObject(0, 0, 1440, 480, "/assets/background/Layers/fondo1/D.png"),
        new StaticObject(0, 0, 1440, 480, "/assets/background/Layers/floor/D.png"),
    ];
    lightObject = new StaticObject(0, 0, 1440, 480, "/assets/background/Layers/light/COMPLETO.png");

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.backgroundObjects.forEach(object => {
            object.loadImage(this.ctx);
        });
        this.player.loadImage(this.ctx);
        this.lightObject.loadImage(this.ctx);
        requestAnimationFrame(() => this.draw());
    }
}

export default World;