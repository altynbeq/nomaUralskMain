import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { MdDescription } from 'react-icons/md';
import { Navbar, Footer } from './components';
import { General, Sales, ComingSoon, Sklad, Finance, Workers, LogInForm, Calendar } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import AccountingWarehouse from './pages/AccountingWarehouse';
import AccountingWorkers from './pages/AccountingWorkers';
import { isValidDepartmentId } from './methods/isValidDepartmentId';
import 'primeicons/primeicons.css';

export const MainContent = ({ urls, activeMenu }) => {
    const { setUserImage, userImage } = useStateContext();
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const location = useLocation();
    const [QRLocation, setQRLocation] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';
        if (isQr) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setQRLocation({ lat: latitude, lng: longitude });
                        console.log(
                            `Текущая локация: Latitude: ${latitude}, Longitude: ${longitude}`,
                        );
                        // Здесь вы можете выполнить дополнительные действия, например, отправить координаты на сервер
                    },
                    (error) => {
                        console.error('Ошибка при получении геолокации:', error);
                        // Обработка ошибок, например, показать уведомление пользователю
                    },
                );
            } else {
                console.error('Geolocation не поддерживается этим браузером.');
                // Обработка случая, когда геолокация не поддерживается
            }
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        const departmentId = localStorage.getItem('departmentId');
        if (isValidDepartmentId(departmentId) && !userImage) {
            const subuserId = localStorage.getItem('_id');
            const fetchSubUserImage = async () => {
                try {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/subusers/byId/${subuserId}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (!result.image) {
                        setShowUploadImageModal(true);
                    } else {
                        setUserImage(result.image);
                    }
                } catch (error) {
                    console.error('Error fetching sub-user data:', error);
                }
            };
            fetchSubUserImage();
        }
    }, [location.pathname, setUserImage, userImage]);

    const handleModalClose = () => {
        setShowUploadImageModal(false);
    };

    const fileInput = React.useRef(null);

    const handleFileUpload = async (event) => {
        const userId = localStorage.getItem('_id');
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                setIsUploading(true);
                const response = await fetch(
                    `https://nomalytica-back.onrender.com/api/subusers/subusers/${userId}/avatar`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to upload avatar');
                }
                const result = await response.json();
                setUserImage(result.image);
                setShowUploadImageModal(false);
            } catch (error) {
                console.error('Error uploading avatar:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUploadButtonClick = () => {
        fileInput.current.click();
    };

    return (
        <>
            <div
                className={
                    activeMenu
                        ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                        : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
                }
            >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                    <Navbar />
                </div>

                <div>
                    <Routes>
                        <Route path="/" element={<General urls={urls} />} />
                        <Route path="/general" element={<General urls={urls} />} />
                        <Route path="/finance" element={<Finance urls={urls} />} />
                        <Route path="/sales" element={<Sales urls={urls} />} />
                        <Route path="/workers" element={<Workers urls={urls} />} />
                        <Route path="/sklad" element={<Sklad urls={urls} />} />
                        <Route path="/docs" element={<ComingSoon />} />
                        <Route path="/resources" element={<ComingSoon />} />
                        <Route path="/support" element={<ComingSoon />} />
                        <Route path="/Q&A" element={<ComingSoon />} />
                        <Route path="/login" element={<LogInForm />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/accounting-warehouse" element={<AccountingWarehouse />} />
                        <Route path="/accounting-workers" element={<AccountingWorkers />} />
                    </Routes>
                </div>
                <Footer />
            </div>

            <Dialog
                visible={showUploadImageModal}
                onHide={handleModalClose}
                style={{ width: '25vw' }}
            >
                <p className="text-center text-lg">
                    Пожалуйста загрузите аватарку чтобы продолжить
                </p>
                <div className="flex mt-5 p-8 gap-4 flex-col items-center justify-center w-full border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <MdDescription size={32} className="text-blue-500" />
                    <div className="flex gap-3 justify-center">
                        <button
                            className="py-2 px-3 bg-gray-200 text-black rounded-full hover:bg-blue-600 transition-colors font-medium"
                            onClick={handleUploadButtonClick}
                        >
                            Загрузить аватар
                        </button>
                        <input
                            type="file"
                            ref={fileInput}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*"
                        />
                    </div>
                    {isUploading && <p className="text-gray-500 text-sm mt-2">Загрузка...</p>}
                </div>
            </Dialog>
        </>
    );
};
