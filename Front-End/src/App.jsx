import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./index.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RecipePage from "./pages/RecipePage/RecipePage";
import About from "./pages/About/About";
import RecipeVideo from "./components/VideoPage/RecipeVideo";
import Contact from "./pages/Contacts/Contact";
import AdminLogin from "./components/AdminScreen/AdminLong";
import AdminDashboard from "./components/AdminDashBoard/dashboard";
import PrivateRoute from './components/PrivateRoute';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import MyRecipes from './pages/MyRecipes/MyRecipes';

const App = () => {
  return (  
    <div className="app">
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
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/recipe-video" element={<RecipeVideo />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/recipes" element={<RecipePage />} />
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
