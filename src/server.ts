import express, { Request, Response } from 'express';
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

// home route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

// post users route
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

// listening route
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
