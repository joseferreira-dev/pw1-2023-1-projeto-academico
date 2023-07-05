const mongoose = require('mongoose');
const validator = require('validator'); // Realiza validações automaticamente
const bcryptjs = require('bcryptjs'); // Utilizado para criptografar a senha

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login { // Criando classe para o modelo login
  constructor(body) {
    this.body = body; // Adicionando os dados do corpo do formulário para a classe
    this.errors = []; // Flag de erros (se não estiver vazio, o usuário não pode ser cadastrado)
    this.user = null; // Cria um usuário vazio
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return; // Se existirem erros decorrentes de valida() ele encerra a fuñção
    this.user = await LoginModel.findOne({ email: this.body.email }); // Atualizando o usuário da classe com os dados do corpo do formulário

    if(!this.user) { // Verifica se o usuário existe, se não existir adiciona um erro e encerra
      this.errors.push('Usuário não existe.');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) { // Verifica se a senha digitada bate com a senha no banco, se não adicona um erro e encerra
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existirem erros

    await this.userExists(); // Chama o método userExists() para verificar se o usuário já existe na base de dados

    if(this.errors.length > 0) return; // Encerra a função sem realizar o cadastro se existir algum erro resultante do método userExists()

    const salt = bcryptjs.genSaltSync(); // Cria uma senha criptografada
    this.body.password = bcryptjs.hashSync(this.body.password, salt); // Substitui a senha pela senha criptografada

    this.user = await LoginModel.create(this.body); // Atualizando o usuário com os dados do corpo do formulário
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email }); // Atualizando o usuário com o usuário do banco corresponte ao usuário do corpo do formulário
    if(this.user) this.errors.push('Usuário já existe.'); // Se o usuário existir (this.user != null) adiciona um erro e evita o cadastro
  }

  valida() { 
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // A senha precisa ter entre 3 e 50
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() { // Realiza uma interação no corpo da requisição para verificar que todos os dados são do tipo String e garante que os dados sejam salvos corretamente
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = ''; // Caso seja diferente de string a propriedade recebe uma string vazia
      }
    }

    this.body = { // Garantindo que os dados sejam salvos corretamente
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = { Login, LoginModel };
