# SJA TRANSPORT – Backend API

Production-ready REST API for the SJA TRANSPORT website built with **Node.js**, **Express.js**, and **MongoDB Atlas**.

## Quick Start

```bash
cd server
npm install
cp .env.example .env     # fill in your credentials
npm run dev               # development with auto-reload
npm start                 # production
```

## Environment Variables

| Variable        | Description                            |
| --------------- | -------------------------------------- |
| `PORT`          | Server port (default 5000)             |
| `MONGODB_URI`   | MongoDB Atlas connection string        |
| `EMAIL_HOST`    | SMTP host (e.g. smtp.gmail.com)        |
| `EMAIL_PORT`    | SMTP port (e.g. 587)                   |
| `EMAIL_USER`    | Sender email address                   |
| `EMAIL_PASS`    | Email app password                     |
| `OWNER_EMAIL`   | Booking notification recipient         |
| `FRONTEND_URL`  | Allowed CORS origin                    |

## API Endpoints

### Bookings
| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/bookings`      | Create booking      |
| GET    | `/api/bookings`      | List all bookings   |
| GET    | `/api/bookings/:id`  | Get single booking  |
| PUT    | `/api/bookings/:id`  | Update booking      |
| DELETE | `/api/bookings/:id`  | Delete booking      |

### Feedback
| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/feedback`      | Submit feedback     |
| GET    | `/api/feedback`      | List feedback       |
| PUT    | `/api/feedback/:id`  | Update feedback     |
| DELETE | `/api/feedback/:id`  | Delete feedback     |

### Gallery
| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/gallery`            | Add gallery item        |
| GET    | `/api/gallery`            | List gallery            |
| GET    | `/api/gallery/featured`   | List featured gallery   |
| PUT    | `/api/gallery/:id`        | Update gallery item     |
| DELETE | `/api/gallery/:id`        | Delete gallery item     |
| PATCH  | `/api/gallery/:id/like`   | Increment gallery likes |

### Achievements
| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/achievements`     | Create achievement     |
| GET    | `/api/achievements`     | List achievements      |
| PUT    | `/api/achievements/:id` | Update achievement     |
| DELETE | `/api/achievements/:id` | Delete achievement     |

### Website Content
| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/api/content`  | Get site content     |
| PUT    | `/api/content`  | Update site content  |

### Contact Messages
| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/api/contact`     | Send message         |
| GET    | `/api/contact`     | List messages        |
| DELETE | `/api/contact/:id` | Delete message       |

### Health
| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/api/health`   | API health check     |

## Architecture

```
server/
├── config/           # DB & email configuration
├── controllers/      # Route handlers (business logic)
├── middleware/        # Error handler, validation
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
├── services/         # Email notification service
├── utils/            # Async handler utility
├── app.js            # Express application setup
├── server.js         # Entry point
└── .env.example      # Environment variable template
```

## Security

- **Helmet** – Sets secure HTTP headers
- **CORS** – Restricts cross-origin requests to the frontend URL
- **express-validator** – Validates and sanitizes all incoming data
- **bcryptjs** – Hashes admin passwords with salt rounds of 12

---

Developed by **Sakthivel S**
