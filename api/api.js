const express = require('express');
const api = express.Router();

const { TurmaModel } = require('../src/models/TurmaModel')
const { ProfessorModel } = require('../src/models/ProfessorModel')
const { AlunoModel } = require('../src/models/AlunoModel')

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