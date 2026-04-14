# 📬 Subscription Tracker API

A RESTful API for managing user subscriptions with automated renewal reminders via email. Built with Node.js, Express, MongoDB, and Upstash Workflow.

---

## 🚀 Features

- JWT-based user authentication (sign up, sign in, sign out)
- Full subscription lifecycle management (create, read, update, delete, cancel)
- Automated email reminders at 7, 5, 2, and 1 day(s) before renewal via Upstash Workflow
- Rate limiting and bot protection via Arcjet
- Centralized error handling with Mongoose-aware error normalization

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail) |
| Workflow / Queue | Upstash QStash + Workflow |
| Security | Arcjet (shield, bot detection, rate limiting) |

---

## 📁 Project Structure

```
├── app.js                        # Entry point
├── config/
│   ├── env.js                    # Environment variable exports
│   ├── arcjet.js                 # Arcjet client setup
│   ├── nodemailer.js             # Nodemailer transporter
│   └── uptash.js                 # Upstash Workflow client
├── controllers/
│   ├── auth.controller.js        # Sign up, sign in, sign out
│   ├── user.controller.js        # User CRUD
│   ├── subscription.controller.js# Subscription CRUD + user queries
│   └── workflow.controller.js    # Upstash reminder workflow
├── middlewares/
│   ├── auth.middleware.js        # JWT authorization
│   ├── arcjet.middleware.js      # Arcjet protection middleware
│   └── error.middleware.js       # Global error handler
├── models/
│   ├── user.model.js             # User schema
│   └── subscription.model.js     # Subscription schema
├── routers/
│   ├── auth.routers.js
│   ├── user.routes.js
│   ├── subscription.routes.js
│   └── workflow.routes.js
└── utils/
    ├── send-email.js             # Email sending logic
    └── email-template.js         # HTML email templates
```

---

## ⚙️ Environment Variables

Create `.env.development.local` (for dev) or `.env.production.local` (for prod):

```env
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# MongoDB
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/subscription-tracker

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Arcjet
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

# Upstash QStash
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key

# Nodemailer (Gmail)
EMAIL_PASSWORD=your_gmail_app_password
```

> **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) rather than your account password.

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker

# Install dependencies
npm install

# Start in development mode
npm run dev

# Start in production mode
npm start
```

---

## 📡 API Reference

### Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Sign in and receive JWT | No |
| POST | `/logout` | Clear auth cookie | No |

**Sign Up / Login request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Users — `/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all users | No |
| GET | `/:id` | Get a user by ID | Yes |

---

### Subscriptions — `/api/v1/subscriptions`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all subscriptions | Yes |
| GET | `/upcoming-renewals` | Get upcoming renewals | Yes |
| GET | `/user/:id` | Get subscriptions for a user | Yes |
| GET | `/:id` | Get a subscription by ID | Yes |
| POST | `/` | Create a new subscription | Yes |
| PUT | `/:id` | Update a subscription | Yes |
| PUT | `/:id/cancel` | Cancel a subscription | Yes |
| DELETE | `/:id` | Delete a subscription | Yes |

**Create Subscription request body:**
```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Visa **** 4242",
  "startDate": "2025-01-01"
}
```

**Supported values:**

- `currency`: `USD`, `EUR`, `GBP`
- `frequency`: `daily`, `weekly`, `monthly`, `yearly`
- `category`: `sports`, `news`, `entertainment`, `lifestyle`, `technology`, `finance`, `politics`, `business`, `education`, `music`, `health`, `family`, `travel`, `other`
- `status`: `active`, `cancelled`, `expired`

> `renewalDate` is auto-calculated from `startDate` + `frequency` if not provided. Status is automatically set to `expired` if the renewal date has passed.

---

### Workflows — `/api/v1/workflows`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subscription/reminder` | Upstash Workflow endpoint — triggers timed email reminders |

> This endpoint is called internally by Upstash QStash. Do not call it directly.

---

## 📧 Email Reminders

When a subscription is created, an Upstash Workflow is triggered that sleeps until each reminder window and sends an HTML email to the user at:

- **7 days** before renewal
- **5 days** before renewal
- **2 days** before renewal
- **1 day** before renewal

---

## 🔒 Security

Arcjet middleware provides:
- **Shield** — protection against common web attacks (SQLi, XSS, etc.)
- **Bot Detection** — blocks automated clients
- **Token Bucket Rate Limiting** — 2,000 token refill/hour, 5,000 capacity

> Arcjet is currently disabled in `app.js` (`app.use(arcjetMiddleware)` is commented out). Uncomment to enable.

---

## 🧩 Auth Flow

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned in the response body upon sign up or login.

---

## 📝 License

MIT
