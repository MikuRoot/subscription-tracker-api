import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/uptash.js";
import {SERVER_URL} from "../config/env.js";

export const getAllSubscriptions = (req, res, next) => {

}

export const getSubscriptionById = (req, res, next) => {}

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id.toString()
        })

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            retries: 0
        })

        return res.status(201).json({ success: true, data: { subscription, workflowRunId } })
    } catch (error) {
        next(error)
    }
}

export const updateSubscription = (req, res, next) => {}

export const deleteSubscription = (req, res, next) => {}

export const getAllSubscriptionsByUser = async (req, res, next) => {
    try {
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error(`You are not authorized to view this user's subscriptions`)
            error.statusCode = 401
            throw error
        }

        const subscriptions = await Subscription.find({user: req.params.id})
        return res.status(200).json({ success: true, data: subscriptions })
    } catch (error) {
        next(error)
    }
}

export const cancelSubscription = (req, res, next) => {}

export const getUpcomingRenewals = (req, res, next) => {}