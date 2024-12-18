import React, { useState } from 'react';

const CoordinatesForm = ({ onCoordinateCreated }) => {
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        if (!x || !y) {
            setError('Поля "x" и "y" не могут быть пустыми');
            return;
        }
        if (!/^-?\d+(\.\d{1,6})?$/.test(x) || x.length > 12) {
            setError('Значение "x" должно быть числом с максимум 6 знаками после запятой');
            return;
        }
        if (!/^\d{1,9}$/.test(y)) {
            setError('Значение "y" должно быть числом не более 9 знаков');
            return;
        }
        setError('');
        const data = { x, y };

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('JWT токен отсутствует. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/coord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных на сервер');
            }

            const newCoordinate = await response.json();
            onCoordinateCreated(newCoordinate);

            setIsModalOpen(false);
            setX('');
            setY('');
        } catch (error) {
            alert(error.message);
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
            <button onClick={openModal}>Create coordinates</button>

            {/* Modal structure */}
            {isModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Coordinates Form</h3>
                        <label>
                            X:
                            <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Y:
                            <input type="number" value={y} onChange={(e) => setY(e.target.value)} />
                        </label>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button type="button" onClick={closeModal}>
                            Close
                        </button>
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

export default CoordinatesForm;
