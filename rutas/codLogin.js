const express = require('express');
const bcrypt  = require('bcryptjs');
const pool    = require('../config/db');

const router  = express.Router();

/* ---------- Login ---------- */
router.post('/api/codlogin', async (req, res) => {
  const email = req.body.campoUsu ?? req.body.correo;
  const pass  = req.body.campoPas  ?? req.body.contrasena;

  try {
    const [rows] = await pool.execute(
      'SELECT id_usuario,nombre,correo,contrasena,foto FROM usuarios WHERE correo=?',
      [email]);
    if (!rows.length) return res.json({ ok:false, error:'Usuario no encontrado' });

    const user  = rows[0];
    const match = await bcrypt.compare(pass, user.contrasena);
    if (!match) return res.json({ ok:false, error:'Contraseña incorrecta' });

    const usuario = {
      id    : user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      foto  : user.foto
    };
    req.session.usuario = usuario;
    res.json({ ok:true, usuario });
  } catch (e){
    console.error(e);
    res.status(500).json({ ok:false, error:'Error de servidor' });
  }
});

module.exports = router;
