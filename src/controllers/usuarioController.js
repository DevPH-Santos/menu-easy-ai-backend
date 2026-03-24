const usuarioService = require('../services/usuarioService');
const usuarioModel = require('../models/usuarioModel');

const cadastrar = (req, res) => {
  usuarioService.cadastrarUsuario(req.body, (err, result) => {
    if (err) return res.status(400).json({ erro: err.message });
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  });
};

const login = (req, res) => {
  usuarioService.loginUsuario(req.body, (err, usuario) => {
    if (err) return res.status(401).json({ erro: err.message });
    res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario });
  });
};

// Mapeamento: valores do frontend → nomes no banco
const MAPA_PREFERENCIAS = {
  // food_type
  beef:     'carne',
  chicken:  'frango',
  pasta:    'massa',
  burgers:  'lanche',
  salads:   'vegetariano',
  fish:     'peixe',
  // dietary_restrictions
  lactose:  'tem_lactose',
  gluten:   'gluten',
  vegan:    'vegano',
  vegetarian: 'vegetariano',
  no_spicy: 'pimenta',
  // meal_preferences
  light_meals: 'fitness',
  fast_meals:  'preparo_rapido',
  cheap_meals: 'prato_principal',
  spicy:       'pimenta',
};

const salvarPreferencias = (req, res) => {
  const { cpf, food_type = [], dietary_restrictions = [], meal_preferences = [] } = req.body;

  if (!cpf) return res.status(400).json({ erro: 'CPF obrigatório' });

  // Converter valores do frontend para nomes do banco (sem duplicatas)
  const todosSelecionados = [...food_type, ...dietary_restrictions, ...meal_preferences];
  const nomesNoBanco = [...new Set(
    todosSelecionados
      .map(v => MAPA_PREFERENCIAS[v])
      .filter(Boolean)
  )];

  // Buscar IDs das características pelos nomes
  usuarioModel.buscarIdsPorNomes(nomesNoBanco, (err, ids) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar características' });

    usuarioModel.salvarPreferencias(cpf, ids, (err2) => {
      if (err2) return res.status(500).json({ erro: 'Erro ao salvar preferências' });
      res.json({ mensagem: 'Preferências salvas com sucesso' });
    });
  });
};

const checarPreferencias = (req, res) => {
  const { cpf } = req.params;
  usuarioModel.temPreferencias(cpf, (err, tem) => {
    if (err) return res.status(500).json({ erro: 'Erro ao verificar preferências' });
    res.json({ tem_preferencias: tem });
  });
};

module.exports = { cadastrar, login, salvarPreferencias, checarPreferencias };