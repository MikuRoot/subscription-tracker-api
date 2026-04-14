import nodemailer from 'nodemailer'
import {EMAIL_PASSWORD} from "./env.js";

export const emailAccount = "tranthevu.iuh@gmail.com"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailAccount,
        pass: EMAIL_PASSWORD
    }
})

export default transporter