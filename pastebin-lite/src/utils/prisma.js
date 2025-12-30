// require("dotenv").config();

// const { PrismaClient } = require("@prisma/client");
// const { Pool } = require("pg");
// const { PrismaPg } = require("@prisma/adapter-pg");

// // create pg connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// // wrap it in Prisma adapter
// const adapter = new PrismaPg(pool);

// // pass adapter to PrismaClient
// const prisma = new PrismaClient({
//   adapter,
// });

// module.exports = prisma;
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
