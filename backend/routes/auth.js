const router = require('express').Router();
const db = require('../db'); // Nosso pool de conexão
const bcrypt = require('bcrypt'); // Para criptografar a senha
const jwt = require('jsonwebtoken'); // Para criar o token

// ROTA DE REGISTRO (CREATE USER)
router.post('/register', async (req, res) => {
  try {
    // 1. Extrair os dados do corpo da requisição
    // (no frontend, você enviará name, email, password)
    const { name, email, password } = req.body;

    // 2. Verificar se o usuário já existe
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      // 401 = Não autorizado
      return res.status(401).json({ error: 'Usuário já existe.' });
    }

    // 3. Criptografar a senha do usuário
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Inserir o novo usuário no banco de dados
    const newUser = await db.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    // 5. Gerar um token JWT para o usuário
    // (O token é uma "credencial" que o frontend salvará)
    const token = jwt.sign(
      { userId: newUser.rows[0].user_id }, // "Carga" do token
      process.env.JWT_SECRET || 'supersecreto', // Chave secreta (vamos adicionar no .env!)
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // 6. Enviar a resposta com o token
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
  try {
    // 1. Extrair email e senha do corpo
    const { email, password } = req.body;

    // 2. Verificar se o usuário existe
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // (Mensagem genérica por segurança)
    }

    // 3. Verificar se a senha está correta
    // Comparamos a senha do 'req.body' com a senha criptografada do banco
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 4. Se tudo estiver certo, gerar um novo token
    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET || 'supersecreto',
      { expiresIn: '1h' }
    );

    // 5. Enviar o token
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;