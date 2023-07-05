const { Login } = require('../models/LoginModel'); // Importando o modelo de login

exports.index = (req, res) => { // Exibe a página de login
  if(req.session.user) return res.render('login-logado'); // Se exirtir um usuário da seção a página exibida não terá os formulários
  return res.render('login'); // Página exibida se não existir usuário logado
};

exports.register = async function(req, res) {
  try {
    const login = new Login(req.body); // Criando uma instância de Login
    await login.register(); // Chamando o método register() da classe Login para realizar o cadastro

    if(login.errors.length > 0) { // Verifica se existem erros decorrentes da função de registro
      req.flash('errors', login.errors); // Adicionando a mensagem de erro nas flash messages
      req.session.save(function() { // Salvando a seção
        return res.redirect('back'); // Redirecionando para a página original
      });
      return; // Garantindo o encerramento da função dentro do bloco if()
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.save(function() { // Salvando a seção
      return res.redirect('back'); // Redirecionando para a página original
    });
  } catch(e) { // Redireciona para a página 404 caso ocorra algum erro
    console.log(e);
    return res.render('404');
  }
};

exports.login = async function(req, res) {
  try {
    const login = new Login(req.body); // Criando uma instância de Login
    await login.login(); // Chamando o método login() da classe Login para realizar o cadastro

    if(login.errors.length > 0) { // Verifica se existem erros retornados da função de login
      req.flash('errors', login.errors); // Adicionando a mensagem de erro nas flash messages
      req.session.save(function() { // Salvando a seção
        return res.redirect('back'); // Redirecionando para a página original
      });
      return; // Garantindo o encerramento da função dentro do bloco if()
    }

    req.flash('success', 'Você entrou no sistema.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.user = login.user; // Alterando o usuário da seção
    req.session.save(function() { // Salvando a seção
      return res.redirect('back'); // Redirecionando para a página original
    });
  } catch(e) { // Redireciona para a página 404 caso ocorra algum erro
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function(req, res) { // Desrói a sessão atual depois de relizado o logout
  req.session.destroy();
  res.redirect('/');
};

