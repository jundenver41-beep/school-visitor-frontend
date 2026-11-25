// src/models/VisitRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VisitRequest = sequelize.define('VisitRequest', {
  visitorName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '방문자 이름'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '방문자 연락처'
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '방문 일시'
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '방문 목적'
  },
  status: {
    // ⭐ '삭제됨' 항목을 추가했습니다!
    type: DataTypes.ENUM('대기중', '승인됨', '거절됨', '방문완료', '삭제됨'),
    defaultValue: '대기중',
    comment: '승인 상태'
  }
});

module.exports = VisitRequest;
