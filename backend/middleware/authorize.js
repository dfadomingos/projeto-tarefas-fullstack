const jwt = require('jsonwebtoken');
require('dotenv').config();

// verificação do token
module.exports = async (req, res, next) => {
  try {    
    const jwtToken = req.header('token'); 

    //Verificando se o token existe
    if (!jwtToken) {
      return res.status(403).json({ error: 'Não autorizado.' });
    }
    
    //Se token válido, o 'payload' conterá { userId: ... } 
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    //Adiciona o ID do usuário ao objeto 'req'    
    req.userId = payload.userId;
    
    next();

  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ error: 'Token inválido.' });
  }
};