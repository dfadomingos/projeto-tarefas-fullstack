const router = require('express').Router();
const db = require('../db'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

//criando usuario
router.post('/register', async (req, res) => {
  try {    
    const { name, email, password } = req.body;

    //verificando se usuario existe
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {      
      return res.status(401).json({ error: 'Usuário já existe.' });
    }

    //criptografando senha
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //inserindo usuario ao banco
    const newUser = await db.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    //gerando um token JWT para o usuário    
    const token = jwt.sign(
      { userId: newUser.rows[0].user_id }, 
      process.env.JWT_SECRET || 'supersecreto', 
      { expiresIn: '1h' } 
    );
    
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//Login
router.post('/login', async (req, res) => {
  try {    
    const { email, password } = req.body;

    //verificando se usuario existe
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); 
    }

    //verificando se a senha está correta    
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    
    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET || 'supersecreto',
      { expiresIn: '1h' }
    );
    
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;