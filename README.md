﻿# 📋 Task Manager – MERN (Monolithic Setup)

This is a full-featured Task Management application built using the **MERN stack** (MongoDB, Express, React, Node.js) with a monolithic deployment approach. In this setup, the frontend (React app) is bundled and served through the backend (Express server), resulting in a single unified deployment folder.

---

## ✨ Features

- ✅ Task management with due dates and priorities
- ✅ To-do list organization
- ✅ Note-taking with rich formatting
- ✅ Dark mode toggle
- ✅ Notifications and reminders
- ✅ MongoDB backend with Express API
- ✅ React frontend served via Express

---

# 1. Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) (v6.14+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

# 2. Configure Environment Variables
### Create a .env file in the server/ directory:

env
Copy
Edit
PORT=5000
MONGO_URL=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret


Run the Application
Go to the server/ directory and start the Node server:

bash
Copy
Edit
cd ../server
npm start
Now, open your browser and go to:

arduino
Copy
Edit
http://localhost:5000
🚀 Deployment Tips
You can deploy this monolithic project to services like:

Render

Railway

Heroku (with Procfile)

VPS or cPanel (as a single Node.js app)

# 3. Tech Stack
Frontend: React.js, HTML5, CSS3, JavaScript

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (can add OAuth)

UI/UX: Responsive, Dark Mode

# Contribution
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

# License
This project is licensed under the MIT License.

# Acknowledgments
Thanks to all contributors and open-source maintainers. For any issues or support, feel free to reach out.
