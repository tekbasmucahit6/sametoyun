let player;
let gameArea;
let playerSpeed = 25; // Oyuncunun hareket hızı
let score = 0;
let level = 1;
let gameOver = false; // Oyun durumu
let playerName = ""; // Oyuncu adı
let topScores = []; // Liderlik tablosu
let gameInterval; // Game interval için global değişken

// Oyunun başlatılacağı fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    player = document.getElementById('player');
    gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-button');

    // Başlatma butonuna tıklama olayı
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        askPlayerName();
        startGame();
        document.addEventListener('keydown', movePlayer);
    });
});

// Oyuncu adını almak için
function askPlayerName() {
    playerName = prompt("Lütfen adınızı girin:", "Oyuncu") || "Bilinmeyen Oyuncu";
}

// Oyuncuyu hareket ettirme
function movePlayer(event) {
    if (gameOver) return;
    const key = event.key;
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    if (key === 'ArrowLeft' && playerRect.left > gameAreaRect.left) {
        let newPosition = parseFloat(player.style.left || "50%") - playerSpeed;
        if (newPosition >= 5) {
            player.style.left = `${newPosition}%`;
        }
    } else if (key === 'ArrowRight' && playerRect.right < gameAreaRect.right) {
        let newPosition = parseFloat(player.style.left || "50%") + playerSpeed;
        if (newPosition <= 95) {
            player.style.left = `${newPosition}%`;
        }
    }
}

// Düşen kutucukları oluştur ve düşür
function startGame() {
    gameArea.style.backgroundColor = "transparent";
    gameInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(gameInterval);
            return;
        }
        spawnFallingItem();
    }, 1090);
}

// Düşen öğeyi oluştur
function spawnFallingItem() {
    let item = document.createElement('div');
    item.classList.add('falling-item');

    const dangerChance = 0.2 + (level - 1) * 0.05; // Tehlikeli blok olasılığı
    const isDangerous = Math.random() < dangerChance;

    item.classList.add(isDangerous ? 'dangerous-item' : 'normal-item');
    item.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`;
    gameArea.appendChild(item);

    let fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval);
            return;
        }

        item.style.top = `${item.offsetTop + 6}px`; // Hız arttı

        if (item.offsetTop > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            gameArea.removeChild(item);
        }

        const playerRect = player.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (checkCollision(playerRect, itemRect)) {
            if (item.classList.contains('dangerous-item')) {
                endGame();
            } else {
                updateScore(10);
            }
            clearInterval(fallInterval);
            gameArea.removeChild(item);
        }
    }, 18); // Hız arttı
}

// Çarpışma kontrolü
function checkCollision(rect1, rect2) {
    return !(
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Oyunu bitir
function endGame() {
    gameOver = true;
    addToLeaderboard(playerName, score); // Liderlik tablosuna ekle
    savePlayerToDatabase(playerName, score).then(() => {
        // Veritabanı işlemi tamamlandıktan sonra liderlik tablosunu güncelle
        updateLeaderboardDisplay();
    });
    downloadGameData(playerName, score, level);

    alert("Yeşil Elmaya dokundunuz! Oyun bitti.");
}

// Veritabanına oyuncuyu kaydet
function savePlayerToDatabase(name, score) {
    return fetch('/api/Players/SavePlayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name, score: score })
    })
        .then(response => {
            if (response.ok) {
                console.log("Oyuncu başarıyla kaydedildi.");
            } else {
                console.error("Oyuncu kaydedilemedi.");
            }
        })
        .catch(error => console.error("Hata: ", error));
}

// Not defterine oyun verilerini indirme
function downloadGameData(playerName, score, level) {
    const gameData = `Player: ${playerName}\nScore: ${score}\nLevel: ${level}\nDate: ${new Date().toLocaleString()}\n`;
    const blob = new Blob([gameData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game_data.txt';
    link.click();
    URL.revokeObjectURL(link.href);
}

// Liderlik tablosuna skor ekle
function addToLeaderboard(name, score) {
    topScores.push({ name, score });
    topScores.sort((a, b) => b.score - a.score);
    topScores = topScores.slice(0, 10); // İlk 10 skoru al
}

// Liderlik tablosunu güncelle
function updateLeaderboardDisplay() {
    const leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) {
        console.error("Liderlik tablosu öğesi bulunamadı!");
        return;
    }
    leaderboard.innerHTML = "";

    // Eğer topScores dizisi boşsa, liderlik tablosuna uyarı ekleyelim
    if (topScores.length === 0) {
        leaderboard.innerHTML = "<li>Henüz skor bulunmamaktadır.</li>";
        return;
    }

    topScores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboard.appendChild(listItem);
    });
}

// Skoru artır
function updateScore(points) {
    score += points; // Her kırmızı elma için puan ekle
    if (score % 50 === 0) { // Her 50 puanda seviye atla
        level++;
        showLevelUpMessage(); // Seviye atlama mesajını göster
        increaseGameSpeed(); // Oyun hızını artır
    }
}

// Seviye atlama mesajı göster
function showLevelUpMessage() {
    const levelUpMessage = document.getElementById('level-up-message');
    levelUpMessage.classList.add('show');
    setTimeout(() => {
        levelUpMessage.classList.remove('show');
    }, 3000); // 3 saniye sonra gizlenir
}

// Oyun hızını artır
function increaseGameSpeed() {
    // Hızı artırmak için spawnFallingItem interval süresini küçültüyoruz
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(gameInterval);
            return;
        }
        spawnFallingItem();
    }, 1000 - level * 20); // Seviyeye göre hız artışı
}
