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

          const idCompra = result.insertId;
          // Insertar cada producto en detalle_compras
          let pendientes = cart.length;
          if (pendientes === 0) return res.json({ id: idCompra });

          cart.forEach(item => {
            // Buscar el id_producto por nombre
            conexion.query(
              'SELECT id_producto FROM productos WHERE nombre = ? LIMIT 1',
              [item.name],
              (err3, productos) => {
                if (err3) {
                  console.error('Error buscando producto:', err3);
                  pendientes--;
                  if (pendientes === 0) res.json({ id: idCompra });
                  return;
                }
                if (productos.length === 0) {
                  console.error(`Producto no encontrado: ${item.name}`);
                  pendientes--;
                  if (pendientes === 0) res.json({ id: idCompra });
                  return;
                }
                const idProducto = productos[0].id_producto;
                conexion.query(
                  'INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unit) VALUES (?,?,?,?)',
                  [idCompra, idProducto, item.quantity, item.price],
                  (err4) => {
                    if (err4) {
                      console.error('Error insertando detalle:', err4);
                    }
                    pendientes--;
                    if (pendientes === 0) res.json({ id: idCompra });
                  }
                );
              }
            );
          });
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
    `SELECT c.id_compra, c.total, c.fecha, c.detalles
     FROM compras c
     JOIN usuarios u ON c.id_usuario = u.id_usuario
     WHERE u.correo = ?
     ORDER BY c.fecha DESC`,
    [userSession.email],
    (err, compras) => {
      if (err) return res.status(500).json([]);
      if (!compras.length) return res.json([]);
      // Por cada compra, obtener los productos
      let pendientes = compras.length;
      compras.forEach((compra, idx) => {
        conexion.query(
          `SELECT d.cantidad, d.precio_unit, p.nombre
           FROM detalle_compras d
           JOIN productos p ON d.id_producto = p.id_producto
           WHERE d.id_compra = ?`,
          [compra.id_compra],
          (err2, productos) => {
            compras[idx].productos = productos || [];
            pendientes--;
            if (pendientes === 0) res.json(compras);
          }
        );
      });
    }
  );
});

// Eliminar producto del carrito (frontend)
router.post('/eliminar-del-carrito', (req, res) => {
  const { name } = req.body;
  // Esto solo es para el frontend, el carrito está en localStorage, así que solo responde ok
  res.json({ ok: true });
});

module.exports = router;
