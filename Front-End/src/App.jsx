import React from 'react';
import './index.css';
import Home from './pages/Home/Home';
import {Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RecipePage from './pages/RecipePage/RecipePage';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/recipe' element={<RecipePage />} />
      </Routes>
    </div>
  );
};

export default App;
