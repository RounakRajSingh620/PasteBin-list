const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const prisma = require("../utils/prisma");
const { getCurrentTime, computeExpiry } = require("../utils/time");

router.get("/:id", async (req, res) => {
  const paste = await prisma.paste.findUnique({
    where: { id: req.params.id }
  });

  if (!paste) return res.status(404).send("Not Found");

  const now = getCurrentTime(req);

  const { unavailable } = computeExpiry(paste, now);

  if (unavailable) return res.status(404).send("Not Found");

  await prisma.paste.update({
    where: { id: paste.id },
    data: { usedViews: paste.usedViews + 1 }
  });

  const html = fs
    .readFileSync(path.join(__dirname, "../views/paste.html"), "utf8")
    .replace("{{CONTENT}}", paste.content);

  res.send(html);
});

module.exports = router;
