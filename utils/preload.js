export const imageCache = {};

export function loadImage(src) {
    if (imageCache[src]) {
        return Promise.resolve(imageCache[src]);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            imageCache[src] = img;
            resolve(img);
        };
        img.onerror = reject;
    });
}

export function preloadImages() {
    const imagePaths = [
        // Background layers
        './assets/background/Layers/water/D.png',
        './assets/background/Layers/fondo2/D.png',
        './assets/background/Layers/fondo1/D.png',
        './assets/background/Layers/floor/D.png',
        './assets/background/Layers/light/COMPLETO.png',
        // Player frames
        ...Array.from({ length: 6 }, (_, i) => `./assets/sharkie/swim/${i + 1}.png`),
        ...Array.from({ length: 7 }, (_, i) => `./assets/sharkie/4.Attack/Bubble trap/Op2 (Without Bubbles)/${i + 1}.png`),
        ...Array.from({ length: 6 }, (_, i) => `./assets/sharkie/4.Attack/Fin slap/${i + 1}.png`),
        ...Array.from({ length: 3 }, (_, i) => `./assets/sharkie/5.Hurt/2.Electric shock/${i + 1}.png`),
        ...Array.from({ length: 4 }, (_, i) => `./assets/sharkie/5.Hurt/1.Poisoned/${i + 1}.png`),
        ...Array.from({ length: 10 }, (_, i) => `./assets/sharkie/6.dead/2.Electro_shock/${i + 1}.png`),
        ...Array.from({ length: 12 }, (_, i) => `./assets/sharkie/6.dead/1.Poisoned/${i + 1}.png`),
        ...Array.from({ length: 13 }, (_, i) => `./assets/sharkie/2.Long_IDLE/${i + 1}.png`),
        // Coin frames
        './assets/marks/1. Coins/1.png',
        './assets/marks/1. Coins/2.png',
        './assets/marks/1. Coins/3.png',
        './assets/marks/1. Coins/4.png',
        // Poison frames
        './assets/marks/poison/1.png',
        './assets/marks/poison/2.png',
        './assets/marks/poison/3.png',
        './assets/marks/poison/4.png',
        './assets/marks/poison/5.png',
        './assets/marks/poison/6.png',
        './assets/marks/poison/7.png',
        './assets/marks/poison/8.png',
        // Boss frames
        ...Array.from({ length: 10 }, (_, i) => `./assets/enemy/boss/introduce/${i + 1}.png`),
        ...Array.from({ length: 13 }, (_, i) => `./assets/enemy/boss/floating/${i + 1}.png`),
        ...Array.from({ length: 6 }, (_, i) => `./assets/enemy/boss/dead/${i + 1}.png`),
        ...Array.from({ length: 6 }, (_, i) => `./assets/enemy/boss/attack/${i + 1}.png`),
        // PufferFish frames
        './assets/enemy/pufferFish/swim/1.swim1.png',
        './assets/enemy/pufferFish/swim/1.swim2.png',
        './assets/enemy/pufferFish/swim/1.swim3.png',
        './assets/enemy/pufferFish/swim/1.swim4.png',
        './assets/enemy/pufferFish/swim/1.swim5.png',
        './assets/enemy/pufferFish/bubbleswim/1.bubbleswim1.png',
        './assets/enemy/pufferFish/bubbleswim/1.bubbleswim2.png',
        './assets/enemy/pufferFish/bubbleswim/1.bubbleswim3.png',
        './assets/enemy/pufferFish/bubbleswim/1.bubbleswim4.png',
        './assets/enemy/pufferFish/bubbleswim/1.bubbleswim5.png',
        './assets/enemy/pufferFish/transition/1.transition1.png',
        './assets/enemy/pufferFish/transition/1.transition2.png',
        './assets/enemy/pufferFish/transition/1.transition3.png',
        './assets/enemy/pufferFish/transition/1.transition4.png',
        './assets/enemy/pufferFish/transition/1.transition5.png',
        './assets/enemy/pufferFish/die/1.1.png',
        './assets/enemy/pufferFish/die/1.2.png',
        './assets/enemy/pufferFish/die/1.3.png',
        './assets/enemy/pufferFish/swim/2.swim1.png',
        './assets/enemy/pufferFish/swim/2.swim2.png',
        './assets/enemy/pufferFish/swim/2.swim3.png',
        './assets/enemy/pufferFish/swim/2.swim4.png',
        './assets/enemy/pufferFish/swim/2.swim5.png',
        './assets/enemy/pufferFish/bubbleswim/2.bubbleswim1.png',
        './assets/enemy/pufferFish/bubbleswim/2.bubbleswim2.png',
        './assets/enemy/pufferFish/bubbleswim/2.bubbleswim3.png',
        './assets/enemy/pufferFish/bubbleswim/2.bubbleswim4.png',
        './assets/enemy/pufferFish/bubbleswim/2.bubbleswim5.png',
        './assets/enemy/pufferFish/transition/2.transition1.png',
        './assets/enemy/pufferFish/transition/2.transition2.png',
        './assets/enemy/pufferFish/transition/2.transition3.png',
        './assets/enemy/pufferFish/transition/2.transition4.png',
        './assets/enemy/pufferFish/transition/2.transition5.png',
        './assets/enemy/pufferFish/die/2.1.png',
        './assets/enemy/pufferFish/die/2.2.png',
        './assets/enemy/pufferFish/die/2.3.png',
        './assets/enemy/pufferFish/swim/3.swim1.png',
        './assets/enemy/pufferFish/swim/3.swim2.png',
        './assets/enemy/pufferFish/swim/3.swim3.png',
        './assets/enemy/pufferFish/swim/3.swim4.png',
        './assets/enemy/pufferFish/swim/3.swim5.png',
        './assets/enemy/pufferFish/bubbleswim/3.bubbleswim1.png',
        './assets/enemy/pufferFish/bubbleswim/3.bubbleswim2.png',
        './assets/enemy/pufferFish/bubbleswim/3.bubbleswim3.png',
        './assets/enemy/pufferFish/bubbleswim/3.bubbleswim4.png',
        './assets/enemy/pufferFish/bubbleswim/3.bubbleswim5.png',
        './assets/enemy/pufferFish/transition/3.transition1.png',
        './assets/enemy/pufferFish/transition/3.transition2.png',
        './assets/enemy/pufferFish/transition/3.transition3.png',
        './assets/enemy/pufferFish/transition/3.transition4.png',
        './assets/enemy/pufferFish/transition/3.transition5.png',
        './assets/enemy/pufferFish/die/3.1.png',
        './assets/enemy/pufferFish/die/3.2.png',
        './assets/enemy/pufferFish/die/3.3.png',
        // JellyFish frames
        './assets/enemy/jellyFish/regular/lila1.png',
        './assets/enemy/jellyFish/regular/lila2.png',
        './assets/enemy/jellyFish/regular/lila3.png',
        './assets/enemy/jellyFish/regular/lila4.png',
        './assets/enemy/jellyFish/dead/Lila/L1.png',
        './assets/enemy/jellyFish/dead/Lila/L2.png',
        './assets/enemy/jellyFish/dead/Lila/L3.png',
        './assets/enemy/jellyFish/dead/Lila/L4.png',
        './assets/enemy/jellyFish/regular/yellow1.png',
        './assets/enemy/jellyFish/regular/yellow2.png',
        './assets/enemy/jellyFish/regular/yellow3.png',
        './assets/enemy/jellyFish/regular/yellow4.png',
        './assets/enemy/jellyFish/dead/Yellow/y1.png',
        './assets/enemy/jellyFish/dead/Yellow/y2.png',
        './assets/enemy/jellyFish/dead/Yellow/y3.png',
        './assets/enemy/jellyFish/dead/Yellow/y4.png',
        './assets/enemy/jellyFish/dangerous/green1.png',
        './assets/enemy/jellyFish/dangerous/green2.png',
        './assets/enemy/jellyFish/dangerous/green3.png',
        './assets/enemy/jellyFish/dangerous/green4.png',
        './assets/enemy/jellyFish/dead/green/g1.png',
        './assets/enemy/jellyFish/dead/green/g2.png',
        './assets/enemy/jellyFish/dead/green/g3.png',
        './assets/enemy/jellyFish/dead/green/g4.png',
        './assets/enemy/jellyFish/dangerous/pink1.png',
        './assets/enemy/jellyFish/dangerous/pink2.png',
        './assets/enemy/jellyFish/dangerous/pink3.png',
        './assets/enemy/jellyFish/dangerous/pink4.png',
        './assets/enemy/jellyFish/dead/Pink/P1.png',
        './assets/enemy/jellyFish/dead/Pink/P2.png',
        './assets/enemy/jellyFish/dead/Pink/P3.png',
        './assets/enemy/jellyFish/dead/Pink/P4.png',
    ];

    const promises = imagePaths.map(src => loadImage(src));

    return Promise.all(promises);
}