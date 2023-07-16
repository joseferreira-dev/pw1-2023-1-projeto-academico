const mongoose = require('mongoose');
const validator = require('validator'); // Realiza validações automaticamente

const AlunoSchema = new mongoose.Schema({
    matricula: { type: String, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now },
});

const AlunoModel = mongoose.model('Aluno', AlunoSchema);

function Aluno(body) { // Função construtora para o modelo de Aluno
    this.body = body; // Adicionando os dados do corpo do formulário
    this.errors = []; // Flag de erros (se não estiver vazio, o aluno não pode ser cadastrado)
    this.aluno = null; // Cria um aluno vazio
}

Aluno.prototype.register = async function () {
    this.valida();
    if (this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros

    await this.alunoExists(); // Chama o método alunoExists() para verificar se o aluno já existe na base de dados

    if (this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros referentes a função alunoExists()

    this.aluno = await AlunoModel.create(this.body); // Atualizando o aluno com os dados do corpo do formulário
};

Aluno.prototype.alunoExists = async function () {
    this.aluno = await AlunoModel.findOne({ matricula: this.body.matricula }); // Atualizando o aluno com o aluno do banco corresponte a matricula do corpo do formulário
    if (this.aluno) this.errors.push('Aluno já cadastrado.'); // Se o aluno existir (this.aluno != null) adiciona um erro e evita o cadastro
}

Aluno.prototype.valida = function () {
    this.cleanUp();

    // Validação
    // O aluno não pode ser cadastrado sem matricula
    if (!this.body.matricula) this.errors.push('Necessário incluir a matrícula do aluno');

    // O aluno não pode ser cadastrado sem nome
    if (!this.body.nome) this.errors.push('Necessário incluir o nome do aluno');

    // O aluno não pode ser cadastrado sem email
    if (!this.body.email) this.errors.push('Necessário incluir o email do aluno');

    // O e-mail precisa ser válido
    if (!validator.isEmail(this.body.email)) this.errors.push('Insira um e-mail válido');

    // O aluno não pode ser cadastrado sem telefone
    if (!this.body.telefone) this.errors.push('Necessário incluir o telefone do aluno');
};

Aluno.prototype.cleanUp = function () { // Realiza uma interação no corpo da requisição para verificar que todos os dados são do tipo String e garante que os dados sejam salvos corretamente
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = ''; // Caso seja diferente de string a propriedade recebe uma string vazia
        }
    }

    this.body = { // Garantindo que os dados sejam salvos corretamente
        matricula: this.body.matricula,
        nome: this.body.nome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
};

Aluno.prototype.edit = async function (id) {
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    this.valida();
    if (this.errors.length > 0) return; // Encerra a função sem realizar a edição se existirem erros
    this.aluno = await AlunoModel.findByIdAndUpdate(id, this.body, { new: true }); // Atualiza o aluno
};

// Métodos estáticos
Aluno.buscaPorId = async function (id) { // Realiza a busca de um aluno pelo id
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    const aluno = await AlunoModel.findById(id); // Cria uma constante para salvar o aluno encontrado
    return aluno;
};

Aluno.buscaAlunos = async function () { // Método para buscar e listar todos os alunos
    const alunos = await AlunoModel.find();
    //alunos.sort({ nome: 1 }); // Busca e lista todos os alunos pelo nome
    return alunos;
};

Aluno.delete = async function (id) { // Método para deletar um aluno
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    const aluno = await AlunoModel.findOneAndDelete({ _id: id }); // Cria uma constante para salvar o aluno deletado
    return aluno;
};


module.exports = { Aluno, AlunoModel };