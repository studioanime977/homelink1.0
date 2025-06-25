const express = require('express');
const router = express.Router();

// GET /api/productos
router.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Listado de productos (placeholder)' });
});

// TODO: añade aquí el resto de endpoints: POST crear, PUT/DELETE, etc.

module.exports = router;
