const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { getCurrentTime, computeExpiry } = require("../utils/time");

router.get("/:id", async (req, res) => {
  const paste = await prisma.paste.findUnique({
    where: { id: req.params.id }
  });

  if (!paste) return res.status(404).json({ error: "not found" });

  const now = getCurrentTime(req);

  const { expiresAt, remainingViews, unavailable } =
    computeExpiry(paste, now);

  if (unavailable)
    return res.status(404).json({ error: "not found" });

  await prisma.paste.update({
    where: { id: paste.id },
    data: { usedViews: paste.usedViews + 1 }
  });

  res.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: expiresAt ? expiresAt.toISOString() : null
  });
});

module.exports = router;
