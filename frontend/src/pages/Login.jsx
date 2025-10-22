// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Importamos o axios
import { Link } from 'react-router-dom'; // Para linkar para a página de registro
import './Login.css';

// (Opcional) Você pode criar um CSS para esta página
// import './Login.css'; 

const Login = () => {
  // States para guardar o email e a senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State para guardar mensagens de erro

  // Função chamada quando o formulário é enviado
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setError(''); // Limpa erros antigos

    try {
      // 1. Fazer a requisição POST para o seu backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password,
      });

      // 2. Se o login for bem-sucedido, o backend enviará um token
      const token = response.data.token;

      // 3. Salvar o token no Local Storage do navegador
      // (Isso "mantém" o usuário logado)
      localStorage.setItem('token', token);

      console.log('Login com sucesso! Token:', token);

      // 4. Forçar um recarregamento da página
      // Isso fará o App.jsx reavaliar se o usuário está logado
      // (Vamos melhorar isso depois, mas por agora funciona)
      window.location = '/'; // Redireciona para a página principal

    } catch (err) {
      // 4. Se der erro (ex: credenciais inválidas)
      console.error('Erro no login:', err.response.data.error);
      setError(err.response.data.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="login-container"> {/* Dê um estilo para isso! */}
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Senha</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Mostra a mensagem de erro, se houver */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;