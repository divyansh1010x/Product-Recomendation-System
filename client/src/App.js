// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/homePage';
import DummyPage from '../src/pages/dummyPage';
import LoginPage from '../src/pages/loginPage';
import SignupPage from '../src/pages/signupPage';
import SearchPage from '../src/pages/searchPage';
import CartPage from '../src/pages/cartPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path='/dummy' element={<DummyPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
