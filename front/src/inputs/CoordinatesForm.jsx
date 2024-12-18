import React, { useState } from 'react';

const CoordinatesForm = ({ setCoordinates, closeModal }) => {
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [error, setError] = useState('');

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

            setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);

            closeModal();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
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
    );
};

export default CoordinatesForm;
