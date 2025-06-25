const express = require('express');
const router = express.Router();

// Ejemplo de ruta de compras
router.post('/', (req, res) => {
    // Tu lógica aquí
    res.json({ message: "Compra realizada (implementa la lógica real)" });
});

module.exports = router;
