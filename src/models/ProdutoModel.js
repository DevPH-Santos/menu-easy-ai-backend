const db = require('../config/db');

const ProdutoModel = {

  getProdutosPorCaracteristica: (nomeCaracteristica, callback) => {
    const sql = `
      SELECT p.pk_id_prod, p.nome_prod, p.descricao_prod, p.preco_prod, p.img_prod
      FROM Produtos p
      JOIN Produto_Caracteristica pc ON p.pk_id_prod = pc.fk_id_prod
      JOIN Caracteristica c ON pc.fk_id_caracteristica = c.pk_id_caracteristica
      WHERE c.nome_caracteristica = ?
      ORDER BY p.pk_id_prod
    `;
    db.query(sql, [nomeCaracteristica], callback);
  },

  getTodos: (callback) => {
    db.query(`SELECT * FROM Produtos ORDER BY pk_id_prod`, callback);
  },

  getCaracteristicas: (callback) => {
    db.query(`SELECT * FROM Caracteristica ORDER BY nome_caracteristica`, callback);
  },

  getCaracteristicasDoProduto: (id, callback) => {
    const sql = `
      SELECT c.pk_id_caracteristica, c.nome_caracteristica
      FROM Caracteristica c
      JOIN Produto_Caracteristica pc ON c.pk_id_caracteristica = pc.fk_id_caracteristica
      WHERE pc.fk_id_prod = ?
    `;
    db.query(sql, [id], callback);
  },

  criar: (produto, callback) => {
    const sql = `INSERT INTO Produtos (nome_prod, descricao_prod, preco_prod, prod_lucro_porcent, img_prod) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [produto.nome_prod, produto.descricao_prod, produto.preco_prod, produto.prod_lucro_porcent || 0, produto.img_prod || null], callback);
  },

  vincularCaracteristicas: (produtoId, caracteristicaIds, callback) => {
    if (!caracteristicaIds || caracteristicaIds.length === 0) return callback(null);
    const values = caracteristicaIds.map(id => [produtoId, id]);
    db.query(`INSERT INTO Produto_Caracteristica (fk_id_prod, fk_id_caracteristica) VALUES ?`, [values], callback);
  },

  atualizar: (id, produto, callback) => {
    const sql = `UPDATE Produtos SET nome_prod=?, descricao_prod=?, preco_prod=?, prod_lucro_porcent=?, img_prod=? WHERE pk_id_prod=?`;
    db.query(sql, [produto.nome_prod, produto.descricao_prod, produto.preco_prod, produto.prod_lucro_porcent || 0, produto.img_prod || null, id], callback);
  },

  deletarCaracteristicas: (produtoId, callback) => {
    db.query(`DELETE FROM Produto_Caracteristica WHERE fk_id_prod = ?`, [produtoId], callback);
  },

  deletar: (id, callback) => {
    db.query(`DELETE FROM Produtos WHERE pk_id_prod = ?`, [id], callback);
  }
};

module.exports = ProdutoModel;