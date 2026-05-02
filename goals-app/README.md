# 🎯 Goals Task Manager

A full-stack task management web app built with **Node.js**, **Express**, and **MongoDB**.

---

## Features

- Create, view, edit, and delete goals
- Mark goals as Pending → In Progress → Completed
- Favourite/unfavourite goals
- Filter by status (Home, Favourite, In Progress, Completed)
- Input validation and meaningful error messages
- RESTful API backend with MongoDB persistence

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | Node.js + Express       |
| Database | MongoDB (via Mongoose)  |
| Frontend | Vanilla HTML/CSS/JS     |
| Validate | express-validator        |

---

## Project Structure

```
goals-app/
├── server.js              # Entry point — Express app setup
├── .env                   # Environment variables (PORT, MONGO_URI)
├── package.json
├── models/
│   └── Goal.js            # Mongoose schema & model
├── routes/
│   └── goals.js           # All REST API routes
├── middleware/
│   └── validate.js        # express-validator rules
└── public/
    └── index.html         # Frontend (served as static file)
```

---

## Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud URI

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd goals-app
npm install
```

### 3. Configure Environment

Edit `.env`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/goals_db
```

For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### 4. Run the App

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

Open your browser at `http://localhost:3000`

---

## API Reference

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| GET    | /api/goals                  | Get all goals                  |
| GET    | /api/goals?status=completed | Filter by status               |
| GET    | /api/goals?isFavourite=true | Filter favourites              |
| GET    | /api/goals/:id              | Get single goal by ID          |
| POST   | /api/goals                  | Create a new goal              |
| PUT    | /api/goals/:id              | Update title/desc/favourite    |
| PATCH  | /api/goals/:id/status       | Update status only             |
| DELETE | /api/goals/:id              | Delete a goal                  |

### Example: Create a Goal

```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "description": "Complete the backend course"}'
```

### Example: Update Status

```bash
curl -X PATCH http://localhost:3000/api/goals/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

---

## Validation Rules

- **Title**: Required, max 200 chars, cannot be empty
- **Description**: Optional, max 1000 chars
- **Status**: Must be one of `pending`, `in-progress`, `completed`
- **Cannot** mark a `completed` goal as completed again (returns 400)

---

## Key Design Decisions

1. **Mongoose ODM** — Provides schema validation at the database level as a second safety net beyond express-validator.
2. **Separate PATCH /status route** — Status transitions are a distinct operation from editing content, so they get their own endpoint. This enforces the "can't re-complete a completed task" rule cleanly.
3. **express-validator middleware** — Keeps validation logic out of route handlers, making routes clean and testable.
4. **dotenv** — Keeps secrets and config out of source code. Never commit `.env` to git.
5. **Static frontend** — The `public/` folder is served by Express itself, so no separate frontend server is needed for development.

---

## Git Setup

```bash
git init
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
git add .
git commit -m "Initial commit: Goals Task Manager"
git remote add origin <your-github-url>
git push -u origin main
```
