import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from "./config/env.js";
import authRouters from "./routers/auth.routers.js";
import userRoutes from "./routers/user.routes.js";
import workflowRoutes from "./routers/workflow.routes.js";
import subscriptionRoutes from "./routers/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(arcjetMiddleware)

app.use('/api/v1/auth', authRouters);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes)
app.use('/api/v1/workflows', workflowRoutes)

app.get('/', (req, res) => res.send('Fuck off!'));

app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase()
})

export default app;