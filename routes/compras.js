const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');

// Registrar compra
router.post('/comprar', (req, res) => {
  const { userSession, cart } = req.body;
  if (!userSession || !userSession.isLoggedIn) 
    return res.status(401).json({ msg: 'No autorizado' });

  conexion.query(
    'SELECT id_usuario FROM usuarios WHERE correo = ?',
    [userSession.email],
    (err, users) => {
      if (err) return res.status(500).json({ msg: 'Error de servidor' });
      if (users.length === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });
      const idUsuario = users[0].id_usuario;
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const detalles = JSON.stringify(cart);
      conexion.query(
        'INSERT INTO compras (id_usuario, detalles, total) VALUES (?,?,?)',
        [idUsuario, detalles, total],
        (err2, result) => {
          if (err2) return res.status(500).json({ msg: 'Error al guardar compra' });
          res.json({ id: result.insertId });
        }
      );
    }
  );
});

// Listar compras del usuario
router.post('/miscompras', (req, res) => {
  const { userSession } = req.body;
  if (!userSession || !userSession.isLoggedIn) 
    return res.status(401).json([]);
  conexion.query(
    \`SELECT id_compra, detalles, total, fecha
     FROM compras c
     JOIN usuarios u ON c.id_usuario = u.id_usuario
     WHERE u.correo = ?\`,
    [userSession.email],
    (err, rows) => {
      if (err) return res.status(500).json([]);
      res.json(rows);
    }
  );
});

module.exports = router;
