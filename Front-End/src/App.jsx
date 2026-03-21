import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./index.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RecipePage from "./pages/RecipePage/RecipePage";
import About from "./pages/About/About";
import RecipeVideo from "./components/VideoPage/RecipeVideo";
import Contact from "./pages/Contacts/Contact";
import AdminLogin from "./components/AdminScreen/AdminLong";
import AdminDashboard from "./components/AdminDashBoard/dashboard";
import PrivateRoute from './components/PrivateRoute';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import MyRecipes from './pages/MyRecipes/MyRecipes';
import RecipeView from './pages/RecipeView/RecipeView';
import MealPlanning from "./pages/MealPlanning/MealPlanning"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"


const App = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4caf50',
            },
          },
          error: {
            style: {
              background: '#f44336',
            },
          },
        }}
      />


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<EmailVerification />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recipe-video" element={<RecipeVideo />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
        <Route path="/meal-planning" element={<MealPlanning />} />
        <Route path="/my-recipes" element={<MyRecipes />} />

</Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<Outlet />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="recipe" element={<RecipePage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
