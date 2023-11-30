let start = new Date().getTime();

const originPosition = { x: 0, y: 0 };

const last = {
    starTimestamp: start,
    starPosition: originPosition,
    mousePosition: originPosition
}

const config = {
    starAnimationDuration: 1500,
    minimumTimeBetweenStars: 150,
    colors: ["20 184 166", "59 130 246"],
    sizes: ["1.4rem", "1rem", "0.6rem"],
    animations: ["fall-1", "fall-2", "fall-3"],
    starCreationInterval: 250
}

let count = 0;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    selectRandom = items => items[rand(0, items.length - 1)];

const withUnit = (value, unit) => `${value}${unit}`,
    px = value => withUnit(value, "px"),
    ms = value => withUnit(value, "ms");

const calcDistance = (a, b) => {
    const diffX = b.x - a.x,
        diffY = b.y - a.y;

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

const calcElapsedTime = (start, end) => end - start;

const appendElement = element => document.body.appendChild(element),
    removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

const createStar = position => {
    const star = document.createElement("span"),
        color = selectRandom(config.colors);

    star.className = "star fa-solid fa-sparkle";

    star.style.left = px(position.x);
    star.style.top = px(position.y);
    star.style.fontSize = selectRandom(config.sizes);
    star.style.color = `rgb(${color})`;
    star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
    star.style.animationName = config.animations[count++ % 3];
    star.style.starAnimationDuration = ms(config.starAnimationDuration);

    appendElement(star);

    removeElement(star, config.starAnimationDuration);
}

const createGlowPoint = position => {
    const glow = document.createElement("div");

    glow.className = "glow-point";

    glow.style.left = px(position.x);
    glow.style.top = px(position.y);

    appendElement(glow)

    removeElement(glow, config.glowDuration);
}

const determinePointQuantity = distance => Math.max(
    Math.floor(distance / config.maximumGlowPointSpacing),
    1
);

const updateLastStar = position => {
    last.starTimestamp = new Date().getTime();

    last.starPosition = position;
}

const updateLastMousePosition = position => last.mousePosition = position;

const adjustLastMousePosition = position => {
    if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        last.mousePosition = position;
    }
};

const handleOnMove = e => {
    const mousePosition = { x: e.clientX, y: e.clientY }

    adjustLastMousePosition(mousePosition);

    const now = new Date().getTime(),
        hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
        hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;
    
    const hasMouseEffectAttribute = e.target.getAttribute('mouse-effect') !== null;

    if ((hasMovedFarEnough || hasBeenLongEnough) && hasMouseEffectAttribute) {
        createStar(mousePosition);
        updateLastStar(mousePosition);
    }

    updateLastMousePosition(mousePosition);
}

const startStarCreationInterval = () => {
    setInterval(() => {
        let e = globalE;
        const isClickableElement = e.target.getAttribute('mouse-effect') !== null;
        if (isClickableElement) createStar(last.mousePosition);
    }, config.starCreationInterval);
}

let globalE;

startStarCreationInterval();

window.addEventListener('mousemove', e => {
    globalE = e;
    handleOnMove(e);
});

window.addEventListener('touchmove', e => handleOnMove(e.touches[0]));
document.body.addEventListener('mouseleave', () => updateLastMousePosition(originPosition));