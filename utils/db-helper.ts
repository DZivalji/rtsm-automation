import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { LoginData } from '../types/login-data';
import { SubjectData } from '../types/subject-data';

export class DbHelper {
  private async openDb() {
    const dbPath = path.resolve(__dirname, '..', 'database', 'veeva.db');
    return open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  async getLoginData(): Promise<LoginData> {
    const db = await this.openDb();

    const loginData = await db.get<LoginData>(`
      SELECT 
        url,
        username,
        password
      FROM login_data
      LIMIT 1
    `);

    await db.close();

    if (!loginData) {
      throw new Error('No login data found in login_data table.');
    }

    if (!loginData.url || !loginData.username || !loginData.password) {
      throw new Error('URL, username, or password is missing in login_data table.');
    }

    return loginData;
  }

  async insertSubjectResult(subjectData: SubjectData): Promise<void> {
    const db = await this.openDb();

    await db.run(
      `
      INSERT INTO subject_results (
        subject_id,
        sex_gender,
        cohort,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        subjectData.subjectId,
        subjectData.sexGender,
        subjectData.cohort,
        subjectData.status,
      ]
    );

    await db.close();
  }

  async getSubjectResultBySubjectId(subjectId: string): Promise<SubjectData> {
    const db = await this.openDb();

    const subjectData = await db.get<SubjectData>(
      `
      SELECT
        subject_id AS subjectId,
        sex_gender AS sexGender,
        cohort,
        status
      FROM subject_results
      WHERE subject_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [subjectId]
    );

    await db.close();

    if (!subjectData) {
      throw new Error(`No subject result found for Subject ID: ${subjectId}`);
    }

    return subjectData;
  }

  async clearSubjectResults(): Promise<void> {
    const db = await this.openDb();

    await db.run(`
      DELETE FROM subject_results
    `);

    await db.close();
  }
}