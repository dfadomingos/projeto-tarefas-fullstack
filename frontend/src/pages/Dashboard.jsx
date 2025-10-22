import React, {useState, useEffect} from "react";
import "../TodoList.css"
import Icone from '../assets/icon.webp';
import axios from 'axios';

function Dashboard(){

    const listaStorage = localStorage.getItem('Lista');

    const [lista, setLista] = useState([]); // 1. Começamos com um array vazio
    const [novoItem, setNovoItem] = useState("");

    // 2. Substituímos o useEffect
    useEffect(() => {
    // Criamos uma função "async" aqui dentro para poder usar "await"
    const fetchTasks = async () => {
        try {
        // 3. Pegamos o token que salvamos no Login
        const token = localStorage.getItem('token');
        if (!token) {
            // Se não tiver token, nem tenta (embora o App.jsx já nos proteja)
            return;
        }

        // 4. Fazemos a chamada GET para a API
        const response = await axios.get('http://localhost:5000/api/tasks', {
            headers: {
            token: token // Enviamos o token no header
            }
        });

        // 5. O backend retorna a lista de tarefas. Colocamos ela no state!
        setLista(response.data);

        } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
        // Se o token for inválido ou expirado, o backend dará erro 403
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
            // Se o token for ruim, deslogamos o usuário
            localStorage.removeItem('token');
            window.location = '/login';
        }
        }
    };

    fetchTasks();
    }, []); // O [] vazio significa: "Rode esta função UMA VEZ quando a página carregar"
    // ...
    
    async function adicionaItem(form) {
    form.preventDefault();
    if (!novoItem) {
        return;
    }

    try {
        const token = localStorage.getItem('token');

        // 1. Fazer o POST para a API
        const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { description: novoItem }, // O corpo da requisição
        {
            headers: {
            token: token, // O token de autorização
            },
        }
        );

        // 2. A API retorna a nova tarefa criada (com task_id, etc.)
        const novaTarefa = response.data;

        // 3. Adicionamos a nova tarefa ao *início* da lista (melhor UI)
        setLista([novaTarefa, ...lista]);

        // 4. Limpamos o input
        setNovoItem('');
        // document.getElementById('input-entrada').focus(); // Corrigi um pequeno bug aqui

        } catch (err) {
            console.error('Erro ao adicionar tarefa:', err);
        }
    }

    async function clicou(id, estadoAtual) {
    try {
        const token = localStorage.getItem('token');
        const novoEstado = !estadoAtual;

        // 1. Fazer a chamada PUT para a API
        await axios.put(
        `http://localhost:5000/api/tasks/${id}`, // Passa o ID na URL
        { completed: novoEstado }, // Envia o novo estado
        { headers: { token: token } }
        );

        // 2. Atualizar o estado local (para a UI ser instantânea)
        // Encontramos a tarefa na lista e mudamos o 'completed' dela
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

        // 1. Fazer a chamada DELETE para a API
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { token: token },
        });

        // 2. Atualizar o estado local (filtrando e removendo o item)
        setLista(lista.filter((tarefa) => tarefa.task_id !== id));

        } catch (err) {
            console.error('Erro ao deletar tarefa:', err);
        }
    }

    async function deletaTudo() {
    // É uma boa prática pedir confirmação para uma ação destrutiva
    if (!window.confirm("Tem certeza que deseja deletar TODAS as tarefas?")) {
        return; // Se o usuário clicar "Cancelar", a função para
    }

    try {
        const token = localStorage.getItem('token');

        // 1. Fazer a chamada DELETE para a nossa nova rota '/all'
        await axios.delete('http://localhost:5000/api/tasks/all', {
            headers: { token: token },
        });

        // 2. Atualizar o estado local (limpando o array)
        setLista([]);

        } catch (err) {
            console.error('Erro ao deletar todas as tarefas:', err);
        }
    }

    return (
        <div>
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