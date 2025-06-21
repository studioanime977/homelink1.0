const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/admin/create-table
router.post('/admin/create-table', (req, res) => {
  const { tableName, columns, foreignKeys } = req.body;
  if (!tableName || !Array.isArray(columns))
    return res.status(400).send('Tabla o columnas inválidas');

  // Construir definición de columnas
  const colsDef = columns.map(col => {
    let def = `\`${col.name}\` ${col.type}`;
    if (col.autoIncrement) def += ' AUTO_INCREMENT';
    if (col.primary) def += ' PRIMARY KEY';
    if (col.nullable === false) def += ' NOT NULL';
    return def;
  }).join(', ');

  // Construir FKs
  const fksDef = (foreignKeys || []).map((fk, i) =>
    `CONSTRAINT \`fk_${tableName}_${i}\` FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.refTable}\` (\`${fk.refColumn}\`) ON DELETE ${fk.onDelete || 'NO ACTION'} ON UPDATE ${fk.onUpdate || 'NO ACTION'}`
  ).join(', ');

  const sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${colsDef}${fksDef ? ', ' + fksDef : ''}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  pool.query(sql, (err) => {
    if (err) return res.status(500).send('Error al crear tabla: ' + err.message);
    res.send('Tabla ' + tableName + ' creada correctamente.');
  });
});

module.exports = router;
