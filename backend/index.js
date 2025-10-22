const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do .env

const app = express();
const port = process.env.PORT || 5000;

// === Middlewares ===
// Permite que o seu frontend (rodando em outra porta) faça requisições
// para este backend.
app.use(cors());

// Permite ao Express entender (fazer o "parse") de corpos de requisição
// que vêm no formato JSON.
app.use(express.json());

// === Rotas ===

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Olá! O backend está funcionando!' });
});

// Rotas de Autenticação (Registro e Login)
// O Express vai pegar todas as rotas definidas no arquivo './routes/auth'
// e vai colocá-las sob o prefixo '/api/auth'
// Ex: A rota '/register' em 'auth.js' vira '/api/auth/register'
app.use('/api/auth', require('./routes/auth'));

// Rotas de Autenticação
app.use('/api/auth', require('./routes/auth'));

// Rotas de Tarefas (CRUD)
// Todas as rotas em 'tasks.js' terão o prefixo /api/tasks
// Ex: /api/tasks/ e /api/tasks/:id
app.use('/api/tasks', require('./routes/tasks'));

// === Iniciar o Servidor ===
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});