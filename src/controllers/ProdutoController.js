const ProdutoModel = require('../models/ProdutoModel');

const ProdutoController = {

  listarPorCaracteristica: (req, res) => {
    const { caracteristica } = req.params;
    ProdutoModel.getProdutosPorCaracteristica(caracteristica, (err, resultados) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar produtos' });
      res.json(resultados);
    });
  },

  listarTodos: (req, res) => {
    ProdutoModel.getTodos((err, resultados) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar produtos' });
      res.json(resultados);
    });
  },

  listarCaracteristicas: (req, res) => {
    ProdutoModel.getCaracteristicas((err, resultados) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar características' });
      res.json(resultados);
    });
  },

  listarCaracteristicasDoProduto: (req, res) => {
    const { id } = req.params;
    ProdutoModel.getCaracteristicasDoProduto(id, (err, resultados) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar características do produto' });
      res.json(resultados);
    });
  },

  criar: (req, res) => {
    const produto = req.body;
    const caracteristicas = produto.caracteristicas || [];

    ProdutoModel.criar(produto, (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criar produto' });

      const novoId = result.insertId;

      ProdutoModel.vincularCaracteristicas(novoId, caracteristicas, (err2) => {
        if (err2) return res.status(500).json({ erro: 'Produto criado mas erro ao vincular características' });
        res.status(201).json({ mensagem: 'Produto criado com sucesso', id: novoId });
      });
    });
  },

  atualizar: (req, res) => {
    const { id } = req.params;
    const produto = req.body;
    const caracteristicas = produto.caracteristicas || [];

    ProdutoModel.atualizar(id, produto, (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar produto' });

      ProdutoModel.deletarCaracteristicas(id, (err2) => {
        if (err2) return res.status(500).json({ erro: 'Erro ao atualizar características' });

        ProdutoModel.vincularCaracteristicas(id, caracteristicas, (err3) => {
          if (err3) return res.status(500).json({ erro: 'Erro ao vincular características' });
          res.json({ mensagem: 'Produto atualizado com sucesso' });
        });
      });
    });
  },

  deletar: (req, res) => {
    const { id } = req.params;

    ProdutoModel.deletarCaracteristicas(id, (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao deletar características' });

      ProdutoModel.deletar(id, (err2) => {
        if (err2) return res.status(500).json({ erro: 'Erro ao deletar produto' });
        res.json({ mensagem: 'Produto deletado com sucesso' });
      });
    });
  }
};

module.exports = ProdutoController;