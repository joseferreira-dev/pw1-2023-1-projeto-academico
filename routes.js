const express = require('express');
const route = express.Router();

// Controllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const turmaController = require('./src/controllers/turmaController');
const alunoController = require('./src/controllers/alunoController');
const professorController = require('./src/controllers/professorController');

// Middlewares
const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);
route.get('/pessoas', homeController.pessoas)

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de turma
route.get('/turma/index', loginRequired, turmaController.index);
route.post('/turma/register', loginRequired, turmaController.register);
route.get('/turma/index/:id', loginRequired, turmaController.editIndex);
route.post('/turma/edit/:id', loginRequired, turmaController.edit);
route.get('/turma/delete/:id', loginRequired, turmaController.delete);
route.get('/turma/exibir/:id', loginRequired, turmaController.view);

// Rotas de aluno
route.get('/aluno/index', loginRequired, alunoController.index);
route.get('/aluno/list', loginRequired, alunoController.list);
route.post('/aluno/register', loginRequired, alunoController.register);
route.get('/aluno/index/:id', loginRequired, alunoController.editIndex);
route.post('/aluno/edit/:id', loginRequired, alunoController.edit);
route.get('/aluno/delete/:id', loginRequired, alunoController.delete);

// Rotas de professor
route.get('/professor/index', loginRequired, professorController.index);
route.get('/professor/list', loginRequired, professorController.list);
route.post('/professor/register', loginRequired, professorController.register);
route.get('/professor/index/:id', loginRequired, professorController.editIndex);
route.post('/professor/edit/:id', loginRequired, professorController.edit);
route.get('/professor/delete/:id', loginRequired, professorController.delete);

module.exports = route;