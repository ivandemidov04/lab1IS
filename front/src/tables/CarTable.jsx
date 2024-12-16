import React, { useEffect, useState } from 'react';

const CarTable = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editingCar, setEditingCar] = useState(null); // Для хранения данных редактируемого автомобиля
    const [error, setError] = useState('');

    // Функция для загрузки данных с бэкенда
    const fetchCars = async (page) => {
        setLoading(true);
        const jwtToken = localStorage.getItem('jwtToken'); // Получаем JWT из localStorage

        try {
            const response = await fetch(`http://localhost:8080/api/car/page?page=${page}&size=10`, {
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
            console.log(data)
            setCars(data.content); // cars возвращаются в свойстве content
            setTotalPages(data.totalPages); // totalPages возвращаются в свойстве totalPages
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при изменении страницы
    useEffect(() => {
        fetchCars(currentPage);
    }, [currentPage]);

    // Функция для получения данных автомобиля для редактирования
    const fetchCarDetails = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/car/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить информацию об автомобиле');
            }

            const car = await response.json();
            setEditingCar(car);
        } catch (error) {
            console.error('Ошибка при загрузке данных автомобиля:', error);
        }
    };

    // Функция для отправки изменений на сервер
    const handleEditSubmit = async () => {
        if (editingCar === null || editingCar.cool === null) {
            setError('Поле "cool" обязательно');
            return;
        }
        setError('');
        const data = { cool: editingCar.cool };

        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/car/${editingCar.id}`, {
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

            setEditingCar(null); // Закрыть форму редактирования
            fetchCars(currentPage); // Обновить список автомобилей
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для удаления автомобиля
    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/car/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении автомобиля');
            }

            fetchCars(currentPage); // Обновить список автомобилей после удаления
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
                        <th>Cool</th>
                        <th>User ID</th>
                        <th>Редактировать</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cars.map((car) => (
                        <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.cool ? 'Да' : 'Нет'}</td>
                            <td>{car.userId}</td>
                            <td>
                                <button onClick={() => fetchCarDetails(car.id)}>Редактировать</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(car.id)}>Удалить</button>
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

            {/* Модальное окно для редактирования */}
            {editingCar && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Редактирование автомобиля</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                Cool:
                                <input
                                    type="radio"
                                    name="cool"
                                    value="true"
                                    checked={editingCar.cool === true}
                                    onChange={() => setEditingCar({ ...editingCar, cool: true })}
                                /> Да
                                <input
                                    type="radio"
                                    name="cool"
                                    value="false"
                                    checked={editingCar.cool === false}
                                    onChange={() => setEditingCar({ ...editingCar, cool: false })}
                                /> Нет
                            </label>
                            <br />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="button" onClick={handleEditSubmit}>
                                Сохранить изменения
                            </button>
                            <button type="button" onClick={() => setEditingCar(null)}>
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

export default CarTable;
