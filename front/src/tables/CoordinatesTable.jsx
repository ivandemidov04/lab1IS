import React, { useEffect, useState } from 'react';
import CoordinatesForm from '../inputs/CoordinatesForm'; // Импортируем компонент формы

const CoordinatesTable = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCoordinate, setEditingCoordinate] = useState(null);

    const fetchCoordinates = async (page) => {
        setLoading(true);
        const jwtToken = localStorage.getItem('jwtToken');

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
            setCoordinates(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoordinates(currentPage);
    }, [currentPage]);

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

            setEditingCoordinate(null);
            fetchCoordinates(currentPage);
        } catch (error) {
            alert(error.message);
        }
    };

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

            fetchCoordinates(currentPage);
        } catch (error) {
            alert(error.message);
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

    const handleCoordinateCreated = (newCoordinate) => {
        setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);
    };

    return (
        <div>
            <CoordinatesForm onCoordinateCreated={handleCoordinateCreated} /> {/* Pass the callback to the form */}

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
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coordinates.map((coord) => (
                        <tr key={coord.id}>
                            <td>{coord.id}</td>
                            <td>{coord.x}</td>
                            <td>{coord.y}</td>
                            <td>{coord.userId}</td>
                            <td>
                                <button onClick={() => fetchCoordinateDetails(coord.id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(coord.id)}>Delete</button>
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

            {/* Модальное окно для редактирования координат */}
            {editingCoordinate && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Edit Coordinates</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                X:
                                <input
                                    type="number"
                                    value={editingCoordinate.x}
                                    onChange={(e) => setEditingCoordinate({ ...editingCoordinate, x: e.target.value })}
                                />
                            </label>
                            <br />
                            <label>
                                Y:
                                <input
                                    type="number"
                                    value={editingCoordinate.y}
                                    onChange={(e) => setEditingCoordinate({ ...editingCoordinate, y: e.target.value })}
                                />
                            </label>
                            <br />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="button" onClick={handleEditSubmit}>
                                Save changes
                            </button>
                            <button type="button" onClick={() => setEditingCoordinate(null)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

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
