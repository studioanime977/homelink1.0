const express = require("express");
const router = express.Router();

// ejemplo
router.post("/login", (req, res) => {
  res.send("Login OK");
});

module.exports = router; // ✅ MUY IMPORTANTE

