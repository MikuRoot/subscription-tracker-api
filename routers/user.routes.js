import { Router } from 'express';
import {createUser, deleteUser, getUserById, getUsers, updateUser} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.get('/', getUsers)

userRoutes.get('/:id', authorize, getUserById)

userRoutes.post('/', createUser)

userRoutes.put('/:id', updateUser)

userRoutes.delete('/:id', deleteUser)

export default userRoutes;