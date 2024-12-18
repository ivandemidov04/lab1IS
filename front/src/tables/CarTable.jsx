import React, { useEffect, useState } from 'react';
import CarForm from '../inputs/CarForm'; // Импортируем CarForm

const CarTable = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [editingCar, setEditingCar] = useState(null); // State for editing car
    const [error, setError] = useState('');

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
            setCars(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars(currentPage);
    }, [currentPage]);

    // Fetch car details for editing
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
            setEditingCar(car); // Set car data to editing state
        } catch (error) {
            console.error('Ошибка при загрузке данных автомобиля:', error);
        }
    };

    // Submit edited car details
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

            setEditingCar(null); // Close edit mode
            fetchCars(currentPage); // Refresh the car list
        } catch (error) {
            alert(error.message);
        }
    };

    // Delete car
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

            fetchCars(currentPage); // Refresh the car list after deletion
        } catch (error) {
            alert(error.message);
        }
    };

    // Pagination controls
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={openModal}>Create car</button>

            {/* Create car modal */}
            {isModalOpen && <CarForm setCars={setCars} closeModal={closeModal} />}

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cool</th>
                        <th>User ID</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cars.map((car) => (
                        <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.cool ? 'Yes' : 'No'}</td>
                            <td>{car.userId}</td>
                            <td>
                                <button onClick={() => fetchCarDetails(car.id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(car.id)}>Delete</button>
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

            {/* Edit modal */}
            {editingCar && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Edit Car</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                Cool:
                                <input
                                    type="radio"
                                    name="cool"
                                    value="true"
                                    checked={editingCar.cool === true}
                                    onChange={() => setEditingCar({ ...editingCar, cool: true })}
                                /> Yes
                                <input
                                    type="radio"
                                    name="cool"
                                    value="false"
                                    checked={editingCar.cool === false}
                                    onChange={() => setEditingCar({ ...editingCar, cool: false })}
                                /> No
                            </label>
                            <br />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="button" onClick={handleEditSubmit}>
                                Save changes
                            </button>
                            <button type="button" onClick={() => setEditingCar(null)}>
                                Cancel
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
