// src/models/VisitRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // 우리가 만든 DB 연결 파일

// 'VisitRequest'라는 이름의 테이블 정의
const VisitRequest = sequelize.define('VisitRequest', {
  visitorName: {
    type: DataTypes.STRING,
    allowNull: false, // 필수 입력
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
    type: DataTypes.ENUM('대기중', '승인됨', '거절됨', '방문완료'),
    defaultValue: '대기중',
    comment: '승인 상태'
  }
});

module.exports = VisitRequest;
