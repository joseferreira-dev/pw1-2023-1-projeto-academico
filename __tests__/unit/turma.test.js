const { Turma, TurmaModel } = require('../../src/models/TurmaModel');

describe('TurmaModel', () => {
  describe('register', () => {
    test('deve cadastrar uma turma com sucesso', async () => {
      const mockCreate = jest.spyOn(TurmaModel, 'create').mockResolvedValueOnce({ rotulo: 'ADS-102' });
      
      const turma = new Turma({
        rotulo: 'ADS-102',
        periodo: '2023.1',
        professor: 'Diogo Dantas',
        alunos: ['José', 'Letícia', 'Geraldo', 'Bruno'],
      });
      await turma.register();
      
      expect(mockCreate).toHaveBeenCalledWith({
        rotulo: 'ADS-102',
        periodo: '2023.1',
        professor: 'Diogo Dantas',
        alunos: ['José', 'Letícia', 'Geraldo', 'Bruno'],
      });
      expect(turma.turma).toEqual({ rotulo: 'ADS-102' });
      expect(turma.errors).toHaveLength(0);
    });
    
    test('deve adicionar erro se a turma já estiver cadastrada', async () => {
      const mockExists = jest.spyOn(TurmaModel, 'findOne').mockResolvedValueOnce({ rotulo: 'ADS-102' });
      
      const turma = new Turma({
        rotulo: 'ADS-102',
        periodo: '2023.1',
        professor: 'Diogo Dantas',
        alunos: ['José', 'Letícia', 'Geraldo', 'Bruno'],
      });
      await turma.register();
      
      expect(mockExists).toHaveBeenCalledWith({ rotulo: 'ADS-102', periodo: '2023.1' });
      expect(turma.errors).toEqual(['Turma já existe.']);
    });
    
    test('deve adicionar erros de validação se os campos forem inválidos', async () => {
      const turma = new Turma({
        rotulo: '',
        periodo: '',
        professor: '',
        alunos: '',
      });
      await turma.register();
      
      expect(turma.errors).toEqual([
        'Necessário incluir o rótulo da turma',
        'Necessário incluir o período da turma',
      ]);
    });
  });

  describe('edit', () => {
    test('deve editar uma turma com sucesso', async () => {
      const mockUpdate = jest.spyOn(TurmaModel, 'findByIdAndUpdate').mockResolvedValueOnce({ rotulo: 'ADS-102' });
      
      const turma = new Turma({
        rotulo: 'ADS-102',
        periodo: '2023.1',
        professor: 'Diogo Dantas',
        alunos: ['José', 'Letícia', 'Geraldo', 'Bruno'],
      });
      await turma.edit('123456789');
      
      expect(mockUpdate).toHaveBeenCalledWith('123456789', {
        rotulo: 'ADS-102',
        periodo: '2023.1',
        professor: 'Diogo Dantas',
        alunos: ['José', 'Letícia', 'Geraldo', 'Bruno'],
      }, { new: true });
      expect(turma.turma).toEqual({ rotulo: 'ADS-102' });
      expect(turma.errors).toHaveLength(0);
    });
    
    test('deve adicionar erros de validação se os campos forem inválidos', async () => {
      const turma = new Turma({
        rotulo: '',
        periodo: '',
        professor: '',
        alunos: '',
      });
      await turma.edit('123456789');
      
      expect(turma.errors).toEqual([
        'Necessário incluir o rótulo da turma',
        'Necessário incluir o período da turma',
      ]);
    });
  });

  describe('buscaPorId', () => {
    test('deve retornar a turma correspondente ao id', async () => {
      const mockFindById = jest.spyOn(TurmaModel, 'findById').mockResolvedValueOnce({ rotulo: 'ADS-102' });
      
      const turma = await Turma.buscaPorId('123456789');
      
      expect(mockFindById).toHaveBeenCalledWith('123456789');
      expect(turma).toEqual({ rotulo: 'ADS-102' });
    });
    
    test('deve retornar undefined se o id não for uma string', async () => {
      const turma = await Turma.buscaPorId(123);
      
      expect(turma).toBeUndefined();
    });
  });

  describe('buscaTurmas', () => {
    test('deve retornar a lista de turmas', async () => {
      const mockFind = jest.spyOn(TurmaModel, 'find').mockResolvedValueOnce([
        { rotulo: 'Turma A', periodo: '2023.1' },
        { rotulo: 'Turma B', periodo: '2023.2' },
      ]);
      
      const turmas = await Turma.buscaTurmas();
      
      expect(mockFind).toHaveBeenCalled();
      expect(turmas).toEqual([
        { rotulo: 'Turma A', periodo: '2023.1' },
        { rotulo: 'Turma B', periodo: '2023.2' },
      ]);
    });
  });

  describe('delete', () => {
    test('deve deletar a turma correspondente ao id', async () => {
      const mockFindOneAndDelete = jest.spyOn(TurmaModel, 'findOneAndDelete').mockResolvedValueOnce({ rotulo: 'ADS-102' });
      
      const turma = await Turma.delete('123456789');
      
      expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: '123456789' });
      expect(turma).toEqual({ rotulo: 'ADS-102' });
    });
    
    test('deve retornar undefined se o id não for uma string', async () => {
      const turma = await Turma.delete(123);
      
      expect(turma).toBeUndefined();
    });
  });
});
