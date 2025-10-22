const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 5000;

//Permitindo que o seu frontend (rodando em outra porta) faça requisições para este backend
app.use(cors());

//Permitindo ao Express entender de corpos de requisição
//que vêm no formato JSON.
app.use(express.json());

//Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Olá! O backend está funcionando!' });
});

//Rotas de Autenticação (Registro e Login)
app.use('/api/auth', require('./routes/auth'));

//Rotas de tarefas
app.use('/api/tasks', require('./routes/tasks'));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});