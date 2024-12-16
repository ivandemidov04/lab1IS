import React, { useState } from 'react';

const CarForm = () => {
    const [cool, setCool] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

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

            setIsModalOpen(false); // Close the modal on success
        } catch (error) {
            alert(error.message);
        }
    };

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={openModal}>Create car</button>

            {/* Modal structure */}
            {isModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
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
                        <button type="button" onClick={closeModal}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles for modal
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

export default CarForm;
