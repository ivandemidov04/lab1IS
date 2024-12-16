import React, {useEffect, useState} from 'react';

const CoordinatesTable = () => {
    const [coordinates, setCoordinates] = useState([]); // Для хранения списка координат
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCoordinate, setEditingCoordinate] = useState(null); // Для редактирования координат

    // Функция для загрузки данных с бэкенда
    const fetchCoordinates = async (page) => {
        setLoading(true);
        const jwtToken = localStorage.getItem('jwtToken'); // Получаем JWT из localStorage

        try {
            const response = await fetch(`http://localhost:8080/api/coord/page?page=${page}&size=10`, {
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
            setCoordinates(data.content); // координаты возвращаются в свойстве content
            setTotalPages(data.totalPages); // totalPages возвращаются в свойстве totalPages
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при изменении страницы
    useEffect(() => {
        fetchCoordinates(currentPage);
    }, [currentPage]);

    // Функция для получения данных координаты для редактирования
    const fetchCoordinateDetails = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/coord/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить информацию о координате');
            }

            const coordinate = await response.json();
            setEditingCoordinate(coordinate);
        } catch (error) {
            console.error('Ошибка при загрузке данных координаты:', error);
        }
    };

    // Функция для отправки изменений на сервер
    const handleEditSubmit = async () => {
        if (!editingCoordinate || editingCoordinate.x === null || editingCoordinate.y === null) {
            setError('Поле "x" и "y" обязательно');
            return;
        }
        setError('');

        const data = { x: editingCoordinate.x, y: editingCoordinate.y };

        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/coord/${editingCoordinate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных на сервер');
            }

            setEditingCoordinate(null); // Закрыть форму редактирования
            fetchCoordinates(currentPage); // Обновить список координат
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для удаления координаты
    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/coord/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении координаты');
            }

            fetchCoordinates(currentPage); // Обновить список координат после удаления
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
            {/*<h2>Список координат</h2>*/}

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>User ID</th>
                        <th>Редактировать</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coordinates.map((coord) => (
                        <tr key={coord.id}>
                            <td>{coord.id}</td>
                            <td>{coord.x}</td>
                            <td>{coord.y}</td>
                            <td>{coord.user.id}</td>
                            <td>
                                <button onClick={() => fetchCoordinateDetails(coord.id)}>Редактировать</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(coord.id)}>Удалить</button>
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

            {/* Модальное окно для редактирования координат */}
            {editingCoordinate && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Редактирование координат</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                X:
                                <input
                                    type="text"
                                    value={editingCoordinate.x}
                                    onChange={(e) => setEditingCoordinate({ ...editingCoordinate, x: e.target.value })}
                                />
                            </label>
                            <br />
                            <label>
                                Y:
                                <input
                                    type="text"
                                    value={editingCoordinate.y}
                                    onChange={(e) => setEditingCoordinate({ ...editingCoordinate, y: e.target.value })}
                                />
                            </label>
                            <br />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="button" onClick={handleEditSubmit}>
                                Сохранить изменения
                            </button>
                            <button type="button" onClick={() => setEditingCoordinate(null)}>
                                Отменить
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Стили для модального окна
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        textAlign: 'center',
    },
};

export default CoordinatesTable;
