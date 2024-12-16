import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);  // Здесь мы будем хранить пользователей
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // Функция для загрузки данных с бэкенда
    const fetchUsers = async (page) => {
        setLoading(true);
        const jwtToken = localStorage.getItem('jwtToken'); // Получаем JWT из localStorage

        try {
            const response = await fetch(`http://localhost:8080/api/admin-panel/page?page=${page}&size=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const data = await response.json();
            setUsers(data.content);  // users возвращаются в свойстве content
            setTotalPages(data.totalPages);  // totalPages возвращаются в свойстве totalPages
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при изменении страницы
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Функция для принятия пользователя (PUT запрос)
    const handleAccept = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin-panel/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при принятии пользователя');
            }

            fetchUsers(currentPage);  // Обновляем список пользователей после принятия
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для отклонения пользователя (DELETE запрос)
    const handleReject = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin-panel/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при отклонении пользователя');
            }

            fetchUsers(currentPage);  // Обновляем список пользователей после отклонения
        } catch (error) {
            alert(error.message);
        }
    };

    // Обработчики для переключения страниц
    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Accept</th>
                        <th>Reject</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.userId}</td>
                            <td>
                                <button onClick={() => handleAccept(user.id)}>Accept</button>
                            </td>
                            <td>
                                <button onClick={() => handleReject(user.id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div>
                <button onClick={handlePrev} disabled={currentPage === 0}>
                    Backward
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
                    Forward
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
