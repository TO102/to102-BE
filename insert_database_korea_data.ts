import { Client } from 'pg';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: false,
});

const jsonFile = './Korean_administrative_districts.json';
const jsonData = fs.readFileSync(jsonFile, 'utf-8');
const data = JSON.parse(jsonData);

const insertQuery = `
  INSERT INTO location (province, city, district)
  VALUES ($1, $2, $3)
  ON CONFLICT (province, city, district) DO NOTHING
`;

async function insertData() {
  try {
    await client.connect();
    console.log('Database connected');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const province in data) {
      for (const city in data[province]) {
        const districts = new Set(); // 중복 제거를 위한 Set
        for (const district of data[province][city]) {
          if (typeof district === 'string') {
            districts.add(district);
          } else if (typeof district === 'object') {
            Object.keys(district).forEach((subDistrict) =>
              districts.add(subDistrict),
            );
          }
        }

        for (const district of districts) {
          const result = await client.query(insertQuery, [
            province,
            city,
            district,
          ]);
          if (result.rowCount === 1) {
            insertedCount++;
          } else {
            skippedCount++;
          }
        }
      }
    }

    console.log(`삽입된 데이터: ${insertedCount}`);
    console.log(`중복으로 건너뛴 데이터: ${skippedCount}`);
    console.log(`총 처리된 데이터: ${insertedCount + skippedCount}`);
  } catch (error) {
    console.error('데이터 삽입 중 오류가 발생했습니다.');
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
      console.error('스택 트레이스:', error.stack);
    } else {
      console.error('알 수 없는 오류:', error);
    }
  } finally {
    await client.end();
    console.log('Database disconnected');
  }
}

insertData();
