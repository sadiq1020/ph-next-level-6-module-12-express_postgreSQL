import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

// create a new user
const createUsers = async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email } = req.body;

    try {
        const result = await userService.createUser(name, email);
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
}

// get all users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
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
}


export const userController = {
    createUsers,
    getAllUsers
}