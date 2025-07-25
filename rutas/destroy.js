const express = require('express');
const router  = express.Router();

/* ---------- Logout ---------- */
router.get('/api/logout', (req,res)=> req.session.destroy(()=> res.redirect('/')));

module.exports = router;
