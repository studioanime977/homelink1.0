const express = require('express');
const bcrypt  = require('bcryptjs');
const pool    = require('../config/db');
const upload  = require('../config/multer');

const router  = express.Router();

/* ---------- Registro ---------- */
router.post('/api/registro', upload.single('foto'), async (req, res) => {
  const { nombre, apellido, correo, contrasena, confirmarContrasena } = req.body;
  if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena) {
    return res.status(400).json({ ok:false, error:'Faltan campos' });
  }
  if (contrasena !== confirmarContrasena) {
    return res.json({ ok:false, error:'Las contraseñas no coinciden' });
  }

  try {
    const [dup] = await pool.execute('SELECT correo FROM usuarios WHERE correo=?',[correo.trim()]);
    if (dup.length) return res.json({ ok:false, error:'Correo ya registrado' });

    const hash = await bcrypt.hash(contrasena,10);
    const foto = req.file ? `/img/usuarios/${req.file.filename}` : null;

    await pool.execute(
      'INSERT INTO usuarios (id_usuario,nombre,correo,contrasena,foto) VALUES (UUID(),?,?,?,?)',
      [`${nombre.trim()} ${apellido.trim()}`, correo.trim(), hash, foto]
    );
    res.json({ ok:true });
  } catch (e){
    console.error(e);
    res.status(500).json({ ok:false, error:'Error de servidor' });
  }
});

module.exports = router;
