// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate

// 1. Reutilizamos o MESMO CSS da página de login
import './Login.css'; 

const Register = () => {
  // 2. Adicionamos um state para o 'name'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // useNavigate é uma forma mais moderna de redirecionar no React
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // (Opcional) Validação simples
    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      // 3. Chamamos o endpoint de REGISTRO
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: name,
        email: email,
        password: password,
      });

      // 4. Se o registro for bem-sucedido, ele também retorna um token
      const token = response.data.token;

      // 5. Salvamos o token (para logar o usuário automaticamente)
      localStorage.setItem('token', token);

      console.log('Registro com sucesso! Token:', token);
      
      // 6. Redirecionamos para a página principal
      // Usar navigate('/') é um pouco melhor que 'window.location'
      // porque não força um recarregamento total da página.
      navigate('/');

    } catch (err) {
      // 7. Mostramos o erro do backend (ex: "Usuário já existe.")
      console.error('Erro no registro:', err.response.data.error);
      setError(err.response.data.error || 'Erro ao fazer registro.');
    }
  };

  return (
    // 8. Reutilizamos a classe CSS do login
    <div className="login-container"> 
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        {/* 9. Adicionamos o campo de Nome */}
        <div>
          <label>Nome</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

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
            minLength={6} // É uma boa prática definir um mínimo
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit">Criar Conta</button>
      </form>
      <p>
        {/* 10. Link para voltar ao Login */}
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </div>
  );
};

export default Register;