exports.middlewareGlobal = (req, res, next) => { // Middleware para incluir dados em todas as views
  res.locals.errors = req.flash('errors'); // Capturando as mensagens de erro
  res.locals.success = req.flash('success'); // Capturando as mensagens de sucesso
  res.locals.user = req.session.user; // Capturando o usuário da seção
  next();
};

exports.checkCsrfError = (err, req, res, next) => { // Middleware para verificar erros no Csrf
  if(err) {
    return res.render('404');
  }

  next();
};

exports.csrfMiddleware = (req, res, next) => { // Middleware para disponibilizar o token do Csrf
  res.locals.csrfToken = req.csrfToken();

  next();
};

exports.loginRequired = (req, res, next) => { // Middleware para verificar se o usuário está logado
  if(!req.session.user) { // Se o usuário não estiver logado ele é redirecionado a página inicial e um erro é exibido
    req.flash('errors', 'Você precisa fazer login.');
    req.session.save(() => res.redirect('/'));
    return;
  }

  next();
};