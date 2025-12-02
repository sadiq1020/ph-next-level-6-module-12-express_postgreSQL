import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// create a new user
const createUser = async (payload: Record<string, unknown>) => {
    const { name, role, email, password } = payload;

    // hashing the password
    const hashedPassword = await bcrypt.hash(password as string, 10)

    const result = await pool.query(
        `INSERT INTO users (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, role, email, hashedPassword] // sending hashed password instead of password;
    );
    return result;
}

// get all users
const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

// get a single user
const getSingleUser = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;
}

// update a user
const updateUser = async (name: string, email: string, id: string) => {
    const result = await pool.query(`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`, [name, email, id]);
    return result;
}

// delete a user
const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
    return result;
}

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}