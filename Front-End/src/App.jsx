import React from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RecipePage from "./pages/RecipePage/RecipePage";
import About from "./pages/About/About";
import MealPlanning from "./pages/MealPlanning/MealPlanning";
import RecipeVideo from "./components/VideoPage/RecipeVideo";
import Contact from "./pages/Contacts/Contact";
import AdminLogin from "./components/AdminScreen/AdminLong";
import AdminDashboard from "./components/AdminDashBoard/Dashboard";

const App = () => {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/meal-planning" element={<MealPlanning />} />
        <Route path="/RecipeVideo" element={<RecipeVideo />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* Nested Admin Dashboard Routes */}
        <Route path="/AdminDashboard" element={<AdminDashboard />}>
          <Route path="recipe" element={<RecipePage />} />
          {/* Add more nested routes inside AdminDashboard */}
          {/* Example: <Route path="metrics" element={<Metrics />} /> */}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
