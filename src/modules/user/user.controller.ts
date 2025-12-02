import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

// create a new user
const createUsers = async (req: Request, res: Response) => {
    // console.log(req.body);
    // const { name, email, password } = req.body;

    try {
        const result = await userService.createUser(req.body);

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

// get a single user
const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getSingleUser(req.params.id as string); // type assertion or req.params.id! (bang sign also works)

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
}

// update a user
const updateUser = async (req: Request, res: Response) => {

    const { name, email } = req.body;
    try {
        const result = await userService.updateUser(name, email, req.params.id!);

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
}

// delete a user
const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.deleteUser(req.params.id!);

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
}

export const userController = {
    createUsers,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}