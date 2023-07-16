const { Aluno, AlunoModel } = require('../../src/models/AlunoModel');

describe('AlunoModel', () => {
  describe('register', () => {
    test('deve cadastrar um aluno com sucesso', async () => {
      const mockCreate = jest.spyOn(AlunoModel, 'create').mockResolvedValueOnce({ nome: 'José Ferreira' });
      
      const aluno = new Aluno({
        nome: 'José Ferreira',
        matricula: '202122010024',
        email: 'jose.guedes@academico.ifpb.edu.br',
        telefone: '83998749101',
      });
      await aluno.register();
      
      expect(mockCreate).toHaveBeenCalledWith({
        nome: 'José Ferreira',
        matricula: '202122010024',
        email: 'jose.guedes@academico.ifpb.edu.br',
        telefone: '83998749101',
      });
      expect(aluno.aluno).toEqual({ nome: 'José Ferreira' });
      expect(aluno.errors).toHaveLength(0);
    });
    
    test('deve adicionar erro se o aluno já estiver cadastrado', async () => {
      const mockExists = jest.spyOn(AlunoModel, 'findOne').mockResolvedValueOnce({ nome: 'José Ferreira' });
      
      const aluno = new Aluno({
        nome: 'José Ferreira',
        matricula: '202122010024',
        email: 'jose.guedes@academico.ifpb.edu.br',
        telefone: '83998749101',
      });
      await aluno.register();
      
      expect(mockExists).toHaveBeenCalledWith({ matricula: '202122010024' });
      expect(aluno.errors).toEqual(['Aluno já cadastrado.']);
    });
    
    test('deve adicionar um erro de validação se o campo de nome for inválido', async () => {
      const aluno = new Aluno({
        nome: '',
        matricula: '202122010024',
        email: 'jose.guedes@gmail.com',
        telefone: '83998749101',
      });
      await aluno.register();
      
      expect(aluno.errors).toEqual([
        'Necessário incluir o nome do aluno',
      ]);
    });
  });

  describe('edit', () => {
    test('deve editar um aluno com sucesso', async () => {
      const mockUpdate = jest.spyOn(AlunoModel, 'findByIdAndUpdate').mockResolvedValueOnce({ nome: 'José Ferreira' });
      
      const aluno = new Aluno({
        nome: 'José Ferreira',
        matricula: '202122010024',
        email: 'jose.guedes@academico.ifpb.edu.br',
        telefone: '83998749101',
      });
      await aluno.edit('123456789');
      
      expect(mockUpdate).toHaveBeenCalledWith('123456789', {
        nome: 'José Ferreira',
        matricula: '202122010024',
        email: 'jose.guedes@academico.ifpb.edu.br',
        telefone: '83998749101',
      }, { new: true });
      expect(aluno.aluno).toEqual({ nome: 'José Ferreira' });
      expect(aluno.errors).toHaveLength(0);
    });
    
    test('deve adicionar um erro de validação se o campo de matricula for inválido', async () => {
      const aluno = new Aluno({
        nome: 'José Ferreira',
        matricula: '',
        email: 'jose.guedes@gmail.com',
        telefone: '83998749101',
      });
      await aluno.edit('123456789');
      
      expect(aluno.errors).toEqual([
        'Necessário incluir a matrícula do aluno',
      ]);
    });
  });

  describe('buscaPorId', () => {
    test('deve retornar o aluno correspondente ao id', async () => {
      const mockFindById = jest.spyOn(AlunoModel, 'findById').mockResolvedValueOnce({ nome: 'José Ferreira' });
      
      const aluno = await Aluno.buscaPorId('123456789');
      
      expect(mockFindById).toHaveBeenCalledWith('123456789');
      expect(aluno).toEqual({ nome: 'José Ferreira' });
    });
    
    test('deve retornar undefined se o id não for uma string', async () => {
      const aluno = await Aluno.buscaPorId(123);
      
      expect(aluno).toBeUndefined();
    });
  });

  describe('buscaAlunos', () => {
    test('deve retornar a lista de alunos cadastrados', async () => {
      const mockFind = jest.spyOn(AlunoModel, 'find').mockResolvedValueOnce([
        { nome: 'Maria' },
        { nome: 'João' },
      ]);
      
      const alunos = await Aluno.buscaAlunos();
      
      expect(mockFind).toHaveBeenCalled();
      expect(alunos).toEqual([
        { nome: 'Maria' },
        { nome: 'João' },
      ]);
    });
  });

  describe('delete', () => {
    test('deve deletar o aluno correspondente ao id', async () => {
      const mockFindOneAndDelete = jest.spyOn(AlunoModel, 'findOneAndDelete').mockResolvedValueOnce({ nome: 'José Ferreira' });
      
      const aluno = await Aluno.delete('123456789');
      
      expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: '123456789' });
      expect(aluno).toEqual({ nome: 'José Ferreira' });
    });
    
    test('deve retornar undefined se o id não for uma string', async () => {
      const aluno = await Aluno.delete(123);
      
      expect(aluno).toBeUndefined();
    });
  });
});
