// Düþen kutucuklarý (bloklarý) oluþtur
function spawnFallingItem() {
    const fallingItem = document.createElement('div');

    // %80 ihtimalle normal blok, %30 ihtimalle tehlikeli blok
    const isDangerous = Math.random() < 0.30; // %30 ihtimalle tehlikeli blok

    fallingItem.classList.add('falling-item');
    if (isDangerous) {
        fallingItem.classList.add('dangerous-item'); // Tehlikeli blok stilini ekle
    }

    // Rastgele yatay pozisyon
    fallingItem.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
    fallingItem.style.top = `0px`;

    gameArea.appendChild(fallingItem);

    // Düþme animasyonu
    const fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval);
            return;
        }

        const fallingItemRect = fallingItem.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Kutucuk yere ulaþtýðýnda
        if (fallingItemRect.top > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            gameArea.removeChild(fallingItem);
        }

        // Kutucuk oyuncuya çarparsa
        if (checkCollision(fallingItemRect, playerRect)) {
            clearInterval(fallInterval);
            gameArea.removeChild(fallingItem);

            if (fallingItem.classList.contains('dangerous-item')) {
                endGame(); // Tehlikeli kutucuksa oyunu bitir
            } else {
                updateScore(10); // Normal kutucuksa puan ekle
            }
        }

        // Aþaðýya doðru hareket ettir
        fallingItem.style.top = `${fallingItem.offsetTop + 5}px`;
    }, 30); // 30ms'de bir hareket
}
