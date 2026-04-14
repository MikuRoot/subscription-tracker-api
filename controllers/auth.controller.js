import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // logic to create a new user
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const error = new Error(`User already exists`)
            error.statusCode = 409
            throw error
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create([{ name, email, password: hashedPassword }], { session })
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        await session.commitTransaction()
        await session.endSession()

        return res.status(201).json({
            success: true,
            data: {
                token,
                user: newUser[0]
            }
        })

    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            const error = new Error(`User not found`)
            error.statusCode = 404
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            const error = new Error(`Password is incorrect`)
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        return res.status(200).json({
            success: true,
            data: {
                token,
                user: existingUser
            }
        })
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({
            success: true,
            message: 'User signed out successfully'
        })
    } catch (error) {
        next(error)
    }
}