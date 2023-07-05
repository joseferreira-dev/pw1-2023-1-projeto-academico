const { Turma } = require('../models/TurmaModel');

// Renderiza a página inicial
exports.index = async(req, res) => {
  const turmas = await Turma.buscaTurmas();
  res.render('index', { turmas });
};

// Renderiza a página de gestão de pessoas
exports.pessoas = async(req, res) => {
  res.render('pessoas');
};
