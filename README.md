# TheRecipeBook 🍽️

> A full-stack web application for meal planning, recipe management and smart grocery shopping.

![TheRecipeBook](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://therecipebook-liard.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://therecipebook-4uw5.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

TheRecipeBook is a final year BSc Software Engineering project built at Cardiff Metropolitan University. It addresses real everyday problems — scattered recipes, no meal plan, wasted food and money — by providing one organised platform for:

- Creating and managing personal recipe libraries
- Planning meals across a full 7-day weekly calendar
- Auto-generating grocery shopping lists from meal plans
- Discovering and rating community recipes
- Admin oversight of users and content

---

## Features

### User Features
- **Recipe Management** — Create, edit, delete and categorise recipes with images, ingredients, instructions and dietary tags
- **Weekly Meal Planner** — Assign recipes to breakfast, lunch, dinner and snack slots across a 7-day calendar
- **Shopping List Generator** — One-click generation of a grocery list from the weekly meal plan, with check-off and custom item support
- **Recipe Discovery** — Browse all community recipes with filters for cuisine, difficulty, prep time and dietary restrictions
- **Ratings & Reviews** — Leave star ratings and written reviews on any recipe; average rating updates automatically
- **Add to Plan from Recipe** — Assign any recipe directly to a meal slot without leaving the recipe page
- **Email Verification** — Secure account creation with email confirmation

### Admin Features
- **User Management** — View, approve, edit and delete user accounts
- **Content Moderation** — Review and delete inappropriate recipes
- **Analytics Dashboard** — Approval rate, verification rate and user breakdown charts
- **Password Management** — Secure admin password change

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Redux Toolkit | State management |
| Framer Motion | Animations |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Bcrypt.js | Password hashing |
| Multer + Cloudinary | Image upload |
| Nodemailer | Email verification |

---

## Project Structure

```
THERECIPEBOOK/
├── Front-End/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── CreateRecipeModal/
│       │   └── RecipeReviews/
│       ├── config/
│       │   └── api.js              # Base URL config
│       ├── features/
│       │   ├── auth/
│       │   │   ├── authSlice.js
│       │   │   └── adminSlice.js
│       │   ├── mealPlanning/
│       │   │   └── mealPlanningSlice.js
│       │   └── recipes/
│       │       └── recipesSlice.js
│       ├── pages/
│       │   ├── Home/
│       │   ├── RecipePage/
│       │   ├── RecipeView/
│       │   ├── MyRecipes/
│       │   ├── MealPlanning/
│       │   ├── About/
│       │   ├── Contact/
│       │   ├── AdminDashboard/
│       │   └── auth/
│       │       ├── Login/
│       │       ├── Register/
│       │       ├── ForgotPassword/
│       │       └── EmailVerification/
│       └── services/
│           └── authService.js
│
└── Back-End/
    ├── controllers/
    │   ├── Admin/
    │   │   ├── authController.js
    │   │   └── adminRecipesController.js
    │   └── Users/
    │       ├── authControllers.js
    │       ├── mealPlanningController.js
    │       ├── weeklyPlanController.js
    │       ├── shoppingListController.js
    │       └── feedbackController.js
    ├── middlewares/
    │   └── auth-middleware.js
    ├── modules/
    │   └── storage/
    │       └── cloudinary.js
    ├── routes/
    │   ├── adminRoutes/
    │   └── userRoutes/
    ├── schema/
    │   ├── Admin/
    │   │   └── authSchema.js
    │   └── Users/
    │       ├── authSchema.js
    │       ├── mealPlanningSchema.js
    │       ├── weeklyPlanSchema.js
    │       ├── shoppingListSchema.js
    │       └── feedbackSchema.js
    └── services/
        └── Users/
            └── authService.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/therecipebook.git
cd therecipebook
```

### 2. Install backend dependencies

```bash
cd Back-End
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Front-End
npm install
```

### 4. Set up environment variables

See [Environment Variables](#environment-variables) below.

### 5. Run the development servers

**Backend** (in one terminal):
```bash
cd Back-End
npm run dev
```

**Frontend** (in another terminal):
```bash
cd Front-End
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Environment Variables

### Back-End `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@therecipebook.com
ADMIN_PASSWORD=your_admin_password
```

### Front-End `.env.development`

```env
VITE_API_URL=http://localhost:5000
```

### Front-End `.env.production`

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

> ⚠️ Never commit `.env` files to GitHub. They are listed in `.gitignore`.

---

## API Endpoints

### Auth — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/verify-email?token=` | Public | Verify email address |
| POST | `/forgot-password` | Public | Send password reset email |

### Recipes — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/meal-planning` | Private | Get user recipes |
| POST | `/meal-planning` | Private | Create recipe |
| PUT | `/meal-planning/:id` | Private | Update recipe |
| DELETE | `/meal-planning/:id` | Private | Delete recipe |

### Weekly Plan — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/weekly-plan` | Private | Get plan for a week |
| POST | `/weekly-plan` | Private | Save weekly plan |
| PATCH | `/weekly-plan/clear-day` | Private | Clear a single day |
| DELETE | `/weekly-plan` | Private | Delete weekly plan |

### Shopping List — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/shopping-list` | Private | Get shopping list |
| POST | `/shopping-list/generate` | Private | Generate from meal plan |
| PATCH | `/shopping-list/toggle` | Private | Toggle item checked |
| POST | `/shopping-list/item` | Private | Add custom item |
| DELETE | `/shopping-list/item` | Private | Delete item |
| DELETE | `/shopping-list` | Private | Clear entire list |

### Feedback — `/api/v1/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/feedback/:recipeId` | Public | Get recipe reviews |
| POST | `/feedback/:recipeId` | Private | Submit review |
| DELETE | `/feedback/:recipeId` | Private | Delete own review |

### Admin — `/api/v1/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Admin login |
| GET | `/users` | Admin | Get all users |
| PATCH | `/users/:id/approve` | Admin | Approve user |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/recipes` | Admin | Get all recipes |
| DELETE | `/recipes/:id` | Admin | Delete recipe |
| PATCH | `/settings/change-password` | Admin | Change admin password |

---

## Screenshots

| Page | Description |
|---|---|
| Home | Hero, features, community recipes, CTA |
| Recipes | Browse with filters and featured recipe |
| Recipe View | Full recipe with reviews and Add to Plan |
| Meal Planning | 7-day calendar with shopping list drawer |
| My Kitchen | Personal recipe library |
| Admin Dashboard | User management, analytics, settings |

---

## Deployment

### Frontend — Vercel
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `Front-End`
4. Add environment variable: `VITE_API_URL` = your backend URL
5. Deploy

### Backend — Render
1. Push code to GitHub
2. Create a new **Web Service** in [Render](https://render.com)
3. Set root directory to `Back-End`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all backend environment variables
7. Deploy

> ⚠️ Render free tier spins down after inactivity. First request may take 30–60 seconds to respond.

---

## Author

**Azike Simon Shinye**
BSc Software Engineering — Cardiff Metropolitan University
Supervised by: Younes El Amrani
Student ID: ST20258915
Module: CIS6003
Submission: May 2025

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ for the love of food and code</p>
