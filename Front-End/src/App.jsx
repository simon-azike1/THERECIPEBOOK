import React, { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
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
import ScrollToTop from "./components/ScrollToTop";
import SurveyPopup from "./components/SurveyPopup/SurveyPopup";
import useSurveyTrigger from "./hooks/useSurveyTrigger";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import AdminRegister from "./components/AdminScreen/AdminRegister";



const App = () => {
  useSurveyTrigger();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
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

      <SurveyPopup />

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
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
       

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
      
      <ScrollToTop />
    </div>
  );
};

export default App;
