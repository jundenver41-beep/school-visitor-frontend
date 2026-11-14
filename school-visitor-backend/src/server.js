// src/server.js (완성본 - 전체를 이 코드로 덮어쓰세요)
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/VisitRequest');
const visitRoutes = require('./routes/visitRoutes');
const jwt = require('jsonwebtoken'); // ✅ 토큰 기능

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 로그인 API
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === '1234') {
    const token = jwt.sign({ role: 'teacher' }, 'my_secret_key', { expiresIn: '2h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: '비밀번호가 틀렸습니다.' });
  }
});

// ✅ 방문 신청 API 라우터 연결
app.use('/api/visits', visitRoutes);

// ✅ DB 연결 및 서버 실행
const PORT = 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('데이터베이스 연결 및 테이블 세팅 완료');
  app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
  });
}).catch(err => {
  console.error('데이터베이스 연결 실패:', err);
});
