// src/routes/visitRoutes.js
const express = require('express');
const router = express.Router();
const VisitRequest = require('../models/VisitRequest');

// 1. 방문 신청 받기 (POST 방식)
router.post('/', async (req, res) => {
  try {
    // 화면에서 보낸 데이터(이름, 연락처, 날짜, 목적)를 꺼냅니다.
    const { visitorName, phone, visitDate, purpose } = req.body;
    
    // DB 테이블에 새로운 줄(데이터)을 추가합니다.
    const newRequest = await VisitRequest.create({
      visitorName, phone, visitDate, purpose
    });
    
    // 성공했다는 메시지를 화면에 돌려줍니다.
    res.status(201).json({ message: '방문 신청이 완료되었습니다!', data: newRequest });
  } catch (error) {
    console.error('방문 신청 저장 에러:', error);
    res.status(500).json({ message: '신청 중 오류가 발생했습니다.' });
  }
});

// 2. 방문 신청 목록 보기 (GET 방식)
router.get('/', async (req, res) => {
  try {
    // DB 테이블에서 모든 데이터를 가져옵니다. (가장 최근 신청이 위로 오게 정렬)
    const requests = await VisitRequest.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    console.error('목록 조회 에러:', error);
    res.status(500).json({ message: '목록을 불러오는 중 오류가 발생했습니다.' });
  }
});
// 3. 승인/거절 상태 변경하기 (PATCH 방식)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // '승인됨' 또는 '거절됨'

    // DB에서 해당 신청서 찾기
    const request = await VisitRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: '신청서를 찾을 수 없습니다.' });
    }

    // 상태 업데이트 후 저장
    request.status = status;
    await request.save();

    res.json({ message: `상태가 ${status}(으)로 변경되었습니다.`, data: request });
  } catch (error) {
    console.error('상태 변경 에러:', error);
    res.status(500).json({ message: '상태 변경 중 오류가 발생했습니다.' });
  }
});
// 4. 영구 삭제하기 (DELETE 방식)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await VisitRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: '삭제할 데이터를 찾을 수 없습니다.' });
    }
    await request.destroy(); // DB에서 진짜로 삭제함
    res.json({ message: '데이터가 영구 삭제되었습니다.' });
  } catch (error) {
    console.error('영구 삭제 에러:', error);
    res.status(500).json({ message: '영구 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
