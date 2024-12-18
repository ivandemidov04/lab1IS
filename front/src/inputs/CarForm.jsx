import React, { useState } from 'react';

const CarForm = ({ setCars, closeModal }) => {
    const [cool, setCool] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (cool === null) {
            setError('Поле "cool" обязательно');
            return;
        }
        setError('');
        const data = { cool };

        // Получаем токен из localStorage
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('JWT токен отсутствует. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/car', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Добавляем токен в заголовки
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных на сервер');
            }

            const newCar = await response.json();  // Получаем данные нового автомобиля

            // Обновляем список автомобилей в родительском компоненте
            setCars((prevCars) => [...prevCars, newCar]);

            // Закрываем модальное окно
            closeModal();

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h3>Car Form</h3>
            <label>
                Cool:
                <input type="radio" name="cool" value="true" onChange={() => setCool(true)} /> Yes
                <input type="radio" name="cool" value="false" onChange={() => setCool(false)} /> No
            </label>
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
};

export default CarForm;
