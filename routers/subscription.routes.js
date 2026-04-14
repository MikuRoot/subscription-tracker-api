import { Router } from 'express';
import {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    getAllSubscriptionsByUser,
    cancelSubscription,
    getUpcomingRenewals
} from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRoutes = Router();

subscriptionRoutes.get('/', authorize, getAllSubscriptions)

// ✅ Specific routes BEFORE parameterized routes
subscriptionRoutes.get('/upcoming-renewals', authorize, getUpcomingRenewals)
subscriptionRoutes.get('/user/:id', authorize, getAllSubscriptionsByUser)

// Parameterized routes after
subscriptionRoutes.get('/:id', authorize, getSubscriptionById)
subscriptionRoutes.post('/', authorize, createSubscription)
subscriptionRoutes.put('/:id', authorize, updateSubscription)
subscriptionRoutes.put('/:id/cancel', authorize, cancelSubscription)
subscriptionRoutes.delete('/:id', authorize, deleteSubscription)

export default subscriptionRoutes;