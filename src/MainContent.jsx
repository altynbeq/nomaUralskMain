import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { MdDescription } from 'react-icons/md';
import { Navbar, Footer } from './components';
import './App.css';
import { getDistanceFromLatLonInMeters } from './methods/getDistance';
import 'primeicons/primeicons.css';
import AlertModal from './components/AlertModal';
import { Loader } from './components/Loader';
import { NoAccess } from './pages';
import { useAuthStore, useCompanyStructureStore, useSubUserStore } from './store/index';
import { axiosInstance } from './api/axiosInstance';
import { useStateContext } from './contexts/ContextProvider';

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
    const { access } = useStateContext();
    const stores = useCompanyStructureStore((state) => state.stores);
    const subUserShifts = useSubUserStore((state) => state.shifts);
    const subUser = useSubUserStore((state) => state.subUser);
    const user = useAuthStore((state) => state.user);
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showMarkShiftResultModal, setShowMarkShiftResultModal] = useState(false);
    const [markShiftResultMessage, setMarkShiftResultMessage] = useState('');
    const [showGeoErrorModal, setShowGeoErrorModal] = useState(false);
    const fileInput = useRef(null);
    const hasExecuted = useRef(false);

    const updateShiftScan = async (shift) => {
        try {
            await axiosInstance.put(`/shifts/update-shift/${shift._id}`, {
                subUserId: shift.subUserId,
                startTime: shift.startTime,
                endTime: shift.endTime,
                selectedStore: shift.selectedStore._id,
                scanTime: new Date(),
                endScanTime: shift.endScanTime,
            });

            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили начало смены.');
        } catch {
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        }
    };

    const updateShiftEndScan = async (shift) => {
        try {
            await axiosInstance.put(`/shifts/update-shift/${shift._id}`, {
                subUserId: shift.subUserId,
                startTime: shift.startTime,
                endTime: shift.endTime,
                selectedStore: shift.selectedStore._id,
                scanTime: shift.scanTime,
                endScanTime: new Date(),
            });

            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили окончание смены.');
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

        if (todaysShifts.length > 0 && currentLocation && stores?.length > 0) {
            todaysShifts.forEach((shift) => {
                let isWithinAnyStore = false;
                let matchedStoreId = null;

                // Проверяем расстояние до всех магазинов
                stores.forEach((store) => {
                    const storeLocation = store.location;
                    if (storeLocation) {
                        const distance = getDistanceFromLatLonInMeters(
                            storeLocation.lat,
                            storeLocation.lng,
                            currentLocation.lat,
                            currentLocation.lng,
                        );

                        if (distance <= 50) {
                            isWithinAnyStore = true;
                            matchedStoreId = store._id;
                        }
                    }
                });

                if (isWithinAnyStore && matchedStoreId) {
                    if (hasExecuted.current) {
                        return; // Если уже выполнилось, выходим
                    }
                    hasExecuted.current = true; // Устанавливаем флаг
                    // Проверяем, была ли уже отметка
                    if (!shift.scanTime) {
                        updateShiftScan(shift, matchedStoreId);
                    } else if (!shift.endScanTime) {
                        updateShiftEndScan(shift, matchedStoreId);
                    } else {
                        setShowMarkShiftResultModal(true);
                        setMarkShiftResultMessage('Вы уже отметили приход и уход для этой смены.');
                    }
                } else {
                    setShowMarkShiftResultModal(true);
                    setMarkShiftResultMessage('Вы находитесь слишком далеко от любого магазина.');
                }
            });
        }
    }, [subUserShifts, subUser, currentLocation, stores, location.search]);

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

    useEffect(() => {
        if (subUser && !subUser.image) {
            setShowUploadImageModal(true);
        }
    }, [subUser]);

    const handleModalClose = () => {
        setShowUploadImageModal(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            setIsUploading(true);
            try {
                await axiosInstance.post(`/subusers/subusers/${subUser.id}/avatar`, {
                    formData,
                });
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
                        {/* Общие роуты */}
                        <Route path="/" element={<General urls={urls} />} />
                        <Route path="/general" element={<General urls={urls} />} />

                        {/* DataManagement роуты с проверкой доступа */}

                        {user?.role === 'user' ? (
                            <>
                                <Route path="/finance" element={<Finance urls={urls} />} />
                                <Route path="/sales" element={<Sales urls={urls} />} />
                                <Route path="/workers" element={<Workers urls={urls} />} />
                                <Route path="/sklad" element={<Sklad urls={urls} />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route
                                    path="/accounting-warehouse"
                                    element={<AccountingWarehouse />}
                                />
                                <Route path="/accounting-workers" element={<AccountingWorkers />} />
                            </>
                        ) : (
                            <>
                                <Route
                                    path="/finance"
                                    element={
                                        access?.Analytics?.Finance ? (
                                            <Finance urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/sales"
                                    element={
                                        access?.Analytics?.Sales ? (
                                            <Sales urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/workers"
                                    element={
                                        access?.Analytics?.Workers ? (
                                            <Workers urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/sklad"
                                    element={
                                        access?.Analytics?.Warehouse ? (
                                            <Sklad urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />

                                <Route
                                    path="/calendar"
                                    element={access?.DataManagement ? <Calendar /> : <NoAccess />}
                                />
                                <Route
                                    path="/accounting-warehouse"
                                    element={
                                        access?.DataManagement ? (
                                            <AccountingWarehouse />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/accounting-workers"
                                    element={
                                        access?.DataManagement ? (
                                            <AccountingWorkers />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                            </>
                        )}

                        {/* Прочие роуты */}
                        <Route path="/docs" element={<ComingSoon />} />
                        <Route path="/resources" element={<ComingSoon />} />
                        <Route path="/support" element={<ComingSoon />} />
                        <Route path="/Q&A" element={<ComingSoon />} />
                        <Route path="/login" element={<LogInForm />} />
                        <Route path="/no-access" element={<NoAccess />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>

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
