const router = require('express').Router();
const db = require('../db'); 
const authorize = require('../middleware/authorize'); 

router.use(authorize);

//criando tarefa
router.post('/', async (req, res) => {
  try {
    const { description } = req.body;     
    const userId = req.userId; 

    const newTask = await db.query(
      'INSERT INTO tasks (user_id, description) VALUES ($1, $2) RETURNING *',
      [userId, description]
    );

    res.json(newTask.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//lendo tarefas do usuario
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    const userTasks = await db.query(      
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(userTasks.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//marcando tarefa como concluida
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { description, completed } = req.body; 
    const userId = req.userId;
    
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Valor de "completed" inválido.' });
    }

    const updateTask = await db.query(      
      'UPDATE tasks SET completed = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *',
      [completed, id, userId]
    );

    if (updateTask.rows.length === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada ou não pertence ao usuário.' });
    }

    res.json(updateTask.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//limpando todas tarefas
router.delete('/all', async (req, res) => {
    try {        
        const userId = req.userId;
        
        await db.query(
            'DELETE FROM tasks WHERE user_id = $1',
            [userId]
        );

        res.json({ message: 'Todas as tarefas foram deletadas com sucesso.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

//deletando tarefa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleteTask = await db.query(            
            'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleteTask.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada ou não pertence ao usuário.' });
        }

        res.json({ message: 'Tarefa deletada com sucesso.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;