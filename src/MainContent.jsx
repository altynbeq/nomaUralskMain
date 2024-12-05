import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { MdDescription } from 'react-icons/md';
import { Navbar, Footer } from './components';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { isValidDepartmentId } from './methods/isValidDepartmentId';
import { getDistanceFromLatLonInMeters } from './methods/getDistance';
import 'primeicons/primeicons.css';
import AlertModal from './components/AlertModal';
import { Loader } from './components/Loader';

// Ленивая загрузка страниц
const General = lazy(() => import('./pages/General'));
const Sales = lazy(() => import('./pages/Sales'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Sklad = lazy(() => import('./pages/Sklad'));
const Finance = lazy(() => import('./pages/Finance'));
const Workers = lazy(() => import('./pages/Workers'));
const LogInForm = lazy(() => import('./pages/LogInForm'));
const Calendar = lazy(() => import('./pages/Calendar'));
const AccountingWarehouse = lazy(() => import('./pages/AccountingWarehouse'));
const AccountingWorkers = lazy(() => import('./pages/AccountingWorkers'));

export const MainContent = ({ urls, activeMenu }) => {
    const { setUserImage, userImage, subUserShifts, subUser } = useStateContext();
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showMarkShiftResultModal, setShowMarkShiftResultModal] = useState(false);
    const [markShiftResultMessage, setMarkShiftResultMessage] = useState('');
    const [showGeoErrorModal, setShowGeoErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fileInput = useRef(null);

    const updateShiftScan = async (shift) => {
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/update-shift/${shift._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subUserId: shift.subUserId,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        selectedStore: shift.selectedStore._id,
                        scanTime: new Date(),
                        endScanTime: shift.endScanTime,
                    }),
                },
            );

            setShowMarkShiftResultModal(true);
            if (response.ok) {
                setMarkShiftResultMessage('Вы успешно отметили начало смены.');
            } else {
                setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
            }
        } catch {
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        }
    };

    const updateShiftEndScan = async (shift) => {
        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/shifts/update-shift/${shift._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subUserId: shift.subUserId,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        selectedStore: shift.selectedStore._id,
                        scanTime: shift.scanTime,
                        endScanTime: new Date(),
                    }),
                },
            );

            setShowMarkShiftResultModal(true);
            if (response.ok) {
                setMarkShiftResultMessage('Вы успешно отметили окончание смены.');
            } else {
                setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
            }
        } catch {
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        }
    };

    // Проверка смен при загрузке геолокации
    useEffect(() => {
        // Проверяем наличие параметра isQrRedirect в поисковых параметрах URL
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        // Если переход не по QR (параметр отсутствует или не равен true) – выходим
        if (!isQr) return;

        const today = new Date();
        const todayDateString = today.toISOString().split('T')[0];

        const todaysShifts = subUserShifts.filter((shift) => {
            const shiftStartDate = new Date(shift.startTime).toISOString().split('T')[0];
            const shiftEndDate = new Date(shift.endTime).toISOString().split('T')[0];
            const isToday = shiftStartDate <= todayDateString && shiftEndDate >= todayDateString;
            const isCurrentSubUser = shift.subUserId === subUser._id;
            return isToday && isCurrentSubUser;
        });

        if (todaysShifts.length > 0 && currentLocation) {
            todaysShifts.forEach((shift) => {
                const storeLocation = shift.selectedStore.location;
                if (storeLocation) {
                    const distance = getDistanceFromLatLonInMeters(
                        storeLocation.lat,
                        storeLocation.lng,
                        currentLocation.lat,
                        currentLocation.lng,
                    );

                    if (distance <= 50) {
                        if (!shift.scanTime) {
                            updateShiftScan(shift);
                        } else if (!shift.endScanTime) {
                            updateShiftEndScan(shift);
                        } else {
                            setShowMarkShiftResultModal(true);
                            setMarkShiftResultMessage(
                                'Вы уже отметили приход и уход для этой смены.',
                            );
                        }
                    } else {
                        setShowMarkShiftResultModal(true);
                        setMarkShiftResultMessage('Вы находитесь слишком далеко от места смены.');
                    }
                }
            });
        }
    }, [subUserShifts, subUser, currentLocation, location.search]);

    // Запрос геолокации при необходимости (через QR)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';
        if (isQr) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.error('Ошибка при получении геолокации:', error);
                        setShowGeoErrorModal(true);
                    },
                );
            } else {
                console.error('Geolocation не поддерживается этим браузером.');
                setShowGeoErrorModal(true);
            }
        }
    }, [location.pathname, location.search]);

    // Загрузка аватара
    useEffect(() => {
        const departmentId = localStorage.getItem('departmentId');
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
            } finally {
                // Завершаем загрузку после проверки изображения
                setIsLoading(false);
            }
        };

        if (isValidDepartmentId(departmentId) && !userImage) {
            fetchSubUserImage();
        } else {
            // Если уже есть userImage или департамент невалиден - считать, что загрузка завершена
            setIsLoading(false);
        }
    }, [location.pathname, setUserImage, userImage]);

    const handleModalClose = () => {
        setShowUploadImageModal(false);
    };

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

    return (
        <>
            {isLoading ? (
                // Показываем лоадер, пока идет загрузка необходимых данных
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <Loader />
                </div>
            ) : (
                // Основной контент приложения
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

                    {/* Оборачиваем маршруты в Suspense для лентяйной загрузки страниц */}
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-96">
                                <Loader />
                            </div>
                        }
                    >
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
                    </Suspense>
                    <Footer />
                </div>
            )}

            <Dialog
                visible={showUploadImageModal}
                onHide={handleModalClose}
                className="mx-auto my-4 max-w-lg w-full sm:max-w-sm"
            >
                <p className="text-center text-lg mb-4">
                    Пожалуйста, загрузите аватарку, чтобы продолжить
                </p>
                <div className="flex mt-5 p-4 sm:p-6 gap-4 flex-col items-center justify-center w-full border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <MdDescription size={32} className="text-blue-500" />
                    <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
                        <button
                            className="py-2 px-4 bg-gray-200 text-black rounded-full hover:bg-blue-600 transition-colors font-medium w-full sm:w-auto"
                            onClick={() => fileInput.current && fileInput.current.click()}
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

            {/* Модальное окно для результата отметки смены */}
            <AlertModal
                message={markShiftResultMessage}
                open={showMarkShiftResultModal}
                onClose={() => setShowMarkShiftResultModal(false)}
            />

            {/* Модальное окно для ошибки геолокации */}
            <AlertModal
                message="Для отметки смены необходимо разрешить доступ к геолокации и снова пройти по QR отметку. В противном случае смена не будет засчитана."
                open={showGeoErrorModal}
                onClose={() => setShowGeoErrorModal(false)}
            />
        </>
    );
};
