require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { neonConfig } = require("@neondatabase/serverless");

// Required for Vercel edge/serverless runtimes
neonConfig.fetchConnectionCache = true;

let prisma;

if (!global._prisma) {

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1
  });

  const adapter = new PrismaPg(pool);

  global._prisma = new PrismaClient({
    adapter
  });
}

prisma = global._prisma;

module.exports = prisma;
