import { Pool, QueryResult, QueryResultRow } from 'pg';
import { Config } from '../../../config/env.config';
import { Logger } from '../../utils/logger';

export class PostgresClient {
  private static pool: Pool | null = null;

  public static getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        host: Config.db.host,
        port: Config.db.port,
        database: Config.db.name,
        user: Config.db.user,
        password: Config.db.password,
        max: 10,
        idleTimeoutMillis: 30000,
      });
      Logger.info(`Connected to PostgreSQL database pool: ${Config.db.name}`);
    }
    return this.pool;
  }

  public static async query<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const pool = this.getPool();
      const res = await pool.query<T>(sql, params);
      const duration = Date.now() - start;
      Logger.info(`DB Query executed in ${duration}ms: ${sql.substring(0, 80)}...`);
      return res;
    } catch (err: any) {
      Logger.error(`DB Query Error: ${err.message} | SQL: ${sql}`);
      throw err;
    }
  }

  public static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      Logger.info('PostgreSQL pool disconnected');
    }
  }
}
