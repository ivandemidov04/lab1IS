import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [adminData, setAdminData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/admin-panel/joins?page=${currentPage}&size=10`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAdminData(data.content); // данные идут в content
                    setTotalPages(data.totalPages); // количество страниц
                } else {
                    alert('Ошибка при получении данных');
                }
            } catch (error) {
                alert('Ошибка при отправке запроса');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAdminData();
        }
    }, [token, currentPage]);

    const handleAccept = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin-panel/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                fetchAdminData(); // Обновить данные после принятия
            } else {
                alert('Ошибка при принятии');
            }
        } catch (error) {
            alert('Ошибка при отправке запроса');
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin-panel/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                fetchAdminData(); // Обновить данные после отказа
            } else {
                alert('Ошибка при отказе');
            }
        } catch (error) {
            alert('Ошибка при отправке запроса');
        }
    };

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
            <h3>Панель администратора</h3>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Принять</th>
                        <th>Отказать</th>
                    </tr>
                    </thead>
                    <tbody>
                    {adminData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.userId}</td>
                            <td>
                                <button onClick={() => handleAccept(item.id)}>Принять</button>
                            </td>
                            <td>
                                <button onClick={() => handleReject(item.id)}>Отказать</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div>
                <button onClick={handlePrev} disabled={currentPage === 0}>
                    Назад
                </button>
                <span>
                    Страница {currentPage + 1} из {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
                    Вперёд
                </button>
            </div>
        </div>
    );
};

// export default AdminPanel;
