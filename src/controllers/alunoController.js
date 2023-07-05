const { Aluno } = require('../models/AlunoModel'); // Importando o modelo de aluno

exports.index = (req, res) => { // Exibe a página de edição de aluno
    res.render('aluno', {
        aluno: {} // Exibe a página sem nenhum dado no formulário
    });
};

exports.list = async (req, res) => { // Exibe a página de listagem de alunos
    const alunos = await Aluno.buscaAlunos();
    res.render('alunos', { alunos });
};

exports.register = async (req, res) => {
    try {
        const aluno = new Aluno(req.body); // Criando uma instância de aluno
        await aluno.register(); // Chama o método register() para cadastrar o aluno

        if (aluno.errors.length > 0) { // Verifica se existem erros decorrentes da função de registro
            req.flash('errors', aluno.errors); // Adicionando a mensagem de erro nas flash messages
            req.session.save(() => res.redirect('back')); // Redirecionando para a página original
            return; // Garantindo o encerramento da função dentro do bloco if()
        }

        req.flash('success', 'Aluno cadastrado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
        req.session.save(() => res.redirect(`/aluno/index/${aluno.aluno._id}`)); // Salvando a seção e redirecionando para a página de editar do último aluno salvo
        return;
    } catch (e) { // Redireciona para a página 404 caso ocorra algum erro
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

    const aluno = await Aluno.buscaPorId(req.params.id); // Realiza a busca de um aluno pelo id usando o método buscaPorId()
    if (!aluno) return res.render('404'); // Redireciona para a página caso o aluno não seja encontrada

    res.render('aluno', { aluno }); // Exibe a página com os dados da aluno no formulário
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro
        const aluno = new Aluno(req.body); // Criando uma instância de aluno
        await aluno.edit(req.params.id); // Chama o método edit() para editar o aluno

        if (aluno.errors.length > 0) { // Verifica se existem erros decorrentes da função de editar
            req.flash('errors', aluno.errors); // Adicionando a mensagem de erro nas flash messages
            req.session.save(() => res.redirect('back')); // Redirecionando para a página original
            return; // Garantindo o encerramento da função dentro do bloco if()
        }

        req.flash('success', 'Aluno editado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
        req.session.save(() => res.redirect(`/aluno/index/${aluno.aluno._id}`)); // Salvando a seção e redirecionando para a página de editar do último aluno salvo
        return;
    } catch (e) { // Redireciona para a página 404 caso ocorra algum erro
        console.log(e);
        res.render('404');
    }
};

exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

    const aluno = await Aluno.delete(req.params.id); // Deleta e salva o aluno apagado em uma constante
    if (!aluno) return res.render('404'); // Redireciona para a página caso a aluno não seja encontrado

    req.flash('success', 'Aluno apagado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.save(() => res.redirect('back')); // Salvando a seção e redirecionando para a página original
    return;
};