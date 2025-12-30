const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");

router.post("/", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "content must be a non-empty string" });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1))
      return res.status(400).json({ error: "ttl_seconds must be integer >= 1" });

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1))
      return res.status(400).json({ error: "max_views must be integer >= 1" });

    const paste = await prisma.paste.create({
      data: {
        content,
        ttlSeconds: ttl_seconds ?? null,
        maxViews: max_views ?? null
      }
    });

    const base = process.env.BASE_URL || `http://localhost:${process.env.PORT}`;

 res.status(201).json({
  id: paste.id,
  url: `/p/${paste.id}`
});


  } catch {
    res.status(400).json({ error: "invalid request" });
  }
});

module.exports = router;
