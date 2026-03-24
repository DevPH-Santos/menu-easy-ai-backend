const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// ✅ CADASTRO
const cadastrarUsuario = (usuario, callback) => {

  // validar campos
  if (!usuario.cpf || !usuario.senha || !usuario.idade) {
    return callback(new Error("Campos incompletos"));
  }

  // limpar CPF
  const cpfLimpo = usuario.cpf.replace(/\D/g, '');
  usuario.cpf = cpfLimpo;

  // criptografar senha
  bcrypt.hash(usuario.senha, 10, (err, hash) => {
    if (err) return callback(err);

    usuario.senha = hash;

    usuarioModel.criarUsuario(usuario, (err, result) => {
      if (err) return callback(err);

      callback(null, result);
    });
  });
};

const loginUsuario = (dados, callback) => {

  if (!dados.cpf || !dados.senha) {
    return callback(new Error("CPF e senha obrigatórios"));
  }

  const cpfLimpo = dados.cpf.replace(/\D/g, '');

  usuarioModel.buscarPorCpf(cpfLimpo, (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) {
      return callback(new Error("Usuário não encontrado"));
    }

    const usuario = results[0];

    bcrypt.compare(dados.senha, usuario.senha_usuario, (err, senhaValida) => {
      if (err) return callback(err);

      if (!senhaValida) {
        return callback(new Error("Senha inválida"));
      }

      delete usuario.senha_usuario;
      
    });
  });
};

module.exports = {
  cadastrarUsuario,
  loginUsuario
};