import React, { useEffect, useState } from 'react';

const MoodEnum = { SADNESS: 'SADNESS', CALM: 'CALM', FRENZY: 'FRENZY' };
const WeaponTypeEnum = { AXE: 'AXE', PISTOL: 'PISTOL', SHOTGUN: 'SHOTGUN', KNIFE: 'KNIFE' };

const HumanbeingTable = () => {
    const [humanbeings, setHumanbeings] = useState([]); // Для хранения списка
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingHuman, setEditingHuman] = useState(null); // Для редактирования

    // Функция для загрузки данных с бэкенда
    const fetchHumanbeings = async (page) => {
        setLoading(true);
        const jwtToken = localStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8080/api/human/page?page=${page}&size=10`, {
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
            setHumanbeings(data.content); // Данные возвращаются в свойстве content
            setTotalPages(data.totalPages); // Общее количество страниц
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при изменении страницы
    useEffect(() => {
        fetchHumanbeings(currentPage);
    }, [currentPage]);

    // Функция для получения данных для редактирования
    const fetchHumanDetails = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/human/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить информацию о человеке');
            }

            const human = await response.json();
            setEditingHuman(human);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    // Функция для отправки изменений на сервер
    const handleEditSubmit = async () => {
        // editingHuman.coordId = editingHuman.coord.id
        // editingHuman.carId = editingHuman.car.id
        if (!editingHuman || !editingHuman.name || !editingHuman.coordId || !editingHuman.carId) {
            setError('Все поля обязательны для заполнения');
            console.log(editingHuman)
            return;
        }

        setError('');
        const jwtToken = localStorage.getItem('jwtToken');

        // console.log(JSON.stringify(editingHuman.name))
        const data = {}
        data.name = editingHuman.name
        data.coordId = editingHuman.coordId
        data.realHero = editingHuman.realHero
        data.hasToothpick = editingHuman.hasToothpick
        data.carId = editingHuman.carId
        data.mood = editingHuman.mood
        data.impactSpeed = editingHuman.impactSpeed
        data.weaponType = editingHuman.weaponType
        console.log(JSON.stringify(data))

        try {
            const response = await fetch(`http://localhost:8080/api/human/${editingHuman.id}`, {
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

            setEditingHuman(null); // Закрыть форму редактирования
            fetchHumanbeings(currentPage); // Обновить список
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для удаления
    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/human/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }

            fetchHumanbeings(currentPage); // Обновить список после удаления
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
            {/*<h2>Список Humanbeing</h2>*/}

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Coordinates ID</th>
                        <th>realHero</th>
                        <th>hasToothpick</th>
                        <th>Car ID</th>
                        <th>Mood</th>
                        <th>impactSpeed</th>
                        <th>weaponType</th>
                        <th>User ID</th>
                        <th>Редактировать</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {humanbeings.map((human) => (
                        <tr key={human.id}>
                            <td>{human.id}</td>
                            <td>{human.name}</td>
                            <td>{human.coord.id}</td>
                            <td>{human.realHero ? 'Да' : 'Нет'}</td>
                            <td>{human.hasToothpick ? 'Да' : 'Нет'}</td>
                            <td>{human.car.id}</td>
                            <td>{human.mood}</td>
                            <td>{human.impactSpeed}</td>
                            <td>{human.weaponType}</td>
                            <td>{human.user.id}</td>
                            <td>
                                <button onClick={() => fetchHumanDetails(human.id)}>Редактировать</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(human.id)}>Удалить</button>
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
            {editingHuman && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Редактирование Humanbeing</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={editingHuman.name}
                                    onChange={(e) => setEditingHuman({...editingHuman, name: e.target.value})}
                                />
                            </label>
                            <br/>
                            <label>
                                Coordinates ID:
                                <input
                                    type="text"
                                    value={editingHuman.coordId}
                                    onChange={(e) => setEditingHuman({...editingHuman, coordId: e.target.value})}
                                />
                            </label>
                            <br/>
                            <label>
                                realHero:
                                <input
                                    type="radio"
                                    name="realHero"
                                    value="true"
                                    checked={editingHuman.realHero === true}
                                    onChange={() => setEditingHuman({...editingHuman, realHero: true})}
                                /> Да
                                <input
                                    type="radio"
                                    name="realHero"
                                    value="false"
                                    checked={editingHuman.realHero === false}
                                    onChange={() => setEditingHuman({...editingHuman, realHero: false})}
                                /> Нет
                            </label>
                            <br/>
                            <label>
                                hasToothpick:
                                <input
                                    type="radio"
                                    name="hasToothpick"
                                    value="true"
                                    checked={editingHuman.hasToothpick === true}
                                    onChange={() => setEditingHuman({...editingHuman, hasToothpick: true})}
                                /> Да
                                <input
                                    type="radio"
                                    name="hasToothpick"
                                    value="false"
                                    checked={editingHuman.hasToothpick === false}
                                    onChange={() => setEditingHuman({...editingHuman, hasToothpick: false})}
                                /> Нет
                            </label>
                            <br/>
                            <label>
                                Car ID:
                                <input
                                    type="text"
                                    value={editingHuman.carId}
                                    onChange={(e) => setEditingHuman({...editingHuman, carId: e.target.value})}

                                />
                            </label>
                            <br/>
                            {/*<label>*/}
                            {/*    Mood:*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        value={editingHuman.mood}*/}
                            {/*        onChange={(e) => setEditingHuman({...editingHuman, mood: e.target.value})}*/}
                            {/*    />*/}
                            {/*</label>*/}
                            {/*<br/>*/}
                            <label>
                                Mood:
                                <select value={editingHuman.mood} onChange={(e) => setEditingHuman({...editingHuman, mood: e.target.value})}>
                                    <option value={MoodEnum.SADNESS}>SADNESS</option>
                                    <option value={MoodEnum.CALM}>CALM</option>
                                    <option value={MoodEnum.FRENZY}>FRENZY</option>
                                </select>
                            </label>
                            <br/>
                            <label>
                                impactSpeed:
                                <input
                                    type="text"
                                    value={editingHuman.impactSpeed}
                                    onChange={(e) => setEditingHuman({...editingHuman, impactSpeed: e.target.value})}
                                />
                            </label>
                            <br/>
                            {/*<label>*/}
                            {/*    weaponType:*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        value={editingHuman.weaponType}*/}
                            {/*        onChange={(e) => setEditingHuman({...editingHuman, weaponType: e.target.value})}*/}
                            {/*    />*/}
                            {/*</label>*/}
                            {/*<br/>*/}
                            <label>
                                Weapon Type:
                                <select value={editingHuman.weaponType} onChange={(e) => setEditingHuman({
                                    ...editingHuman,
                                    weaponType: e.target.value
                                })}>
                                    <option value={WeaponTypeEnum.AXE}>AXE</option>
                                    <option value={WeaponTypeEnum.PISTOL}>PISTOL</option>
                                    <option value={WeaponTypeEnum.SHOTGUN}>SHOTGUN</option>
                                    <option value={WeaponTypeEnum.KNIFE}>KNIFE</option>
                                </select>
                            </label>
                            <br/>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            <button type="button" onClick={handleEditSubmit}>
                                Сохранить изменения
                            </button>
                            <button type="button" onClick={() => setEditingHuman(null)}>
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

export default HumanbeingTable;