import React, { useState, useEffect } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [fileHistory, setFileHistory] = useState([]);
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken')); // Получаем токен из localStorage
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

    const itemsPerPage = 10; // Количество записей на одной странице

    // Загрузка истории файлов при монтировании компонента и при изменении страницы
    useEffect(() => {
        if (jwtToken) {
            fetch(`http://localhost:8080/api/file/page?page=${currentPage}&limit=${itemsPerPage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setFileHistory(data.files); // Предполагается, что данные содержат массив "files"
                    setTotalPages(data.totalPages); // Предполагается, что сервер возвращает общее количество страниц
                })
                .catch(error => {
                    console.error("Ошибка при получении истории файлов", error);
                });
        }
    }, [jwtToken, currentPage]);

    // Обработчик выбора файла
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Обработчик отправки файла
    const handleFileUpload = () => {
        if (!selectedFile) {
            alert("Пожалуйста, выберите файл для загрузки.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setUploadStatus('В процессе...');

        fetch('http://localhost:8080/api/file', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setUploadStatus('Успешно');
                // Добавляем новый файл в историю
                setFileHistory(prevHistory => [
                    ...prevHistory,
                    { id: data.id, filename: selectedFile.name, status: 'Успешно', userId: data.userId }
                ]);
            })
            .catch(error => {
                setUploadStatus('Неуспешно');
                console.error("Ошибка при отправке файла", error);
                // Добавляем новый файл с ошибкой в историю
                setFileHistory(prevHistory => [
                    ...prevHistory,
                    { id: Date.now(), filename: selectedFile.name, status: 'Неуспешно', userId: jwtToken }
                ]);
            });
    };

    // Обработчики для переключения страниц
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div>
            {/* Кнопка для открытия окна выбора файла */}
            <input
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }} // Скрываем стандартный input
                id="fileInput" // Уникальный ID для ссылки на элемент
            />
            <button onClick={() => document.getElementById('fileInput').click()}>
                Choose file
            </button>
            {selectedFile && (
                <p>Chosen file: {selectedFile.name}</p>
            )}

            <button onClick={handleFileUpload}>Upload file</button>

            {/* Статус загрузки */}
            {uploadStatus && <p>{uploadStatus}</p>}

            <h2>History</h2>
            {/* Таблица с историей файлов */}
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>File name</th>
                    <th>Status</th>
                    <th>User ID</th>
                </tr>
                </thead>
                <tbody>
                {fileHistory.map((file, index) => (
                    <tr key={file.id || index}>
                        <td>{file.id}</td>
                        <td>{file.filename}</td>
                        <td>{file.status}</td>
                        <td>{file.userId}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Пагинация */}
            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Backward
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Forward
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
