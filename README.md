# Assimetria – Auto-generated Tech Blog

Daily AI-generated technical articles, delivered by a fully containerized stack on AWS.

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript + SQLite
- **Infra:** Docker, AWS ECR, AWS CodeBuild, EC2

The goal of this project is to automatically generate one new technical article per day using an AI provider, store it in a database, and expose it via a minimal API and a simple blog UI.

---

## 🔍 High-level Overview

### Architecture

- **Backend**
  - Node.js + Express API
  - SQLite database stored on disk (`backend/data/blog.db`)
  - Seeds initial articles on first run
  - Schedules a **daily cron job** to generate a new article via **OpenRouter** (LLM provider)
  - Exposes REST endpoints:
    - `GET /articles`
    - `GET /articles/:id`

- **Frontend**
  - React + Vite + TypeScript
  - Calls the backend API via `VITE_API_BASE_URL`
  - Displays:
    - List of latest articles
    - Detail page for a given article

- **Infrastructure**
  - Docker images built for frontend and backend
  - Pushed to **AWS ECR**
  - **AWS CodeBuild** builds images from the Git repository and pushes to ECR
  - **EC2 instance** pulls images and runs the containers
  - A simple script `deploy-blog.sh` in the EC2 instance automates:
    - Logging in to ECR
    - Pulling latest images
    - Restarting backend and frontend containers

---

## 🧱 Tech Stack

- **Frontend**
  - React
  - Vite
  - TypeScript
  - CSS (custom styling)

- **Backend**
  - Node.js
  - TypeScript
  - Express
  - SQLite
  - `node-cron` for scheduling
  - OpenRouter API (LLM provider)

- **Infrastructure**
  - Docker & Docker Compose
  - AWS ECR (Elastic Container Registry)
  - AWS CodeBuild
  - AWS EC2
  - AWS CLI

---

## 📁 Repository Structure

```text
.
├── backend
│   ├── src
│   │   ├── index.ts              # Express app bootstrap
│   │   ├── routes                # API routes
│   │   ├── db                    # DB helpers / seed
│   │   ├── services              # Article generation + cron job
│   │   └── ...
│   ├── data                      # SQLite DB file (blog.db in production)
│   ├── .env                      # Local backend env file (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── src
│   │   ├── api                   # API client
│   │   ├── pages                 # List + detail pages
│   │   ├── App.tsx
│   │   └── ...
│   ├── .env.local                # Local frontend env (not committed)
│   ├── package.json
│   └── vite.config.ts
│
├── infra
│   ├── docker-compose.yml        # Local/dev compose
│   └── ...
│
├── buildspec.yml                 # AWS CodeBuild definition
├── README.md
└── ...
✅ Prerequisites
For local development:

Node.js (LTS recommended)

npm or [pnpm/yarn]

Docker (for running containers locally if desired)

Git (you use Git Bash on Windows, which is perfect)

For article generation in backend:

An OpenRouter API key
https://openrouter.ai/

For AWS deployment (already configured, but listed for completeness):

AWS account

ECR repositories:

assimetira-auto-blog-backend (or similar)

assimetira-auto-blog-frontend (or similar)

AWS CodeBuild project configured with this repo and buildspec.yml

EC2 instance with:

Docker installed

deploy-blog.sh script

A backend.env file with backend secrets

💻 Local Development
1. Clone the repository
bash
Copiar código
git clone <YOUR_REPO_URL> assimetria-auto-blog
cd assimetria-auto-blog
2. Backend – Local Setup
Go into the backend folder:

bash
Copiar código
cd backend
Install dependencies:

bash
Copiar código
npm install
Create a .env file (local only, do not commit) with:

env
Copiar código
# OpenRouter configuration
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

# Optional topic used when generating articles
DEFAULT_ARTICLE_TOPIC=Tech and software development
Run the backend in dev mode:

bash
Copiar código
npm run dev
What this does:

Ensures the SQLite DB and articles table exist

Seeds initial articles if needed

Starts the Express server (usually on http://localhost:4000)

Schedules the daily cron job (09:00 UTC) to generate a new article

3. Frontend – Local Setup
In another terminal, go to the frontend:

bash
Copiar código
cd frontend
Install dependencies:

bash
Copiar código
npm install
Create a .env.local file:

env
Copiar código
VITE_API_BASE_URL=http://localhost:4000
Start the frontend dev server:

bash
Copiar código
npm run dev
You can now open the app in the browser (usually):

http://localhost:5173

🐳 Local Development with Docker Compose (optional)
From the project root (or infra folder, depending on how you organize):

bash
Copiar código
cd infra
docker compose up --build
This will:

Build the backend and frontend images

Start both containers

Expose:

Backend on 4000

Frontend on 80 or 5173 (depending on your compose file)

📡 API Endpoints
GET /articles
Returns a list of articles sorted from newest to oldest.

Example response:

json
Copiar código
[
  {
    "id": 10,
    "title": "The Future of AI in Software Development",
    "content": "Lorem ipsum...",
    "createdAt": "2025-12-08T17:49:11.348Z"
  },
  ...
]
GET /articles/:id
Returns a single article by ID.

Example:

http
Copiar código
GET /articles/10
Response:

json
Copiar código
{
  "id": 10,
  "title": "The Future of AI in Software Development",
  "content": "Lorem ipsum...",
  "createdAt": "2025-12-08T17:49:11.348Z"
}
🕒 Daily Article Generation
The backend uses node-cron to schedule a daily job:

Cron expression: 0 9 * * *

Time zone: UTC (09:00 UTC every day)

On backend startup:

The app checks if the DB has at least a minimum number of articles (seed).

It starts the cron job:

Logs Cron triggered: generating daily article...

Calls the OpenRouter API with the configured model and topic

Saves the generated article to the SQLite DB (articles table)

The frontend simply displays whatever the backend returns – newest first.

🚀 Deployment Flow (AWS)
0. High-level Deployment Flow
You commit & push changes to the Git repository (e.g. branch main).

You start a build in AWS CodeBuild using buildspec.yml.

CodeBuild:

Logs into ECR

Builds backend & frontend Docker images

Tags and pushes images to ECR.

On the EC2 instance, you connect via SSH and run:

bash
Copiar código
./deploy-blog.sh
The script:

Logs into ECR

Pulls the latest backend and frontend images

Stops any running containers

Starts new containers:

Backend on port 4000

Frontend on port 80 (HTTP)

1. Git Workflow (what you do on your machine)
Typical workflow in Git Bash:

bash
Copiar código
# Check which files changed
git status

# Stage changes
git add .

# Commit with an English message
git commit -m "feat: improve article list layout"

# Push to the remote repository (main branch)
git push origin main
After the push, go to AWS CodeBuild in the console and start a build for your project.

2. CodeBuild (already configured)
The buildspec.yml file:

Logs into ECR

Builds images for backend and frontend (using Dockerfiles)

Pushes them to ECR with the latest tag, e.g.:

290698220791.dkr.ecr.eu-west-1.amazonaws.com/asssimetria-auto-blog-backend:latest

290698220791.dkr.ecr.eu-west-1.amazonaws.com/asssimetria-auto-blog-frontend:latest

You only need to:

Make sure the build succeeds.

Note that the latest tag was updated in ECR.

3. EC2 – Deploying with deploy-blog.sh
On your EC2 instance:

Connect via SSH (from your local machine):

bash
Copiar código
cd C:\Users\YOUR_USER\keys
ssh -i "assimetria-key.pem" ubuntu@<EC2_PUBLIC_IP>
Ensure you are inside the project folder on EC2, e.g.:

bash
Copiar código
cd ~/asssimetria-auto-blog
Run the deployment script:

bash
Copiar código
./deploy-blog.sh
The script should:

Log in to ECR using aws ecr get-login-password

Pull newest backend + frontend images

Stop old containers (asssimetria-backend, asssimetria-frontend) if they exist

Run new containers:

Backend: exposes 4000:4000

Frontend: exposes 80:80

After this, you should be able to open the blog in your browser:

http://<EC2_PUBLIC_IP>

The frontend will talk to the backend using the API base URL baked in during the build (e.g. http://<EC2_PUBLIC_IP>:4000).

🔧 Environment Variables Summary
Backend (.env for local, backend.env for production)
env
Copiar código
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
DEFAULT_ARTICLE_TOPIC=Tech and software development
Frontend (.env.local for local dev)
env
Copiar código
VITE_API_BASE_URL=http://localhost:4000
For production, the API base URL is passed via build args / CodeBuild into the build so the frontend points at the EC2 backend (e.g. http://<EC2_PUBLIC_IP>:4000).

🧪 How to Test After Deploy
API only

bash
Copiar código
curl http://<EC2_PUBLIC_IP>:4000/articles
curl http://<EC2_PUBLIC_IP>:4000/articles/1
Frontend

Open:

text
Copiar código
http://<EC2_PUBLIC_IP>
Check if the article list loads

Check if clicking “Read article” goes to the article detail

Check that newest articles appear on top

📝 Notes
The backend uses a file-based SQLite database. In EC2, this is stored in the container filesystem. If you remove the backend container and image, the DB will be reset (unless you mount a volume).

The daily cron job runs inside the backend container, so the container must be running continuously for the job to execute.

For the challenge, it's enough that:

The blog loads

The API returns articles

The cron is configured to generate an article per day via AI

📜 License
This project was created as part of a technical challenge and is intended for educational / demonstration purposes.