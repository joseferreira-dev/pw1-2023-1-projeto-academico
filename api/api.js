const express = require('express');
const api = express.Router();
const jwt = require('jsonwebtoken');

const { TurmaModel } = require('../src/models/TurmaModel');
const { ProfessorModel } = require('../src/models/ProfessorModel');
const { AlunoModel } = require('../src/models/AlunoModel');
const { Login } = require('../src/models/LoginModel');

const verificarToken = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization) {
    try {
      const [, token] = authorization.split(' ');
      await jwt.verify(token, process.env.SECRET_KEY);

      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  } else {
    res.status(401).json({ error: 'Authorization header is empty.' });
  }
}

api.post('/api/v1/register', async (req, res) => {
  try {
    const login = new Login(req.body); // Criando uma instância de Login
    await login.register(); // Chamando o método register() da classe Login para realizar o cadastro

    res.status(200).json({ message: 'Registro realizado com sucesso.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
});

api.post('/api/v1/login', async (req, res) => {
  try {
    // Verificar se o usuário e a senha estão corretos
    const login = new Login(req.body);
    await login.login();

    const token = jwt.sign({ username: login.user.username }, process.env.SECRET_KEY, { expiresIn: 3600 });

    const tokenBearer = `Bearer ${token}`;

    res.set('Authorization', tokenBearer);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       properties:
 *         matricula:
 *           type: string
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         criadoEm:
 *           type: string
 *
 *     Professor:
 *       type: object
 *       properties:
 *         matricula:
 *           type: string
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         criadoEm:
 *           type: string
 *
 *     Turma:
 *       type: object
 *       properties:
 *         rotulo:
 *           type: string
 *         periodo:
 *           type: string
 *         professor:
 *           type: array
 *           items:
 *             type: string
 *         alunos:
 *           type: array
 *           items:
 *             type: string
 *         criadoEm:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/turmas:
 *   get:
 *     summary: Obter todas as turmas
 *     description: Retorna uma lista de todas as turmas cadastradas.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turma'
 *       500:
 *         description: Erro ao obter os dados das turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 */

api.get('/api/v1/turmas', (req, res) => {
    TurmaModel.find()
        .then((dados) => {
            res.json(dados);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao obter os dados das turmas' });
        });
});

/**
 * @swagger
 * /api/v1/professores:
 *   get:
 *     summary: Obter todos os professores
 *     description: Retorna uma lista de todos os professores cadastrados.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 *       500:
 *         description: Erro ao obter os dados dos professores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 */

api.get('/api/v1/professores', (req, res) => {
    ProfessorModel.find()
        .then((dados) => {
            res.json(dados);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao obter os dados dos professor' });
        });
});

/**
 * @swagger
 * /api/v1/alunos:
 *   get:
 *     summary: Obter todos os alunos
 *     description: Retorna uma lista de todos os alunos cadastrados.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 *       500:
 *         description: Erro ao obter os dados dos alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 */

api.get('/api/v1/alunos', (req, res) => {
    AlunoModel.find()
        .then((dados) => {
            res.json(dados);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao obter os dados dos alunos' });
        });
});

module.exports = api;