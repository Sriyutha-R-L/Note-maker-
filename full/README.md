
# 📝 Notes App – Full Stack Next.js Application

A **secure, full-stack Notes application** built using **Next.js App Router**, **MongoDB**, **NextAuth (JWT authentication)**, and **shadcn/ui**.  
The app supports **user authentication**, **CRUD operations**, and a **responsive modern UI**.

---

## 🚀 Live Demo

- **Production URL:** https://nextjs-noteapp.preview.emergentagent.com  
- **Local URL:** http://localhost:3000  

---

## ✨ Features

### 🔐 Authentication
- Email & Password authentication
- Secure password hashing using **bcrypt**
- JWT-based authentication via **NextAuth**
- Protected APIs (only authenticated users can access notes)

### 🗒 Notes Management
- Create, Read, Update, Delete notes
- Notes are user-specific
- Modal dialogs for create/edit
- Confirmation dialog for delete

### 🎨 UI & UX
- Built with **shadcn/ui** and **Tailwind CSS**
- Responsive grid layout
- Empty states & loading indicators
- Clean and modern design

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- lucide-react
- date-fns

### Backend
- Next.js API Routes
- MongoDB
- NextAuth (JWT strategy)
- bcryptjs
- uuid

---

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                 # Main Notes UI
│   ├── layout.js               # Root layout & metadata
│   ├── globals.css             # Global styles
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js    # Authentication (JWT)
│       ├── register/
│       │   └── route.js        # User registration
│       └── notes/
│           └── route.js        # Protected notes API
│
├── components/ui/              # shadcn/ui components
├── lib/utils.js                # Utility functions
├── tailwind.config.js          # Tailwind config
├── package.json
└── README.md
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|------|---------|------------|
| POST | /api/register | Register new user |
| POST | /api/auth/* | Login via NextAuth |

### Notes
| Method | Endpoint | Description |
|------|---------|------------|
| GET | /api/notes | Fetch user notes |
| POST | /api/notes | Create new note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## ▶️ Running the Project Locally

### Install dependencies
```
yarn install
```

### Development mode
```
yarn dev
```

### Production build
```
yarn build
yarn start
```

---

## 🧪 Testing Status

- Backend APIs tested
- Frontend E2E testing (Playwright) – optional enhancement

---

## 🧠 Key Learnings

- Full-stack development using Next.js App Router
- JWT-based authentication with NextAuth
- Secure password handling using bcrypt
- REST API design with MongoDB
- Modern UI development using shadcn/ui

---

## 🚀 Future Enhancements

- Search & filter notes
- Tags / categories
- OAuth login (Google, GitHub)
- Pagination
- Soft delete
- Role-based access control

---

## 👩‍💻 Author

**R.L. Sriyutha**  
Full Stack Developer | Data Science & AI Enthusiast

---

## ⭐ Acknowledgements

- Next.js Team
- MongoDB
- NextAuth
- shadcn/ui
