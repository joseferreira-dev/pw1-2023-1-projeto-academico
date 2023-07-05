const mongoose = require('mongoose');
const validator = require('validator'); // Realiza validações automaticamente

const ProfessorSchema = new mongoose.Schema({
    matricula: { type: String, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now },
});

const ProfessorModel = mongoose.model('Professor', ProfessorSchema);

function Professor(body) { // Função construtora para o modelo de Professor
    this.body = body; // Adicionando os dados do corpo do formulário
    this.errors = []; // Flag de erros (se não estiver vazio, o professor não pode ser cadastrado)
    this.professor = null; // Cria um professor vazio
}

Professor.prototype.register = async function () {
    this.valida();
    if (this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros

    await this.professorExists(); // Chama o método professorExists() para verificar se o professor já existe na base de dados

    if (this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros referentes a função professorExists()

    this.professor = await ProfessorModel.create(this.body); // Atualizando o professor com os dados do corpo do formulário
};

Professor.prototype.professorExists = async function () {
    this.professor = await ProfessorModel.findOne({ matricula: this.body.matricula }); // Atualizando o professor com o professor do banco corresponte a matricula do corpo do formulário
    if (this.professor) this.errors.push('Professor já cadastrado.'); // Se o professor existir (this.professor != null) adiciona um erro e evita o cadastro
}

Professor.prototype.valida = function () {
    this.cleanUp();

    // Validação
    // O professor não pode ser cadastrado sem matricula
    if (!this.body.matricula) this.errors.push('Necessário incluir a matrícula do professor');

    // O professor não pode ser cadastrado sem nome
    if (!this.body.nome) this.errors.push('Necessário incluir o nome do professor');

    // O professor não pode ser cadastrado sem email
    if (!this.body.email) this.errors.push('Necessário incluir o email do professor');

    // O e-mail precisa ser válido
    if (!validator.isEmail(this.body.email)) this.errors.push('Insira um e-mail válido');

    // O professor não pode ser cadastrado sem telefone
    if (!this.body.telefone) this.errors.push('Necessário incluir o telefone do professor');
};

Professor.prototype.cleanUp = function () { // Realiza uma interação no corpo da requisição para verificar que todos os dados são do tipo String e garante que os dados sejam salvos corretamente
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

Professor.prototype.edit = async function (id) {
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    this.valida();
    if (this.errors.length > 0) return; // Encerra a função sem realizar a edição se existirem erros
    this.professor = await ProfessorModel.findByIdAndUpdate(id, this.body, { new: true }); // Atualiza o professor
};

// Métodos estáticos
Professor.buscaPorId = async function (id) { // Realiza a busca de um professor pelo id
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    const professor = await ProfessorModel.findById(id); // Cria uma constante para salvar o professor encontrado
    return professor;
};

Professor.buscaProfessores = async function () { // Método para buscar e listar todos os professores
    const professores = await ProfessorModel.find()
        .sort({ nome: 1 }); // Busca e lista todos os professores pelo nome
    return professores;
};

Professor.delete = async function (id) { // Método para deletar um professor
    if (typeof id !== 'string') return; // Encerra se o id não for uma string
    const professor = await ProfessorModel.findOneAndDelete({ _id: id }); // Cria uma constante para salvar o professor deletado
    return professor;
};


module.exports = { Professor, ProfessorModel };