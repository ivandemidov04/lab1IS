import React, { useState } from 'react';

const FeatureComponent = () => {
    const [selectedWeaponType, setSelectedWeaponType] = useState('AXE');
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getJwtToken = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('JWT токен отсутствует. Пожалуйста, войдите в систему.');
            return null;
        }
        return token;
    };

    const handleApiResponse = async (url, method, body = null) => {
        const token = getJwtToken();
        if (!token) return;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Ошибка при выполнении запроса');
            }
            const data = await response.json();
            setModalContent(JSON.stringify(data, null, 2));
            setIsModalOpen(true);
        } catch (error) {
            if (method === 'GET') {
                alert(error.message);
            }
        }
    };

    const handleGroupByName = () => {
        handleApiResponse('http://localhost:8080/api/feature/group-by-name', 'GET');
    };

    const handleGetEqualWeaponType = () => {
        handleApiResponse(
            `http://localhost:8080/api/feature/get-equal-weapon-type?weaponType=${selectedWeaponType}`,
            'GET'
        );
    };

    const handleUniqueImpactSpeed = () => {
        handleApiResponse('http://localhost:8080/api/feature/unique-impact-speed', 'GET');
    };

    const handleDeleteNoToothpicks = () => {
        handleApiResponse('http://localhost:8080/api/feature/delete-no-toothpicks', 'DELETE');
    };

    const handleMakeAllSad = () => {
        handleApiResponse('http://localhost:8080/api/feature/make-all-sad', 'PUT');
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div>
                <button onClick={handleGroupByName}>Group By Name</button>
                <button onClick={handleGetEqualWeaponType}>Equal Weapon Type</button>
                <select
                    value={selectedWeaponType}
                    onChange={(e) => setSelectedWeaponType(e.target.value)}
                >
                    <option value="AXE">AXE</option>
                    <option value="PISTOL">PISTOL</option>
                    <option value="SHOTGUN">SHOTGUN</option>
                    <option value="KNIFE">KNIFE</option>
                </select>
                <button onClick={handleUniqueImpactSpeed}>Unique Impact Speed</button>
                <button onClick={handleDeleteNoToothpicks}>No Toothpicks</button>
                <button onClick={handleMakeAllSad}>Make All Sad</button>
            </div>

            {/* Modal structure */}
            {isModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.container}>
                        <h3>Response</h3>
                        <pre>{modalContent}</pre>
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
        width: '400px',
        textAlign: 'center',
        overflowY: 'auto',
    },
};

export default FeatureComponent;
