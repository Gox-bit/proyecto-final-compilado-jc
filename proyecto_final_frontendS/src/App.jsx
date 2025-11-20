import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';


import Navbar from './components/layout/Navbar';


import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GameDetailsPage from './pages/games/GameDetailsPage';


const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-9xl font-extrabold text-purple-600 opacity-50">404</h1>
    <div className="absolute mt-2">
      <p className="text-2xl font-bold text-white mb-2">Página No Encontrada</p>
      <p className="text-gray-400 mb-8">Parece que te has perdido en el mapa del juego.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/20"
      >
        Volver a la Base
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 font-sans text-gray-100">
          <Navbar />
          
          <Routes>
            {}
            <Route path="/" element={<HomePage />} />
            
            {}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {}
            {}
            <Route path="/game/:id" element={<GameDetailsPage />} />
            
            {}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
