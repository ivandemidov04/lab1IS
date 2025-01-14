import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs'
import { Stomp } from '@stomp/stompjs';

const ImportTable = () => {
    const [imports, setImports] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

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
            stompClient.subscribe('/topic/import', () => {
                fetchImports(currentPage)
            })
        })
    }

    const fetchImports = async (page) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/file/page?page=${page}&size=10`, {
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
            setImports(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImports(currentPage);
    }, [currentPage]);

    const handleDownload = async () => {
        console.log("DOWNLOAD")
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

    return (
        <div>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>User ID</th>
                        <th>Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    {imports.map((importt) => (
                        <tr key={importt.id}>
                            <td>{importt.id}</td>
                            <td>{importt.name}</td>
                            <td>{importt.status ? 'Success' : 'Failed'}</td>
                            <td>{importt.userId}</td>
                            <td>
                                <button onClick={() => handleDownload()}>Download</button>
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
        </div>
    );
};

export default ImportTable;
