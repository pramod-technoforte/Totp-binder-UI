import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import QRCodePage from './pages/QRcode';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={process.env.PUBLIC_URL + "/"} element={<Home />} />
        <Route path={process.env.PUBLIC_URL + "/qrcode"} element={<QRCodePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
