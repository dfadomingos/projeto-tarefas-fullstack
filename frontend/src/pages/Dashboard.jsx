import React, {useState, useEffect} from "react";
import "../TodoList.css"
import Icone from '../assets/icon.webp';
import axios from 'axios';

function Dashboard(){

    const listaStorage = localStorage.getItem('Lista');

    const [lista, setLista] = useState([]); 
    const [novoItem, setNovoItem] = useState("");

    //logout
    const handleLogout = () => {       
        localStorage.removeItem('token');        
        window.location = '/login';
    };

    useEffect(() => {    
    const fetchTasks = async () => {
        try {        
        const token = localStorage.getItem('token');
        if (!token) {            
            return;
        }

        //Fazendo a chamada GET para a API
        const response = await axios.get('http://localhost:5000/api/tasks', {
            headers: {
            token: token
            }
        });
        
        setLista(response.data);

        } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
        //Se o token for inválido
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            // Se o token for ruim, deslogamos o usuário
            localStorage.removeItem('token');
            window.location = '/login';
        }
        }
    };

    fetchTasks();
    }, []); 
    
    async function adicionaItem(form) {
    form.preventDefault();
    if (!novoItem) {
        return;
    }

    try {
        const token = localStorage.getItem('token');

        //Fazendo o POST para a API
        const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { description: novoItem }, 
        {
            headers: {
            token: token, 
            },
        }
        );

        //retornando a nova tarefa criada
        const novaTarefa = response.data;

        //Adicionando a nova tarefa ao *início* da lista
        setLista([novaTarefa, ...lista]);        
        setNovoItem('');        

        } catch (err) {
            console.error('Erro ao adicionar tarefa:', err);
        }
    }

    async function clicou(id, estadoAtual) {
    try {
        const token = localStorage.getItem('token');
        const novoEstado = !estadoAtual;

        //Fazendo a chamada PUT para a API
        await axios.put(
        `http://localhost:5000/api/tasks/${id}`, 
        { completed: novoEstado }, 
        { headers: { token: token } }
        );

        //Atualiza o estado local         
        setLista(
        lista.map((tarefa) =>
            tarefa.task_id === id ? { ...tarefa, completed: novoEstado } : tarefa
        )
        );
        } catch (err) {
            console.error('Erro ao atualizar tarefa:', err);
        }
    }

    async function deleta(id) {
    try {
        const token = localStorage.getItem('token');

        //Fazendo a chamada DELETE para a API
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { token: token },
        });

        //Atualiza o estado local
        setLista(lista.filter((tarefa) => tarefa.task_id !== id));

        } catch (err) {
            console.error('Erro ao deletar tarefa:', err);
        }
    }

    async function deletaTudo() {
    //confirmação 
    if (!window.confirm("Tem certeza que deseja deletar TODAS as tarefas?")) {
        return; 
    }

    try {
        const token = localStorage.getItem('token');

        //Fazer a chamada DELETE
        await axios.delete('http://localhost:5000/api/tasks/all', {
            headers: { token: token },
        });

        //Atualiza o estado local
        setLista([]);

        } catch (err) {
            console.error('Erro ao deletar todas as tarefas:', err);
        }
    }

    return (
        <div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <h1>Lista de Tarefas</h1>            
            <form className="task-form" onSubmit={adicionaItem}>
                <input
                id="input-entrada"
                className="task-input" 
                type="text"
                placeholder="Adicione uma tarefa"
                value={novoItem}
                onChange={(e)=>{setNovoItem(e.target.value)}} 
                />
                <button type="submit" className="add">Add</button>
            </form>
            <div className="listaTarefas">
                <div style={{textAlign: 'center'}}>
                    {
                        lista.length < 1 
                        ?
                        <img src={Icone} className="icone-central"/> 
                        :
                        lista.map((item, index) => (
                            <div key={item.task_id} className={item.completed ? "itemCompleto" : "item"}>
                                <span onClick={() => { clicou(item.task_id, item.completed) }}>{item.description}</span> 
                                <button onClick={() => { deleta(item.task_id) }} className="del">Deletar</button>
                            </div>     
                        ))                        
                    }                   
                {
                    lista.length > 0 &&
                    <button onClick={()=>{deletaTudo()}} className="delAll">Deletar Todas</button>
                }
            </div>
        </div>
    </div>
    )
}

export default Dashboard