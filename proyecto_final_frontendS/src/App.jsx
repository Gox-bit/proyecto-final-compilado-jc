import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailsPage from "./pages/games/GameDetailsPage.jsx";
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
    return (
        <Router>
            <Navbar /> {}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games/:id" element={<GameDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {}
                {}
                {}
                {}

                <Route path="*" element={<NotFoundPage />} /> {}
            </Routes>
        </Router>
    );
}

export default App;
