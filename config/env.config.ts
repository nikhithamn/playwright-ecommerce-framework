import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const Config = {
  env: process.env.ENV || 'local',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5001/api',

  // Database Connection Config
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'qa_ecommerce',
    user: process.env.DB_USER || 'qa_user',
    password: process.env.DB_PASSWORD || 'qa_pass',
  },

  // Deterministic Seed Accounts
  users: {
    customer: {
      email: process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@test.com',
      password: process.env.DEFAULT_CUSTOMER_PASSWORD || 'Password123!',
    },
    admin: {
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@test.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
    },
  },

  // Execution Timeouts
  timeouts: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
    expectTimeout: 10000,
  },
};
