import { useNavigate, useLocation } from 'react-router-dom';
import CarTable from "../tables/CarTable";
import CoordinatesTable from "../tables/CoordinatesTable";
import HumanbeingTable from "../tables/HumanbeingTable";
import Import from "../features/Import.jsx";
import ImportTable from "../tables/ImportTable.jsx";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || 'Guest';
    const token = localStorage.getItem('jwtToken');

    const getRoleFromToken = () => {
        if (!token) return null;
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Расшифровываем токен
        return decodedToken?.role || null;  // Возвращаем роль
    };

    const role = getRoleFromToken();

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/auth/sign-in');
    };

    const handleBecomeAdmin = async () => {

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

    const handleGoToAdminPanel = () => {
        if (role !== 'ROLE_ADMIN') {
            alert('Только пользователь с ролью "Admin" может перейти в панель администратора.');
            return;
        }
        navigate('/home/admin-panel');
    };

    return (
        <div>
            {/* Хедер */}
            <header>
                <div>
                    <span>Welcome, {username}!</span>
                </div>
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleBecomeAdmin}>Become an admin</button>
                    <button onClick={handleGoToAdminPanel}>Go to admin panel</button>
                </div>
            </header>

            <h2>Uploading file</h2>
            <Import/>

            <h2>Imports</h2>
            <ImportTable/>

            <h2>Cars</h2>
            <CarTable/>

            <h2>Coordinates</h2>
            <CoordinatesTable/>

            <h2>Humanbeings</h2>
            <HumanbeingTable/>
        </div>
    );
}

export default Home;
