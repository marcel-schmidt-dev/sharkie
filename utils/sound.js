import { muted } from '../main.js';

export default function playSound(sound = "") {
    if (muted) return;
    let src = "";
    let volume = 1;
    switch (sound) {
        case "shooting":
            src = "./assets/sounds/edit/blub.mp3";
            volume = 0.2;
            break;
        case "hurtPufferFish":
            src = "./assets/sounds/edit/hurt/hurt1.mp3";
            volume = 0.2;
            break;
        case "hurtJellyFish":
            src = "./assets/sounds/edit/electro.mp3";
            volume = 0.2;
            break;
        case "die":
            src = "./assets/sounds/edit/die.mp3";
            volume = 0.2;
            break;
        case "powerUp":
            src = "./assets/sounds/power-up.mp33";
            volume = 0.5;
            break;
        case "specialBullet":
            src = "./assets/sounds/edit/special-bullet.mp3";
            volume = 0.2;
            break;
        case "mobDie":
            src = "./assets/sounds/edit/mob-die.mp3";
            volume = 0.2;
            break;
        case "bossDie":
            src = "./assets/sounds/edit/boss-die.mp3";
            volume = 1;
            break;
        case "bossAttack":
            src = "./assets/sounds/edit/boss-attack.mp3";
            volume = 0.4;
        default:
            break;
    }
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play();
}