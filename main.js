import Game from './classes/Game';
import './style.scss';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
export const GAME_SPEED = 0.8; // Hier die Spielgeschwindigkeit anpassen

const imageCache = {};

export function loadImage(src) {
    if (imageCache[src]) {
        return imageCache[src];
    }

    const img = new Image();
    img.src = src;
    imageCache[src] = img;

    return img;
}

const game = new Game(ctx);
game.start();