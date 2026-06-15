const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

async function setupDatabase() {
  const url = process.env.APP_URL;
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;

  if (!url || !username || !password) {
    throw new Error(
      'Missing required environment variables: APP_URL, APP_USERNAME, or APP_PASSWORD'
    );
  }

  const path = require('path');
  const db = await open({
    filename: path.join(__dirname, 'veeva.db'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS login_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subject_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id TEXT NOT NULL,
      sex_gender TEXT NOT NULL,
      cohort TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.run(`DELETE FROM login_data`);

  await db.run(
    `
    INSERT INTO login_data (
      url,
      username,
      password
    )
    VALUES (?, ?, ?)
    `,
    [url, username, password]
  );

  await db.close();

  console.log('Database created successfully.');
}

setupDatabase();