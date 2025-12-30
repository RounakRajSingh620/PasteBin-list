const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");

router.get("/", async (req, res) => {
  try {
    await prisma.paste.count();
    res.json({ ok: true });
  } catch (err) {
    console.log("DB ERROR ->", err);
    res.json({ ok: false, error: err.message || "db error" });
  }
});

module.exports = router;
