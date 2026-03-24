const db = require('../config/db');

const criarUsuario = (usuario, callback) => {
  const sql = `
    INSERT INTO Usuario (pk_cpf_usuario, senha_usuario, idade_usuario, admin_usuario)
    VALUES (?, ?, ?, 0)
  `;
  db.query(sql, [usuario.cpf, usuario.senha, usuario.idade], callback);
};

const buscarPorCpf = (cpf, callback) => {
  db.query(`SELECT * FROM Usuario WHERE pk_cpf_usuario = ?`, [cpf], callback);
};

// Salvar preferências — apaga as antigas e insere as novas
const salvarPreferencias = (cpf, idsCaracteristicas, callback) => {
  db.query(`DELETE FROM Preferencia_Usuario WHERE fk_cpf_usuario = ?`, [cpf], (err) => {
    if (err) return callback(err);
    if (!idsCaracteristicas || idsCaracteristicas.length === 0) return callback(null);
    const values = idsCaracteristicas.map(id => [cpf, id]);
    db.query(
      `INSERT INTO Preferencia_Usuario (fk_cpf_usuario, fk_id_caracteristica) VALUES ?`,
      [values],
      callback
    );
  });
};

// Buscar IDs das características pelo nome
const buscarIdsPorNomes = (nomes, callback) => {
  if (!nomes || nomes.length === 0) return callback(null, []);
  db.query(
    `SELECT pk_id_caracteristica FROM Caracteristica WHERE nome_caracteristica IN (?)`,
    [nomes],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results.map(r => r.pk_id_caracteristica));
    }
  );
};

const temPreferencias = (cpf, callback) => {
  db.query(
    `SELECT COUNT(*) as total FROM Preferencia_Usuario WHERE fk_cpf_usuario = ?`,
    [cpf],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total > 0);
    }
  );
};

module.exports = {
  criarUsuario,
  buscarPorCpf,
  salvarPreferencias,
  buscarIdsPorNomes,
  temPreferencias
};