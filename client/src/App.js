// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/homePage';
import DummyPage from '../src/pages/dummyPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/dummy' element={<DummyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
