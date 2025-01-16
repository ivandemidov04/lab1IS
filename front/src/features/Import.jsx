import { useState } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const jwtToken = localStorage.getItem('jwtToken') // Получаем токен из localStorage

    // Обработчик выбора файла
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Обработчик отправки файла
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Пожалуйста, выберите файл для загрузки.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        let status = null

        try {
            const response = await fetch('http://localhost:8080/api/file/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: formData,
            })

            status = await response.json()
            console.log("!!! ", status)
        } catch (error) {
            console.error('Ошибка при отправке файла', error);
            status = false
            console.log("??? ", status)
        }

        try {
            const response2 = await fetch(`http://localhost:8080/api/file?filename=${selectedFile.name}&status=${status}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data2 = await response2.json();
            console.log("importDTO: ", data2)
        } catch (error) {
            console.error('Ошибка при отправке22222:', error);
        }

        setSelectedFile(null);
        document.getElementById('fileInput').value = '';

        console.log("file was sended")
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
        </div>
    );
};

export default FileUpload;
