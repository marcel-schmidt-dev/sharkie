import Game from './classes/Game';
import './style.scss';

const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
export const GAME_SPEED = 0.8; // GAME SPEED
export let muted = false;
export const backgroundAudio = new Audio('./assets/sounds/background.mp3');
backgroundAudio.loop = true;
backgroundAudio.volume = 0.2;

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

let game;

function resetGame() {
    game = new Game(ctx);
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('retry').style.display = 'none';
    document.getElementById('highscore').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('boss-bar-container').style.display = 'none';
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

function toggleSound(e) {
    e.target.classList.toggle('active');
    muted = !muted;
    if (muted) {
        backgroundAudio.pause();
    } else {
        backgroundAudio.play();
    }
}

handleDeviceChange(touchMediaQuery);

touchMediaQuery.addEventListener('change', handleDeviceChange);
document.getElementById('retry').addEventListener('click', resetGame);
document.getElementById('start').addEventListener('click', resetGame);
document.getElementById('toggle').addEventListener('click', toggleControls);
document.querySelector('.sound').addEventListener('click', (event) => toggleSound(event));