const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/avaliacoes
// Body: { cpf, nota }
// Salva UMA avaliação por pedido
router.post('/', (req, res) => {
  const { cpf, nota } = req.body;

  if (!cpf || !nota) {
    return res.status(400).json({ erro: 'Informe cpf e nota' });
  }

  // 1. Inserir UMA avaliação por pedido
  db.query(
    `INSERT INTO Avaliacao (nota, fk_cpf_usuario) VALUES (?, ?)`,
    [nota, cpf],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar avaliação: ' + err.message });

      // 2. Contar total de avaliações do usuário
      db.query(
        `SELECT COUNT(*) as total FROM Avaliacao WHERE fk_cpf_usuario = ?`,
        [cpf],
        (err2, results) => {
          if (err2) return res.json({ mensagem: 'Avaliação salva' });

          const total = results[0].total;

          // 3. Verificar se atingiu múltiplo de 10
          if (total > 0 && total % 10 === 0) {
            db.query(
              `INSERT INTO Recompensa_Avaliacao (recompensa_data, fk_cpf_usuario) VALUES (NOW(), ?)`,
              [cpf],
              (err3) => {
                if (err3) {
                  console.error('Erro ao salvar recompensa:', err3);
                  return res.json({ mensagem: 'Avaliação salva', recompensa: false });
                }
                return res.json({
                  mensagem: 'Avaliação salva com sucesso',
                  recompensa: true,
                  desconto: 10,
                  total_avaliacoes: total
                });
              }
            );
          } else {
            res.json({
              mensagem: 'Avaliação salva com sucesso',
              recompensa: false,
              total_avaliacoes: total,
              proxima_recompensa: 10 - (total % 10)
            });
          }
        }
      );
    }
  );
});

// GET /api/avaliacoes/recompensa/:cpf
// Verifica se usuário tem recompensa disponível
router.get('/recompensa/:cpf', (req, res) => {
  const { cpf } = req.params;
  db.query(
    `SELECT pk_id_recompensa FROM Recompensa_Avaliacao 
     WHERE fk_cpf_usuario = ? AND recompensa_usada = 0 
     LIMIT 1`,
    [cpf],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar recompensa' });
      if (results.length > 0) {
        res.json({ tem_recompensa: true, id: results[0].pk_id_recompensa, desconto: 10 });
      } else {
        res.json({ tem_recompensa: false });
      }
    }
  );
});

// PUT /api/avaliacoes/recompensa/:id/usar
// Marca recompensa como usada após pedido confirmado
router.put('/recompensa/:id/usar', (req, res) => {
  const { id } = req.params;
  db.query(
    `UPDATE Recompensa_Avaliacao SET recompensa_usada = 1 WHERE pk_id_recompensa = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao usar recompensa' });
      res.json({ mensagem: 'Recompensa aplicada com sucesso' });
    }
  );
});

module.exports = router;