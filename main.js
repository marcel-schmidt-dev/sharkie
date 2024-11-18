import Game from './classes/Game';
import './style.scss';

const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
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

let game = new Game(ctx);
game.start();

function resetGame() {
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'none';
    const retryBtn = document.getElementById('retry');
    retryBtn.style.display = 'none';
    game = new Game(ctx);
    game.start();
}

document.getElementById('retry').addEventListener('click', resetGame);