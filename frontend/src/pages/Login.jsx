import React, { useState } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(''); 

    try {
      //Fazendo a requisição POST para o backend
      const response = await axios.post('https://minha-api-tarefas-bb3k.onrender.com/api/auth/login', {
        email: email,
        password: password,
      });
      
      const token = response.data.token;

      //Salvar o token no Local Storage do navegador, mantendo usuario logado      
      localStorage.setItem('token', token);

      console.log('Login com sucesso! Token:', token);

      window.location = '/'; 

    } catch (err) {      
      console.error('Erro no login:', err.response.data.error);
      setError(err.response.data.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="login-container">
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