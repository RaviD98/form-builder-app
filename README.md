# FormEZ – Advanced Form Builder

A modern form-builder built on the **MERN** stack with interactive features.

![Status](https://img.shields.io/badge/status-Production%20Ready-blue)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blue)
![Version](https://img.shields.io/badge/version-0.0.1(initial)-blue)
---

## ✨ Features

- **Categorize** – drag items into categories.  
- **Cloze** – fill-in-the-blanks with draggable words.  
- **Comprehension** – reading passage with MCQs.  

And:
- Real-time form preview.  
- Cloudinary image uploads.  
- Responsive UI (Tailwind CSS).  
- Copy-link sharing & CSV export.

---

## 🔧 Tech Stack

| Layer      | Tech                                                         |
| ---------- | ------------------------------------------------------------ |
| Front-end  | React, Tailwind CSS and interactive libraries      |
| Back-end   | Node.js, Express.js, MongoDB                       |
| Cloud      | MongoDB Atlas, Cloudinary                                    |

---

## 📦 Installation

git clone https://github.com/RaviD98/form-builder-app.git


### Backend

cd server
npm install
cp .env.example .env # then add your keys
npm run dev


### Frontend

cd client
npm install
cp .env.example .env # then set REACT_APP_API_URL
npm run dev


---

## ⚙️ Environment Variables

### `server/.env`

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/formbuilder
CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=<cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>


### `client/.env`

REACT_APP_API_URL=http://localhost:5000/api

---

## 🚀 Scripts

| Location | Command            | Description                    |
| -------- | ------------------ | ------------------------------ |
| server   | `npm run dev`      | Start backend w/ nodemon       |
| server   | `npm start`        | Start backend (prod)           |
| client   | `npm run dev`      | Start Vite dev server          |
| client   | `npm run build`    | Build static frontend assets   |
| client   | `npm run preview`  | Serve built assets locally     |

---

## 🔌 API Endpoints

| Method | Endpoint                | Purpose                    |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/forms`            | Create form                |
| GET    | `/api/forms/:id`        | Get form by ID             |
| POST   | `/api/responses`        | Submit response            |
| GET    | `/api/responses/:id`    | Get responses for a form   |
| POST   | `/api/upload`           | Upload image to Cloudinary |

---

## 🛠 Project Structure


```plaintext
formez-form-builder/
├── client/                 # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── server/                 # Express API
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── app.js
└── README.md
```

---


## 📋 Future Enhancements
- [ ] User authentication and authorization

- [ ] Form analytics and insights

- [ ] Additional question types (ranking, matrix, etc.)

- [ ] Form templates and themes

- [ ] Real-time collaboration

- [ ] Advanced validation rules

- [ ] Integration with external services (Google Sheets, Zapier)

---

## 🤝 Contributing

1. Fork → feature branch → commit → PR.  
2. Follow Conventional Commits.  
3. Run `npm test` before pushing.

