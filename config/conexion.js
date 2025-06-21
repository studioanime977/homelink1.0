const mysql = require("mysql");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // pone tu clave si aplica
    database: "homelink"
});

conexion.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conexión a la base de datos establecida.");
});

module.exports = conexion;
