import express, { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// const express = require('express')
const app = express()
const port = 5000

// middleware (parser)
app.use(express.json());
// app.use(express.urlencoded());

// creating a pool connection
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});

// creating database table
const initDB = async () => {

    // create table named users
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)

    // create table named todos
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
}

initDB();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date()}.toISOString] ${req.method} ${req.path}`);
    next();
}

// home route (using logger middleware)
app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

// CRUD with users
// post method 
app.post('/users', async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );
        // console.log(result);
        // console.log(result.rows[0]);

        // res.send({ message: 'data inserted' })
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Data created successfully'
        })

        // res.sendStatus(201);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// get method for all users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'User\'s Data fetched successfully'
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            detail: error
        })
    }
});

// get method for single user
app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else
            res.status(200).json({
                success: true,
                data: result.rows[0],
                message: 'User data fetched successfully'
            });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
});

// update user
app.put('/users/:id', async (req: Request, res: Response) => {

    const { name, email } = req.body;
    try {
        const result = await pool.query(`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`, [name, email, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else
            res.status(200).json({
                success: true,
                data: result.rows[0],
                message: 'User data updated successfully'
            });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
});

// delete user
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else
            res.status(200).json({
                success: true,
                data: null,
                message: 'User data deleted successfully'
            });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
});

// ---- Todos CRUD routes -----
// post a new todos
app.post('/todos', async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await pool.query(`INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`, [user_id, title]);
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
})

// get all todos
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`);
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
});

// listening route
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
