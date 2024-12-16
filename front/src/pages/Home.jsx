import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CarForm from '../inputs/CarForm';
import CoordinatesForm from '../inputs/CoordinatesForm';
import HumanbeingForm from '../inputs/HumanbeingForm';
import CarTable from "../tables/CarTable";
import CoordinatesTable from "../tables/CoordinatesTable";
import HumanbeingTable from "../tables/HumanbeingTable";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || 'Guest';
    const token = localStorage.getItem('jwtToken');

    // Проверяем роль из JWT токена
    const getRoleFromToken = () => {
        if (!token) return null;
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Расшифровываем токен
        return decodedToken?.role || null;  // Возвращаем роль
    };

    const role = getRoleFromToken();

    // Логика выхода
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/auth/sign-in');
    };

    // Логика становления админом
    const handleBecomeAdmin = async () => {
        // console.log(role)

        if (role !== 'ROLE_USER') {
            alert('Только пользователь с ролью "User" может стать администратором.');
            return;
        }

        try {
            await fetch('http://localhost:8080/api/admin-panel/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            alert('Ошибка при отправке запроса.');
        }
    };

    // Логика перехода на панель админа
    const handleGoToAdminPanel = () => {
        if (role !== 'ROLE_ADMIN') {
            alert('Только пользователь с ролью "Admin" может перейти в панель администратора.');
            return;
        }
        navigate('/home/admin-panel');  // Переход на панель админа в том же окне
    };

    return (
        <div>
            {/* Хедер */}
            <header>
                <div>
                    <span>Добро пожаловать, {username}!</span>
                </div>
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleBecomeAdmin}>Стать администратором</button>
                    <button onClick={handleGoToAdminPanel}>Перейти в панель админа</button>
                </div>
            </header>

            <h2>Список Car</h2>
            <CarForm/>
            <CarTable/>

            <h2>Список Coordinates</h2>
            <CoordinatesForm/>
            <CoordinatesTable/>

            <h2>Список Humanbeing</h2>
            <HumanbeingForm/>
            <HumanbeingTable/>
        </div>
    );
}

export default Home;
