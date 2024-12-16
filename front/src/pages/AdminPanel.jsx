import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [adminData, setAdminData] = useState(null);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin-panel/joins', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAdminData(data);
                } else {
                    alert('Ошибка при получении данных панели администратора');
                }
            } catch (error) {
                alert('Ошибка при отправке запроса');
            }
        };

        if (token) {
            fetchAdminData();
        }
    }, [token]);

    return (
        <div>
            <h3>Панель администратора</h3>
            {adminData ? (
                <div>
                    <pre>{JSON.stringify(adminData, null, 2)}</pre>
                </div>
            ) : (
                <p>Загрузка данных...</p>
            )}
        </div>
    );
};

export default AdminPanel;
