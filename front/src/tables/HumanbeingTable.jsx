import { useEffect, useState } from 'react';
import HumanbeingForm from "../inputs/HumanbeingForm";
import Feature from "../features/Feature.jsx";
import SockJS from 'sockjs-client/dist/sockjs'
import { Stomp } from '@stomp/stompjs';

const MoodEnum = { SADNESS: 'SADNESS', CALM: 'CALM', FRENZY: 'FRENZY' };
const WeaponTypeEnum = { AXE: 'AXE', PISTOL: 'PISTOL', SHOTGUN: 'SHOTGUN', KNIFE: 'KNIFE' };

const HumanbeingTable = () => {
    const [humanbeings, setHumanbeings] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [editingHuman, setEditingHuman] = useState(null);
    const [filteredHumanbeings, setFilteredHumanbeings] = useState([]); // Для хранения отфильтрованных автомобилей
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // Для сортировки

    const jwtToken = localStorage.getItem('jwtToken');
    useEffect(() => {
        connectWebSocket(currentPage)
    }, [currentPage])
    function connectWebSocket(currentPage) {
        const socket = new SockJS("http://localhost:8080/ws")

        let stompClient = Stomp.over(socket)

        stompClient.connect({
            // Заголовки для подключения
            Authorization: `Bearer ${jwtToken}`,  // Передаем Bearer токен
        }, function () {
            stompClient.subscribe('/topic/human', () => {
                fetchHumanbeings(currentPage)
            })
        })
    }

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
            setHumanbeings(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHumanbeings(currentPage);
    }, [currentPage]);

    // Функция для сортировки
    const handleSort = (column) => {
        const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key: column, direction });

        const sortedHumanbeings = [...filteredHumanbeings].sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setFilteredHumanbeings(sortedHumanbeings);
    };

    useEffect(() => {
        setFilteredHumanbeings(humanbeings); // При изменении списка машин сбрасываем фильтрацию
    }, [humanbeings]);

    // Функция для фильтрации по столбцу
    const handleFilterName = (e) => {
        const filterValue = e.target.value.toLowerCase();
        const filtered = humanbeings.filter((humanbeing) =>
            humanbeing.name.toString().toLowerCase().includes(filterValue)
        );
        setFilteredHumanbeings(filtered);
    };

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

    const handleEditSubmit = async () => {
        if (!editingHuman.name || !editingHuman.coordId || !editingHuman.carId || !editingHuman.mood
            || !editingHuman.impactSpeed || !editingHuman.weaponType || editingHuman.realHero === null
            || editingHuman.hasToothpick === null) {
            setError('Все поля обязательны для заполнения');
            return;
        }
        if (!/^\d{1,9}$/.test(editingHuman.coordId) || editingHuman.coordId.length > 9) {
            setError('Значение "coord_id" должно быть числом не более 9 знаков');
            return;
        }
        if (!/^\d{1,9}$/.test(editingHuman.carId) || editingHuman.carId.length > 9) {
            setError('Значение "car_id" должно быть числом не более 9 знаков');
            return;
        }
        if (!/^\d+(\.\d{1,6})?$/.test(editingHuman.impactSpeed) || parseFloat(editingHuman.impactSpeed) > 29.0) {
            setError('Значение "impactSpeed" должно быть числом с максимум 6 знаками после запятой и не превышать 29.0');
            return;
        }
        if (!Object.values(MoodEnum).includes(editingHuman.mood)) {
            setError('Выберите правильное значение для "mood"');
            return;
        }
        if (!Object.values(WeaponTypeEnum).includes(editingHuman.weaponType)) {
            setError('Выберите правильное значение для "weaponType"');
            return;
        }

        setError('');
        const jwtToken = localStorage.getItem('jwtToken');

        const data = {}
        data.name = editingHuman.name
        data.coordId = editingHuman.coordId
        data.realHero = editingHuman.realHero
        data.hasToothpick = editingHuman.hasToothpick
        data.carId = editingHuman.carId
        data.mood = editingHuman.mood
        data.impactSpeed = editingHuman.impactSpeed
        data.weaponType = editingHuman.weaponType

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
            setError(error.message);
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={openModal}>Create human</button>
            {isModalOpen && <HumanbeingForm setHumanbeings={setHumanbeings} closeModal={closeModal}/>}

            <div>
                <label>
                    Filter:
                    <input type="text" onChange={handleFilterName} placeholder="Filter by name"/>
                </label>
            </div>
            {/*<div>*/}
            {/*    <label>*/}
            {/*        Filter:*/}
            {/*        <input type="text" onChange={handleFilterCool} placeholder="Filter by cool"/>*/}
            {/*    </label>*/}
            {/*</div>*/}

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('coordId')}>Coordinates ID</th>
                        <th onClick={() => handleSort('realHero')}>realHero</th>
                        <th onClick={() => handleSort('hasToothpick')}>hasToothpick</th>
                        <th onClick={() => handleSort('carId')}>Car ID</th>
                        <th onClick={() => handleSort('mood')}>Mood</th>
                        <th onClick={() => handleSort('impactSpeed')}>impactSpeed</th>
                        <th onClick={() => handleSort('weaponType')}>weaponType</th>
                        <th onClick={() => handleSort('userId')}>User ID</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredHumanbeings.map((human) => (
                        <tr key={human.id}>
                            <td>{human.id}</td>
                            <td>{human.name}</td>
                            <td>{human.coordId}</td>
                            <td>{human.realHero ? 'Yes' : 'No'}</td>
                            <td>{human.hasToothpick ? 'Yes' : 'No'}</td>
                            <td>{human.carId}</td>
                            <td>{human.mood}</td>
                            <td>{human.impactSpeed}</td>
                            <td>{human.weaponType}</td>
                            <td>{human.userId}</td>
                            <td>
                                <button onClick={() => fetchHumanDetails(human.id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(human.id)}>Delete</button>
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

            {editingHuman && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Edit Humanbeing</h3>
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
                                    type="number"
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
                                /> Yes
                                <input
                                    type="radio"
                                    name="realHero"
                                    value="false"
                                    checked={editingHuman.realHero === false}
                                    onChange={() => setEditingHuman({...editingHuman, realHero: false})}
                                /> No
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
                                /> Yes
                                <input
                                    type="radio"
                                    name="hasToothpick"
                                    value="false"
                                    checked={editingHuman.hasToothpick === false}
                                    onChange={() => setEditingHuman({...editingHuman, hasToothpick: false})}
                                /> No
                            </label>
                            <br/>
                            <label>
                                Car ID:
                                <input
                                    type="number"
                                    value={editingHuman.carId}
                                    onChange={(e) => setEditingHuman({...editingHuman, carId: e.target.value})}
                                />
                            </label>
                            <br/>
                            <label>
                                Mood:
                                <select value={editingHuman.mood}
                                        onChange={(e) => setEditingHuman({...editingHuman, mood: e.target.value})}>
                                    <option value={MoodEnum.SADNESS}>SADNESS</option>
                                    <option value={MoodEnum.CALM}>CALM</option>
                                    <option value={MoodEnum.FRENZY}>FRENZY</option>
                                </select>
                            </label>
                            <br/>
                            <label>
                                impactSpeed:
                                <input
                                    type="number"
                                    value={editingHuman.impactSpeed}
                                    onChange={(e) => setEditingHuman({...editingHuman, impactSpeed: e.target.value})}
                                />
                            </label>
                            <br/>
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
                                Save changes
                            </button>
                            <button type="button" onClick={() => setEditingHuman(null)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <h2>Features</h2>
            <Feature fetchHumanbeings={fetchHumanbeings} currentPage={currentPage}/>
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
