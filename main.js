import Game from './classes/Game';
import './style.scss';

const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
export const GAME_SPEED = 0.8; // GAME SPEED

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

function resetGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('retry').style.display = 'none';
    document.getElementById('highscore').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('boss-bar-container').style.display = 'none';
    game = new Game(ctx);
    game.start();
}

function toggleControls() {
    const controls = document.getElementById('controls');
    controls.classList.toggle('active');
}

const touchMediaQuery = window.matchMedia("(pointer: coarse)");

function handleDeviceChange(e) {
    if (e.matches) {
        document.getElementById('touch-controls').style.display = 'flex';
        document.querySelector('.btn-group').style.display = 'none';
    } else {
        document.getElementById('touch-controls').style.display = 'none';
        document.querySelector('.btn-group').style.display = 'block';
    }
}

handleDeviceChange(touchMediaQuery);

touchMediaQuery.addEventListener('change', handleDeviceChange);
document.getElementById('retry').addEventListener('click', resetGame);
document.getElementById('start').addEventListener('click', resetGame);
document.getElementById('toggle').addEventListener('click', toggleControls);