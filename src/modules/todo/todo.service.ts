import { pool } from "../../config/db"

// create a new todo
const createTodo = async (user_id: number, title: string) => {
    const result = await pool.query(`INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`, [user_id, title])
    return result
}

// get all todos
const getAllTodos = async () => {
    const result = await pool.query(`SELECT * FROM todos`)
    return result
}

// get a single todo
const getSingleTodo = async (id: string) => {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id])
    return result
}

// update a todo
const updateTodo = async (title: string, completed: boolean, id: string) => {
    const result = await pool.query(`UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *`, [title, completed, id])
    return result;
}

// delete a todo
const deleteTodo = async (id: string) => {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING *`, [id])
    return result;
}


export const todoService = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
}