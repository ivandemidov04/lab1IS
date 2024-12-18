import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminPanel from "./pages/AdminPanel.jsx";

function App() {
    return (
        <Router>
            <div>
                {/* Маршруты */}
                <Routes>
                    <Route path="/auth/sign-in" element={<Login />} />
                    <Route path="/auth/sign-up" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/home/admin-panel" element={<AdminPanel />} />  {/* Новый маршрут */}
                    <Route path="/" element={<Login />} /> {/* Страница по умолчанию */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
