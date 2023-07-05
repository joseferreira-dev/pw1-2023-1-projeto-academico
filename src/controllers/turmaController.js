const { Turma } = require('../models/TurmaModel'); // Importando o modelo de turma
const { Professor } = require('../models/ProfessorModel'); // Importando o modelo de professor
const { Aluno } = require('../models/AlunoModel'); // Importando o modelo de aluno

exports.index = async(req, res) => { // Exibe a página de edição de turma
  const professores = await Professor.buscaProfessores();
  const alunos = await Aluno.buscaAlunos();
  res.render('turma', {
    turma: {}, // Exibe a página sem nenhum dado no formulário
    professores,
    alunos
  });
};

exports.register = async(req, res) => {
  try {
    const turma = new Turma(req.body); // Criando uma instância de turma
    await turma.register(); // Chama o método register() para cadastrar a turma
    console.log(turma)

    if(turma.errors.length > 0) { // Verifica se existem erros decorrentes da função de registro
      req.flash('errors', turma.errors); // Adicionando a mensagem de erro nas flash messages
      req.session.save(() => res.redirect('back')); // Redirecionando para a página original
      return; // Garantindo o encerramento da função dentro do bloco if()
    }

    req.flash('success', 'Turma cadastrada com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.save(() => res.redirect(`/turma/index/${turma.turma._id}`)); // Salvando a seção e redirecionando para a página de editar da última turma salva
    return;
  } catch(e) { // Redireciona para a página 404 caso ocorra algum erro
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

  const turma = await Turma.buscaPorId(req.params.id); // Realiza a busca de uma turma pelo id usando o método buscaPorId()
  if(!turma) return res.render('404'); // Redireciona para a página caso a turma não seja encontrada

  const professoresBuscados = await Professor.buscaProfessores();

  const professores = [];
  professoresBuscados.forEach(professor => professores.push(professor.nome));

  professores.push(turma.professor.nome);

  const alunos = await Aluno.buscaAlunos();

  res.render('turma-edit', { turma, professores, alunos }); // Exibe a página com os dados da turma no formulário
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro
    const turma = new Turma(req.body); // Criando uma instância de turma
    await turma.edit(req.params.id); // Chama o método edit() para editar a turma

    if(turma.errors.length > 0) { // Verifica se existem erros decorrentes da função de editar
      req.flash('errors', turma.errors); // Adicionando a mensagem de erro nas flash messages
      req.session.save(() => res.redirect('back')); // Redirecionando para a página original
      return; // Garantindo o encerramento da função dentro do bloco if()
    }

    req.flash('success', 'Turma editada com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.save(() => res.redirect(`/turma/index/${turma.turma._id}`)); // Salvando a seção e redirecionando para a página de editar da última turma salva
    return;
  } catch(e) { // Redireciona para a página 404 caso ocorra algum erro
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

  const turma = await Turma.delete(req.params.id); // Deleta e salva a turma apagada em uma constante
  if(!turma) return res.render('404'); // Redireciona para a página caso a turma não seja encontrada

  req.flash('success', 'Turma apagada com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
  req.session.save(() => res.redirect('back')); // Salvando a seção e redirecionando para a página original
  return;
};

exports.view = async(req, res) => { // Exibe a página de edição de turma
  if(!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

  const turma = await Turma.buscaPorId(req.params.id); // Realiza a busca de uma turma pelo id usando o método buscaPorId()
  if(!turma) return res.render('404'); // Redireciona para a página caso a turma não seja encontrada

  const professor = turma.professor;

  res.render('exibir', { turma, professor }); // Exibe a página com os dados da turma no formulário
};
