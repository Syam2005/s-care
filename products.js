function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.querySelector('.wave-background').appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
}

setInterval(createSparkle, 200);