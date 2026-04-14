import {emailTemplates} from "./email-template.js";
import dayjs from "dayjs";
import transporter, { emailAccount } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((template) => template.label === type);
    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo)
    const subject = template.generateSubject(mailInfo)

    const emailOptions = {
        from: emailAccount,
        to: to,
        subject: subject,
        html: message,
    }

    await transporter.sendMail(emailOptions, (error, info) => {
        if (error) return console.error('Error sending email:', error)
        console.log('Email sent:', info.response);
    })
};