import { Router } from "express";
import {signIn, signOut, signUp} from "../controllers/auth.controller.js";

const authRouters = Router()

authRouters.post('/login', signIn)

authRouters.post('/signup', signUp)

authRouters.post('/logout', signOut)

export default authRouters;