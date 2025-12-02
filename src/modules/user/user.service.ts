import { pool } from "../../config/db";

// create a new user
const createUser = async (name: string, email: string) => {
    const result = await pool.query(
        `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
        [name, email]
    );
    return result;
}

// get all users
const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

export const userService = {
    createUser,
    getAllUsers
}