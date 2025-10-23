import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css'; 

const Register = () => {  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    //Validação
    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      //Chamando o endpoint de REGISTRO
      const response = await axios.post('https://minha-api-tarefas-bb3k.onrender.com/api/auth/register', {
        name: name,
        email: email,
        password: password,
      });

      //Se o registro for bem-sucedido, também retorna um token
      const token = response.data.token;

      localStorage.setItem('token', token);

      console.log('Registro com sucesso! Token:', token);
      
      navigate('/');

    } catch (err) {      
      console.error('Erro no registro:', err.response.data.error);
      setError(err.response.data.error || 'Erro ao fazer registro.');
    }
  };

  return (    
    <div className="login-container"> 
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>        
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
            minLength={6} 
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit">Criar Conta</button>
      </form>
      <p>        
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </div>
  );
};

export default Register;