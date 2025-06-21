const express = require("express");
const router = express.Router();
const conexion = require("../config/conexion");
const bcryptjs = require("bcryptjs");

router.post("/codlogin", (req, res) => {
    const correo = req.body.campoUsu;
    const pass = req.body.campoPas;
    conexion.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, result) => {
        if (err) return res.status(500).send("Error en el servidor");
        if (result.length === 0) return res.status(401).send("Usuario no encontrado");
        const usuario = result[0];
        const valid = await bcryptjs.compare(pass, usuario.contrasena);
        if (valid) {
            res.json({ isLoggedIn: true, email: correo, name: usuario.nombre });
        } else {
            res.status(401).send("Contraseña incorrecta");
        }
    });
});

module.exports = router;
