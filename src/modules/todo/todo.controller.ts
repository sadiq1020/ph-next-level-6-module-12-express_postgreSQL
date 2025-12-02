import { Request, Response } from "express";
import { todoService } from "./todo.service";

// create a new todo
const createTodo = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await todoService.createTodo(user_id, title);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Todo created successfully'
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// get all todos
const getAllTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getAllTodos();
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Todo\'s Data fetched successfully'
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            detail: error
        })
    }
}

// get a single todo
const getSingleTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getSingleTodo(req.params.id!);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Todo not found"
            });
        }
        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Todo data fetched successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// update a todo
const updateTodo = async (req: Request, res: Response) => {
    const { title, completed } = req.body;

    try {
        const result = await todoService.updateTodo(title, completed, req.params.id!);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }
        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Todo data updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// delete a todo
const deleteTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoService.deleteTodo(req.params.id!);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        } else
            res.status(200).json({
                success: true,
                data: null,
                message: 'Todo data deleted successfully'
            });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const todoController = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
}