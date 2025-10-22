const jwt = require('jsonwebtoken');
require('dotenv').config();

// Este middleware vai verificar o token
module.exports = async (req, res, next) => {
  try {
    // 1. Pega o token do cabeçalho da requisição (header)
    const jwtToken = req.header('token'); // No frontend, enviaremos como 'token'

    // 2. Verifica se o token existe
    if (!jwtToken) {
      return res.status(403).json({ error: 'Não autorizado.' }); // 403 = Proibido
    }

    // 3. Verifica se o token é válido
    // Isso vai decodificar o token e verificar se ele foi assinado
    // com o nosso JWT_SECRET.
    // Se for válido, o 'payload' conterá { userId: ... } (que definimos no login)
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // 4. Adiciona o ID do usuário ao objeto 'req'
    // para que nossas rotas (CRUD) saibam *qual* usuário está fazendo a requisição.
    req.userId = payload.userId;

    // 5. Continua para a próxima rota
    next();

  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ error: 'Token inválido.' });
  }
};