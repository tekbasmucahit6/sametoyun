const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Uygulama oluşturma
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(cors()); // CORS'u etkinleştir
app.use(express.json()); // JSON gövdesini işlemek için

// MySQL bağlantısı
const db = mysql.createPool({
  host:'localhost',
  user:'root',
  password: 'tekbasmucahit6',
  database: 'newexampledb',
});

// Veritabanı bağlantı testi
db.getConnection((err, connection) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
  } else {
    console.log('Veritabanına başarıyla bağlandı!');
    connection.release();
  }
});

// Basit bir GET endpointi
app.get('/', (req, res) => {
  res.send('Backend API çalışıyor!');
});

// Kullanıcılar için bir örnek endpoint
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanı hatası' });
    } else {
      res.json(results);
    }
  });
});

// Kullanıcılar için bir örnek endpoint
// Kullanıcı eklemek için bir POST endpointi
app.post('/userCreate', (req, res) => {
    const query = 'INSERT INTO users (username, puan, level, zaman) VALUES (?, ?, ?, ?)';
    const { name, puan, level, zaman } = req.body;
  
    if (!name || !puan || !level || !zaman) {
      return res.status(400).json({ error: 'Eksik bilgi gönderildi' });
    }
  
    db.query(query, [name, puan, level, zaman], (err, results) => {
      if (err) {
        console.error('Sorgu hatası:', err);
        res.status(500).json({ error: 'Veritabanı hatası' });
      } else {
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!', results });
      }
    });
  });

// Leaderboard endpointi
app.get('/leaderboard', (req, res) => {
  // Kullanıcıları puanlarına göre azalan sırada çekmek için SQL sorgusu
  const query = 'SELECT username, puan, level, zaman FROM users ORDER BY puan DESC LIMIT 10';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Sorgu hatası:', err);
          res.status(500).json({ error: 'Veritabanı hatası' });
      } else {
          // Veritabanından çekilen verileri JSON formatında döndür
          res.json({
              leaderboard: results.map((user) => ({
                  username: user.username,
                  score: user.puan,
                  level: user.level,
                  time: user.zaman
              }))
          });
      }
  });
});

  

// Sunucuyu başlatma
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
