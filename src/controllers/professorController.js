const { Professor } = require('../models/ProfessorModel'); // Importando o modelo de professor

exports.index = (req, res) => { // Exibe a página de edição de professor
    res.render('professor', {
        professor: {} // Exibe a página sem nenhum dado no formulário
    });
};

exports.list = async (req, res) => { // Exibe a página de listagem de professores
    const professores = await Professor.buscaProfessores();
    res.render('professores', { professores });
};

exports.register = async (req, res) => {
    try {
        const professor = new Professor(req.body); // Criando uma instância de professor
        await professor.register(); // Chama o método register() para cadastrar o professor

        if (professor.errors.length > 0) { // Verifica se existem erros decorrentes da função de registro
            req.flash('errors', professor.errors); // Adicionando a mensagem de erro nas flash messages
            req.session.save(() => res.redirect('back')); // Redirecionando para a página original
            return; // Garantindo o encerramento da função dentro do bloco if()
        }

        req.flash('success', 'Professor cadastrado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
        req.session.save(() => res.redirect(`/professor/index/${professor.professor._id}`)); // Salvando a seção e redirecionando para a página de editar do último professor salvo
        return;
    } catch (e) { // Redireciona para a página 404 caso ocorra algum erro
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

    const professor = await Professor.buscaPorId(req.params.id); // Realiza a busca de um professor pelo id usando o método buscaPorId()
    if (!professor) return res.render('404'); // Redireciona para a página caso o professor não seja encontrada

    res.render('professor', { professor }); // Exibe a página com os dados da professor no formulário
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro
        const professor = new Professor(req.body); // Criando uma instância de professor
        await professor.edit(req.params.id); // Chama o método edit() para editar o professor

        if (professor.errors.length > 0) { // Verifica se existem erros decorrentes da função de editar
            req.flash('errors', professor.errors); // Adicionando a mensagem de erro nas flash messages
            req.session.save(() => res.redirect('back')); // Redirecionando para a página original
            return; // Garantindo o encerramento da função dentro do bloco if()
        }

        req.flash('success', 'Professor editado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
        req.session.save(() => res.redirect(`/professor/index/${professor.professor._id}`)); // Salvando a seção e redirecionando para a página de editar do último professor salvo
        return;
    } catch (e) { // Redireciona para a página 404 caso ocorra algum erro
        console.log(e);
        res.render('404');
    }
};

exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404'); // Redireciona para a página 404 caso ocorra algum erro

    const professor = await Professor.delete(req.params.id); // Deleta e salva o professor apagado em uma constante
    if (!professor) return res.render('404'); // Redireciona para a página caso a professor não seja encontrado

    req.flash('success', 'Professor apagado com sucesso.'); // Adicionando a mensagem de sucesso nas flash messages
    req.session.save(() => res.redirect('back')); // Salvando a seção e redirecionando para a página original
    return;
};