import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Details from './pages/details';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/drug/:id" element={<Details />} />
    </Routes>
  );
}
