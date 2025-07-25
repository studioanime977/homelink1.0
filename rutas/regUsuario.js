const bcryptjs = require('bcryptjs');
const db = require('./db');
const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const pool    = require('../config/conexion');

// Configuración Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/api/registro', upload.single('foto'), async (req, res) => {
  const { nombre, apellido, correo, contrasena, confirmarContrasena } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena)
    return res.status(400).json({ ok:false, error:'Faltan campos' });

  if (contrasena !== confirmarContrasena)
    return res.json({ ok:false, error:'Las contraseñas no coinciden' });

  try {
    const [dup] = await pool.execute('SELECT correo FROM usuarios WHERE correo=?',[correo.trim()]);
    if (dup.length) return res.json({ ok:false, error:'Correo ya registrado' });

    const hash = await bcrypt.hash(contrasena,10);
    const foto = req.file ? `/uploads/${req.file.filename}` : '/img/default.png';
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`;

    await pool.execute(
      'INSERT INTO usuarios (id_usuario,nombre,correo,contrasena,foto) VALUES (UUID(),?,?,?,?)',
      [nombreCompleto, correo.trim(), hash, foto]
    );
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'Error de servidor' });
  }
});

async function registrarUsuario(datos, res) {
  const { campoApe, campoNom, selectSex, campoFec, campoTel, campoDir, campoBar, campoMai, campoPas } = datos;
  const saltRounds = 10;

  try {
    const hashedPas = await bcryptjs.hash(campoPas, saltRounds);

    const sql = `INSERT INTO usuarios (ape, nom, sex, fec, tel, dir, bar, mai, pas)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [campoApe, campoNom, selectSex, campoFec, campoTel, campoDir, campoBar, campoMai, hashedPas], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error en el servidor');
      } else {
        res.status(200).send('Usuario registrado correctamente');
      }
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).send('Error interno');
  }
}

module.exports = { registrarUsuario, router };
