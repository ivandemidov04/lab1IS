import React, { useState } from 'react';

const MoodEnum = { SADNESS: 'SADNESS', CALM: 'CALM', FRENZY: 'FRENZY' };
const WeaponTypeEnum = { AXE: 'AXE', PISTOL: 'PISTOL', SHOTGUN: 'SHOTGUN', KNIFE: 'KNIFE' };

const HumanbeingForm = () => {
    const [name, setName] = useState('');
    const [coordinatesId, setCoordinatesId] = useState('');
    const [realHero, setRealHero] = useState(null);
    const [hasToothpick, setHasToothpick] = useState(null);
    const [carId, setCarId] = useState('');
    const [mood, setMood] = useState('');
    const [impactSpeed, setImpactSpeed] = useState('');
    const [weaponType, setWeaponType] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const handleSubmit = async () => {
        // const data = { name, coordinatesId, realHero, hasToothpick, carId, mood, impactSpeed, weaponType };
        // let coord = {}, car = {};
        // coord.id = coordinatesId
        // car.id = carId
        // const dataaa = {coordcoord.id, car.id}
        // if (!mood) {
        //     mood = MoodEnum.SADNESS
        // }
        // TODO: значение по умолчанию mood
        if (!name || !coordinatesId || !carId || !mood || !impactSpeed || !weaponType || realHero === null || hasToothpick === null) {
            setError('Все поля обязательны для заполнения');
            // console.log(data)
            return;
        }
        if (!/^\d{1,9}$/.test(coordinatesId) || coordinatesId.length > 9) {
            setError('Значение "coordinates_id" должно быть числом не более 9 знаков');
            return;
        }
        if (!/^\d{1,9}$/.test(carId) || carId.length > 9) {
            setError('Значение "car_id" должно быть числом не более 9 знаков');
            return;
        }
        if (!/^\d+(\.\d{1,6})?$/.test(impactSpeed) || parseFloat(impactSpeed) > 29.0) {
            setError('Значение "impactSpeed" должно быть числом с максимум 6 знаками после запятой и не превышать 29.0');
            return;
        }
        if (!Object.values(MoodEnum).includes(mood)) {
            setError('Выберите правильное значение для "mood"');
            return;
        }
        if (!Object.values(WeaponTypeEnum).includes(weaponType)) {
            setError('Выберите правильное значение для "weaponType"');
            return;
        }
        setError('');
        const coordId = coordinatesId
        const data = { name, coordId, realHero, hasToothpick, carId, mood, impactSpeed, weaponType };

        // Получаем токен из localStorage
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('JWT токен отсутствует. Пожалуйста, войдите в систему.');
            return;
        }

        console.log(JSON.stringify(data))
        try {
            const response = await fetch('http://localhost:8080/api/human', {
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

            alert('Данные успешно отправлены');
            setIsModalOpen(false); // Close modal after successful submission
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
            <button onClick={openModal}>Создать человека</button>

            {/* Modal structure */}
            {isModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Humanbeing Form</h3>
                        <label>
                            Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Coordinates ID:
                            <input type="text" value={coordinatesId} onChange={(e) => setCoordinatesId(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Real Hero:
                            <input type="radio" name="realHero" value="true" onChange={() => setRealHero(true)} /> Yes
                            <input type="radio" name="realHero" value="false" onChange={() => setRealHero(false)} /> No
                        </label>
                        <br />
                        <label>
                            Has Toothpick:
                            <input type="radio" name="hasToothpick" value="true" onChange={() => setHasToothpick(true)} /> Yes
                            <input type="radio" name="hasToothpick" value="false" onChange={() => setHasToothpick(false)} /> No
                        </label>
                        <br />
                        <label>
                            Car ID:
                            <input type="text" value={carId} onChange={(e) => setCarId(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Mood:
                            <select value={mood} onChange={(e) => setMood(e.target.value)}>
                                <option value={MoodEnum.SADNESS}>SADNESS</option>
                                <option value={MoodEnum.CALM}>CALM</option>
                                <option value={MoodEnum.FRENZY}>FRENZY</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Impact Speed:
                            <input type="text" value={impactSpeed} onChange={(e) => setImpactSpeed(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Weapon Type:
                            <select value={weaponType} onChange={(e) => setWeaponType(e.target.value)}>
                                <option value={WeaponTypeEnum.AXE}>AXE</option>
                                <option value={WeaponTypeEnum.PISTOL}>PISTOL</option>
                                <option value={WeaponTypeEnum.SHOTGUN}>SHOTGUN</option>
                                <option value={WeaponTypeEnum.KNIFE}>KNIFE</option>
                            </select>
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
        width: '350px',
        textAlign: 'center',
    },
};

export default HumanbeingForm;