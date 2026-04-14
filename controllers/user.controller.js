import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        return res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            const error = new Error(`User not found`)
            error.statusCode = 404
            throw error
        }

        return res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {}

export const updateUser = async (req, res, next) => {}

export const deleteUser = async (req, res, next) => {}