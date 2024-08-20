/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { Client } = require('pg');

// PostgreSQL 연결 설정
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// JSON 데이터 파일 경로
const jsonFile = './Korean administrative_districts.json';

// JSON 데이터 읽기
const jsonData = fs.readFileSync(jsonFile, 'utf-8');
const data = JSON.parse(jsonData);

// 데이터 삽입을 위한 SQL 쿼리
const insertQuery = `
  INSERT INTO location (province, city, district)
  VALUES ($1, $2, $3)
`;

async function insertData() {
  try {
    await client.connect();

    for (const province in data) {
      for (const city in data[province]) {
        for (const district of data[province][city]) {
          // 데이터 삽입
          await client.query(insertQuery, [province, city, district]);
        }
      }
    }

    console.log('데이터 삽입이 완료되었습니다.');
  } catch (error) {
    console.error('데이터 삽입 중 오류가 발생했습니다.', error);
  } finally {
    await client.end();
  }
}

insertData();
