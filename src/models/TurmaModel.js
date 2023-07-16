const mongoose = require('mongoose');

const TurmaSchema = new mongoose.Schema({
  rotulo: { type: String, required: true },
  periodo: { type: String, required: true },
  professor: { type: [String], required: false },
  alunos: { type: [String], required: false },
  criadoEm: { type: Date, default: Date.now },
});

const TurmaModel = mongoose.model('Turma', TurmaSchema);

function Turma(body) { // Função construtora para o modelo de Turma
  this.body = body; // Adicionando os dados do corpo do formulário
  this.errors = []; // Flag de erros (se não estiver vazio, a turma não pode ser cadastrado)
  this.turma = null; // Cria uma turma vazia
}

Turma.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros

  await this.turmaExists(); // Chama o método turmaExists() para verificar se a turma já existe na base de dados

  if(this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros referentes a função turmaExists()

  this.turma = await TurmaModel.create(this.body); // Atualizando a turma com os dados do corpo do formulário
};

Turma.prototype.turmaExists = async function() {
    this.turma = await TurmaModel.findOne({ rotulo: this.body.rotulo, periodo:this.body.periodo }); // Atualizando a turma com a turma do banco corresponte a turma do corpo do formulário
    if(this.turma) this.errors.push('Turma já existe.'); // Se a turma existir (this.user != null) adiciona um erro e evita o cadastro
  }

Turma.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // A turma não pode ser cadastrada sem rótulo
  if(!this.body.rotulo) this.errors.push('Necessário incluir o rótulo da turma');

  // A turma não pode ser cadastrada sem período
  if(!this.body.periodo) this.errors.push('Necessário incluir o período da turma');
};

Turma.prototype.cleanUp = function() { // Realiza uma interação no corpo da requisição para verificar que todos os dados são do tipo String e garante que os dados sejam salvos corretamente
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string' && typeof this.body[key] !== 'object') {
      this.body[key] = ''; // Caso seja diferente de string a propriedade recebe uma string vazia
    }
  }

  this.body = { // Garantindo que os dados sejam salvos corretamente
    rotulo: this.body.rotulo,
    periodo: this.body.periodo,
    professor: this.body.professor,
    alunos: this.body.alunos,
  };
};

Turma.prototype.edit = async function(id) {
  if(typeof id !== 'string') return; // Encerra se o id não for uma string
  this.valida();
  if(this.errors.length > 0) return; // Encerra a função sem realizar a edição se existirem erros
  this.turma = await TurmaModel.findByIdAndUpdate(id, this.body, { new: true }); // Atualiza a turma
};

// Métodos estáticos
Turma.buscaPorId = async function(id) { // Realiza a busca de uma turma pelo id
  if(typeof id !== 'string') return; // Encerra se o id não for uma string
  const turma = await TurmaModel.findById(id); // Cria uma constante para salvar a turma encontrada
  return turma;
};

Turma.buscaTurmas = async function() { // Método para buscar e listar todas as turmas
  const turmas = await TurmaModel.find() 
    //.sort({ periodo: -1 }); // Busca e lista todas as turmas pelo periodo
  return turmas;
};

Turma.delete = async function(id) { // Método para deletar uma turma
  if(typeof id !== 'string') return; // Encerra se o id não for uma string
  const turma = await TurmaModel.findOneAndDelete({_id: id}); // Cria uma constante para salvar a turma deletada
  return turma;
};

module.exports = { Turma, TurmaModel };
