require('dotenv').config();
const { Sequelize } = require('sequelize');

// Sequelize를 사용하여 MySQL 데이터베이스 연결 설정
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // 터미널에 SQL 쿼리문이 너무 많이 뜨는 것을 방지
  }
);

module.exports = sequelize;
