document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // You can add real authentication here if needed
        // For now, just redirect to home page
        window.location.href = 'index.html';
    });
});

// Create sparkle effect
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