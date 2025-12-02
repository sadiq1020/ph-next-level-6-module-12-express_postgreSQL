import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";

const router = Router();

// follow: routes -> controller -> service -> model (db)

// --> Right now we are in "/users" route
// 1. controller -> will receive the request and send response
// 2. service -> will have the business logic


// create a new user
router.post("/", userController.createUsers)

// get all users
router.get('/', userController.getAllUsers)

// get a single user
router.get('/:id', userController.getSingleUser)

// update a user
router.put('/:id', userController.updateUser)

// delete a user
router.delete('/:id', userController.deleteUser)

export const userRoutes = router;