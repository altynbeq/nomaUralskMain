import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Navbar, Footer } from './components';
import './App.css';
import 'primeicons/primeicons.css';
import AlertModal from './components/AlertModal';
import { Loader } from './components/Loader';
import { NoAccess } from './pages';
import { useAuthStore, useSubUserStore } from './store/index';
import { axiosInstance } from './api/axiosInstance';
import { DateTime } from 'luxon';

const General = lazy(() => import('./pages/General'));
const Sales = lazy(() => import('./pages/Sales'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Sklad = lazy(() => import('./pages/Sklad'));
const Finance = lazy(() => import('./pages/Finance'));
const Workers = lazy(() => import('./pages/Workers'));
const LogInForm = lazy(() => import('./pages/LogInForm'));
const Shifts = lazy(() => import('./pages/Shifts'));
const AccountingWarehouse = lazy(() => import('./pages/AccountingWarehouse'));
const AccountingWorkers = lazy(() => import('./pages/AccountingWorkers'));

export const MainContent = ({ urls, activeMenu, subUserTodayShifts }) => {
    const user = useAuthStore((state) => state.user);
    const subUser = useSubUserStore((state) => state.subUser);
    const location = useLocation();
    const navigate = useNavigate();

    const [markShiftResultMessage, setMarkShiftResultMessage] = useState('');
    const [showMarkShiftResultModal, setShowMarkShiftResultModal] = useState(false);
    const [showGeoErrorModal, setShowGeoErrorModal] = useState(false);

    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [actionText, setActionText] = useState('');

    const fileInput = useRef(null);
    const hasExecuted = useRef(false);

    const updateShiftScan = async (shift) => {
        try {
            const scanTimeUTC = DateTime.local().setZone('UTC+5').toUTC().toISO();
            await axiosInstance.put(`/shifts/${shift._id}`, {
                subUserId: shift.subUserId._id,
                startTime: shift.startTime,
                endTime: shift.endTime,
                selectedStore: shift.selectedStore._id,
                scanTime: scanTimeUTC,
                endScanTime: shift.endScanTime,
            });

            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили начало смены.');
        } catch (error) {
            console.error('Ошибка при отметке начала смены:', error);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        }
    };

    const updateShiftEndScan = async (shift) => {
        try {
            const endScanTimeUTC = DateTime.local().setZone('UTC+5').toUTC().toISO();
            await axiosInstance.put(`/shifts/${shift._id}`, {
                subUserId: shift.subUserId._id,
                startTime: shift.startTime,
                endTime: shift.endTime,
                selectedStore: shift.selectedStore._id,
                scanTime: shift.scanTime,
                endScanTime: endScanTimeUTC,
            });

            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили окончание смены.');
        } catch (error) {
            console.error('Ошибка при отметке окончания смены:', error);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        if (!isQr || hasExecuted.current) return;

        // Ищем первую неотмеченную смену
        const firstUnmarkedShift = subUserTodayShifts.find((shift) => {
            const scanTime = shift.scanTime
                ? DateTime.fromISO(shift.scanTime, { zone: 'utc' }).setZone('UTC+5')
                : null;
            const endScanTime = shift.endScanTime
                ? DateTime.fromISO(shift.endScanTime, { zone: 'utc' }).setZone('UTC+5')
                : null;

            // Условие для поиска первой неотмеченной смены
            return !scanTime || !endScanTime;
        });

        if (!firstUnmarkedShift) return;

        hasExecuted.current = true;

        const scanTime = firstUnmarkedShift.scanTime
            ? DateTime.fromISO(firstUnmarkedShift.scanTime, { zone: 'utc' }).setZone('UTC+5')
            : null;
        const endScanTime = firstUnmarkedShift.endScanTime
            ? DateTime.fromISO(firstUnmarkedShift.endScanTime, { zone: 'utc' }).setZone('UTC+5')
            : null;

        setSelectedShift(firstUnmarkedShift);

        if (!scanTime) {
            setActionText('Отметить приход');
        } else if (scanTime && !endScanTime) {
            setActionText('Отметить уход');
        } else if (scanTime && endScanTime) {
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы уже отметили приход и уход для всех смен.');
        }

        setShowActionModal(true);
    }, [user, location.search, subUserTodayShifts]);

    useEffect(() => {
        if (!showMarkShiftResultModal && markShiftResultMessage.includes('успешно')) {
            navigate('/general');
            setMarkShiftResultMessage('');
        }
    }, [showMarkShiftResultModal, markShiftResultMessage, navigate]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';
        if (isQr && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Геопозиция получена, но нам она теперь не обязательна
                },
                (error) => {
                    console.error('Ошибка при получении геолокации:', error);
                },
            );
        }
    }, [location.pathname, location.search]);

    const handleAction = () => {
        if (!selectedShift) return;

        if (!selectedShift.scanTime) {
            updateShiftScan(selectedShift);
        } else if (selectedShift.scanTime && !selectedShift.endScanTime) {
            updateShiftEndScan(selectedShift);
        }

        setShowActionModal(false);
        setSelectedShift(null);
        setActionText('');
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

                        {user?.role === 'user' ? (
                            <>
                                <Route path="/finance" element={<Finance urls={urls} />} />
                                <Route path="/sales" element={<Sales urls={urls} />} />
                                <Route path="/workers" element={<Workers urls={urls} />} />
                                <Route path="/sklad" element={<Sklad urls={urls} />} />
                                <Route path="/shifts" element={<Shifts />} />
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
                                        user?.access?.Analytics?.Finance ? (
                                            <Finance urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/sales"
                                    element={
                                        user?.access?.Analytics?.Sales ? (
                                            <Sales urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/workers"
                                    element={
                                        user?.access?.Analytics?.Workers ? (
                                            <Workers urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/sklad"
                                    element={
                                        user?.access?.Analytics?.Warehouse ? (
                                            <Sklad urls={urls} />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />

                                <Route
                                    path="/shifts"
                                    element={
                                        user?.access?.DataManagement ? <Shifts /> : <NoAccess />
                                    }
                                />
                                <Route
                                    path="/accounting-warehouse"
                                    element={
                                        user?.access?.DataManagement ? (
                                            <AccountingWarehouse />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                                <Route
                                    path="/accounting-workers"
                                    element={
                                        user?.access?.DataManagement ? (
                                            <AccountingWorkers />
                                        ) : (
                                            <NoAccess />
                                        )
                                    }
                                />
                            </>
                        )}

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

            {/* Модалка с действием (приход или уход) */}
            <Dialog
                header="Отметка смены"
                visible={showActionModal}
                onHide={() => setShowActionModal(false)}
            >
                <div className="flex flex-col items-center">
                    <p className="mb-8 font-bold">
                        {actionText === 'Отметить приход'
                            ? 'Вы хотите отметить приход для этой смены?'
                            : 'Вы хотите отметить уход для этой смены?'}
                    </p>
                    <div className="flex gap-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={handleAction}
                        >
                            {actionText}
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                            onClick={() => setShowActionModal(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </Dialog>

            <AlertModal
                message={markShiftResultMessage}
                open={showMarkShiftResultModal}
                onClose={() => {
                    setShowMarkShiftResultModal(false);
                    if (markShiftResultMessage.includes('успешно')) {
                        navigate('/general');
                    }
                }}
            />

            <AlertModal
                message="Для отметки смены необходимо разрешить доступ к геолокации."
                open={showGeoErrorModal}
                onClose={() => setShowGeoErrorModal(false)}
            />
        </>
    );
};
