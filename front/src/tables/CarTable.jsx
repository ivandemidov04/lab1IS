import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs'
import { Stomp } from '@stomp/stompjs';
import CarForm from '../inputs/CarForm'; // Импортируем CarForm

const CarTable = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [editingCar, setEditingCar] = useState(null); // State for editing car
    const [filteredCars, setFilteredCars] = useState([]); // Для хранения отфильтрованных автомобилей
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // Для сортировки

    const jwtToken = localStorage.getItem('jwtToken');
    useEffect(() => {
        connectWebSocket(currentPage)
    }, [currentPage])
    function connectWebSocket(currentPage) {
        const socket = new SockJS("http://localhost:8080/ws")

        socket.onopen = function () {
            console.log("WebSocket connected.");
        };
        socket.onerror = function (error) {
            console.log("WebSocket error: " + error);
        };
        socket.onclose = function () {
            console.log("WebSocket connection closed.");
        };

        let stompClient = Stomp.over(socket)

        stompClient.connect({
            // Заголовки для подключения
            Authorization: `Bearer ${jwtToken}`,  // Передаем Bearer токен
        }, function () {
            stompClient.subscribe('/topic/car', () => {
                fetchCars(currentPage)
            })
        })
    }

    const fetchCars = async (page) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/car/page?page=${page}&size=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
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

    // Функция для сортировки
    const handleSort = (column) => {
        const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key: column, direction });

        const sortedCars = [...filteredCars].sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setFilteredCars(sortedCars);
    };

    useEffect(() => {
        setFilteredCars(cars); // При изменении списка машин сбрасываем фильтрацию
    }, [cars]);

    // Функция для фильтрации по столбцу
    const handleFilterCool = (e) => {
        const filterValue = e.target.value.toLowerCase();
        const filtered = cars.filter((car) =>
            car.cool.toString().toLowerCase().includes(filterValue)
        );
        setFilteredCars(filtered);
    };

    const handleFilterUserId = (e) => {
        const filterValue = e.target.value.toLowerCase();
        const filtered = cars.filter((car) =>
            car.userId.toString().toLowerCase().includes(filterValue)
        );
        setFilteredCars(filtered);
    };

    const fetchCarDetails = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/car/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
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

    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/car/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении автомобиля');
            }

            fetchCars(currentPage);
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
            {isModalOpen && <CarForm closeModal={closeModal}/>}

            <div>
                <label>
                    Filter:
                    <input type="text" onChange={handleFilterUserId} placeholder="Filter by User ID"/>
                </label>
            </div>
            <div>
                <label>
                    Filter:
                    <input type="text" onChange={handleFilterCool} placeholder="Filter by cool"/>
                </label>
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('cool')}>Cool</th>
                        <th onClick={() => handleSort('userId')}>User ID</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCars.map((car) => (
                        <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.cool ? 'True' : 'False'}</td>
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
                                    onChange={() => setEditingCar({...editingCar, cool: true})}
                                /> Yes
                                <input
                                    type="radio"
                                    name="cool"
                                    value="false"
                                    checked={editingCar.cool === false}
                                    onChange={() => setEditingCar({...editingCar, cool: false})}
                                /> No
                            </label>
                            <br/>
                            {error && <p style={{color: 'red'}}>{error}</p>}
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
