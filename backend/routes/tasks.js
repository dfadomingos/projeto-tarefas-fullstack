const router = require('express').Router();
const db = require('../db'); // Nosso pool de conexão
const authorize = require('../middleware/authorize'); // Nosso middleware

// Todas as rotas neste arquivo vão usar o middleware 'authorize'
// Isso garante que o usuário esteja logado para acessar qualquer rota de tarefa.
router.use(authorize);

// --- ROTAS DO CRUD ---

// 1. CREATE (Criar uma tarefa)
// Rota: POST /api/tasks/
router.post('/', async (req, res) => {
  try {
    const { description } = req.body; // Pega a descrição do frontend

    // req.userId vem do nosso middleware 'authorize'
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

// 2. READ (Ler todas as tarefas do usuário)
// Rota: GET /api/tasks/
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    const userTasks = await db.query(
      // Vamos ordenar pelas mais recentes primeiro
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(userTasks.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// 3. UPDATE (Atualizar uma tarefa - ex: marcar como concluída)
// Rota: PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID da tarefa vindo da URL
    const { description, completed } = req.body; // Novos dados
    const userId = req.userId;

    // Primeiro, vamos apenas permitir atualizar 'completed'
    // (Você pode expandir isso depois)
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Valor de "completed" inválido.' });
    }

    const updateTask = await db.query(
      // A cláusula 'user_id = $3' garante que um usuário
      // só possa atualizar suas PRÓPRIAS tarefas.
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

// 5. DELETE ALL (Limpar todas as tarefas do usuário)
// Rota: DELETE /api/tasks/all
router.delete('/all', async (req, res) => {
    try {
        // O req.userId vem do middleware 'authorize'
        const userId = req.userId;

        // Deleta todas as tarefas ONDE o user_id for o do usuário logado
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

// 4. DELETE (Deletar uma tarefa)
// Rota: DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleteTask = await db.query(
            // 'user_id = $2' garante que ele só delete a própria tarefa
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