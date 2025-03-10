import React from 'react';
import './index.css';
import Home from './pages/Home/Home';
import {Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RecipePage from './pages/RecipePage/RecipePage';
import About from './pages/About/About';
import MealPlanning from './pages/MealPlanning/MealPlanning';
import RecipeVideo from './components/VideoPage/RecipeVideo'
import Contact from './pages/Contacts/Contact';
import AdminLogin from './components/AdminScreen/AdminLong';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/recipe' element={<RecipePage />} />
        <Route path='/about' element={<About />} />
        <Route path='/meal-planning' element={<MealPlanning />} />
        <Route path='/RecipeVideo' element={<RecipeVideo />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/AdminLogin' element={<AdminLogin />} />
      
      </Routes>
    </div>
  );
};

export default App;
