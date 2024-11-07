import './style.scss'
import World from './models/world.class.js';

const canvas = document.getElementById('canvas');

const world = new World(canvas);
window.world = world;
world.draw();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        world.player.moveRight();
    }
    if (event.key === 'ArrowLeft') {
        world.player.moveLeft();
    }
    if (event.key === 'ArrowUp') {
        world.player.moveUp();
    }
    if (event.key === 'ArrowDown') {
        world.player.moveDown();
    }
});