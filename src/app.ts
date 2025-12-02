import express, { NextFunction, Request, Response } from 'express';
// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// import path from 'path';
import { error } from 'console';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';
import { authRoutes } from './modules/auth/auth.routes';

// dotenv.config({ path: path.join(process.cwd(), '.env') });

// const express = require('express')
const app = express()

// middleware (parser)
app.use(express.json());
// app.use(express.urlencoded());

// creating database and a pool connection
// const pool = new Pool({
//     connectionString: `${config.connection_Str}`,
// });

// // creating database table
// const initDB = async () => {

//     // create table named users
//     await pool.query(`
//         CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         age INT,
//         phone VARCHAR(15),
//         address TEXT,
//         created_at TIMESTAMP DEFAULT NOW(),
//         updated_at TIMESTAMP DEFAULT NOW()
//         )
//         `)

//     // create table named todos
//     await pool.query(`
//         CREATE TABLE IF NOT EXISTS todos (
//         id SERIAL PRIMARY KEY,
//         user_id INT REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         completed BOOLEAN DEFAULT FALSE,
//         due_date DATE,
//         created_at TIMESTAMP DEFAULT NOW(),
//         updated_at TIMESTAMP DEFAULT NOW()
//         )
//         `);
// }

// initialize the database
initDB();

// logger middleware (moved to the logger.ts)
// const logger = (req: Request, res: Response, next: NextFunction) => {
//     console.log(`[${new Date()}.toISOString] ${req.method} ${req.path}`);
//     next();
// }

// home route (using logger middleware)
app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

// users CRUD routes
app.use("/users", userRoutes)

// todos CRUD routes 
app.use("/todos", todoRoutes);

// auth routes
app.use("/auth", authRoutes);

export default app;
