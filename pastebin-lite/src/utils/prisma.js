require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// Reuse Prisma across serverless invocations
let prisma;

if (!global._prisma) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },

    // Prevent connection hang on Vercel serverless
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000
  });

  const adapter = new PrismaPg(pool);

  global._prisma = new PrismaClient({
    adapter
  });
}

prisma = global._prisma;

module.exports = prisma;
