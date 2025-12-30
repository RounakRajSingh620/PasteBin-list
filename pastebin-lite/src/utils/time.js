// function getCurrentTime(req) {
//   const testMode = process.env.TEST_MODE === "1";

//   if (testMode) {
//     const ms = req.headers["x-test-now-ms"];
//     if (ms) return new Date(Number(ms));
//   }

//   return new Date();
// }

// function computeExpiry(paste, now) {
//   let expiresAt = null;

//   const hasTTL =
//     paste.ttlSeconds !== null &&
//     paste.ttlSeconds !== undefined &&
//     Number(paste.ttlSeconds) >= 1;

//   if (hasTTL) {
//     const ttlMs = Number(paste.ttlSeconds) * 1000;
//     const created = new Date(paste.createdAt);
//     expiresAt = new Date(created.getTime() + ttlMs);

//     if (now >= expiresAt) {
//       return {
//         expiresAt,
//         remainingViews: null,
//         unavailable: true,
//       };
//     }
//   }

//   const hasViewLimit =
//     paste.maxViews !== null &&
//     paste.maxViews !== undefined &&
//     Number(paste.maxViews) >= 1;

//   let remainingViews = null;

//   if (hasViewLimit) {
//     const max = Number(paste.maxViews);
//     const used = Number(paste.usedViews);

//     remainingViews = Math.max(0, max - used);

//     if (used >= max) {
//       return {
//         expiresAt,
//         remainingViews,
//         unavailable: true,
//       };
//     }
//   }

//   return {
//     expiresAt,
//     remainingViews,
//     unavailable: false,
//   };
// }


// module.exports = { getCurrentTime, computeExpiry };


function getCurrentTime(req) {
  const testMode = process.env.TEST_MODE === "1";

  if (testMode) {
    const ms = req.headers["x-test-now-ms"];
    if (ms) return new Date(Number(ms));
  }

  return new Date();
}

function computeExpiry(paste, now) {
  let expiresAt = null;

  const hasTTL =
    paste.ttlSeconds != null &&
    Number(paste.ttlSeconds) >= 1;

  if (hasTTL) {
    const created = new Date(paste.createdAt);
    expiresAt = new Date(created.getTime() + paste.ttlSeconds * 1000);

    if (now >= expiresAt) {
      return { expiresAt, remainingViews: null, unavailable: true };
    }
  }

  const hasViewLimit =
    paste.maxViews != null &&
    Number(paste.maxViews) >= 1;

  let remainingViews = null;

  if (hasViewLimit) {
    remainingViews = Math.max(0, paste.maxViews - paste.usedViews);

    if (paste.usedViews >= paste.maxViews) {
      return { expiresAt, remainingViews, unavailable: true };
    }
  }

  return { expiresAt, remainingViews, unavailable: false };
}

module.exports = { getCurrentTime, computeExpiry };
