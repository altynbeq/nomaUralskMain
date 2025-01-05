import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Navbar, Footer } from './components';
import AlertModal from './components/AlertModal';
import { Loader } from './components/Loader';
import { NoAccess } from './pages';
import { useAuthStore } from './store/index';
import { axiosInstance } from './api/axiosInstance';
import { DateTime } from 'luxon';
import { formatDate, formatOnlyTimeDate } from './methods/dataFormatter';

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
const AccountingExpenses = lazy(() => import('./pages/AccountingExpenses'));

export const MainContent = ({ urls, activeMenu, subUserTodayShifts }) => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    const [markShiftResultMessage, setMarkShiftResultMessage] = useState('');
    const [showMarkShiftResultModal, setShowMarkShiftResultModal] = useState(false);
    const [showGeoErrorModal, setShowGeoErrorModal] = useState(false);

    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateShiftScan = async (shift) => {
        setIsLoading(true);
        try {
            const scanTimeUTC = DateTime.local().setZone('UTC+5').toUTC().toISO();
            await axiosInstance.put(`/shifts/update-scan-time/${shift._id}`, {
                scanTime: scanTimeUTC,
            });
            navigate('/general');
            setShowActionModal(false);
            setSelectedShift(null);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили начало смены.');
        } catch (error) {
            console.error('Ошибка при отметке начала смены:', error);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateShiftEndScan = async (shift) => {
        setIsLoading(true);
        try {
            const endScanTimeUTC = DateTime.local().setZone('UTC+5').toUTC().toISO();
            await axiosInstance.put(`/shifts/update-end-scan-time/${shift._id}`, {
                endScanTime: endScanTimeUTC,
            });
            navigate('/general');
            setShowActionModal(false);
            setSelectedShift(null);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Вы успешно отметили окончание смены.');
        } catch (error) {
            console.error('Ошибка при отметке окончания смены:', error);
            setShowMarkShiftResultModal(true);
            setMarkShiftResultMessage('Не удалось отметить смену. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        if (!isQr || user.role === 'user') return;

        const firstUnmarkedShift = subUserTodayShifts.find((shift) => {
            const scanTime = shift.scanTime
                ? DateTime.fromISO(shift.scanTime, { zone: 'utc' }).setZone('UTC+5')
                : null;
            const endScanTime = shift.endScanTime
                ? DateTime.fromISO(shift.endScanTime, { zone: 'utc' }).setZone('UTC+5')
                : null;

            return !scanTime || !endScanTime;
        });

        if (!firstUnmarkedShift) return;

        setSelectedShift(firstUnmarkedShift);

        setShowActionModal(true);
    }, [user, location.search, subUserTodayShifts]);

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

    const handleAction = (type) => {
        if (!selectedShift) return;

        if (type === 'checkIn') {
            updateShiftScan(selectedShift);
        } else if (type === 'checkOut') {
            updateShiftEndScan(selectedShift);
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
                                <Route
                                    path="/accounting-expenses"
                                    element={<AccountingExpenses />}
                                />
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
                                <Route
                                    path="/accounting-expenses"
                                    element={
                                        user?.access?.DataManagement ? (
                                            <AccountingExpenses />
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
                    <p>
                        Смена на{' '}
                        <span className="font-bold text-lg">
                            {formatDate(selectedShift?.startTime)}
                        </span>
                    </p>
                    <div className="flex gap-2 mt-2">
                        <p>
                            Начало:{' '}
                            <span className="font-bold text-lg">
                                {formatDate(selectedShift?.startTime)}
                            </span>
                        </p>
                        <p>
                            Конец:{' '}
                            <span className="font-bold text-lg">
                                {formatDate(selectedShift?.endTime)}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <p>
                            Приход:{' '}
                            <span className="font-bold text-lg">
                                {selectedShift?.scanTime
                                    ? formatOnlyTimeDate(selectedShift?.scanTime)
                                    : 'Отсутствует'}
                            </span>
                        </p>
                        <p>
                            Уход:{' '}
                            <span className="font-bold text-lg">
                                {selectedShift?.endScanTime
                                    ? formatOnlyTimeDate(selectedShift?.endScanTime)
                                    : 'Отсутствует'}
                            </span>
                        </p>
                    </div>
                    <p className="mt-2">
                        Магазин{' '}
                        <span className="font-bold text-lg">
                            {selectedShift?.selectedStore?.storeName}
                        </span>
                    </p>
                    <div className="flex gap-6">
                        <Button
                            onClick={() => handleAction('checkIn')}
                            disabled={selectedShift?.scanTime || isLoading}
                            label="Начать смену"
                            className="bg-blue-500 text-white  rounded-2xl p-2 px-3  mt-10 min-w-[175px]"
                        />
                        <Button
                            onClick={() => handleAction('checkOut')}
                            disabled={selectedShift?.endScanTime || isLoading}
                            label="Закончить смену"
                            className="bg-blue-500 text-white  rounded-2xl p-2 px-3  mt-10 min-w-[175px]"
                        />
                    </div>
                </div>
            </Dialog>

            <AlertModal
                message={markShiftResultMessage}
                open={showMarkShiftResultModal}
                onClose={() => {
                    setShowMarkShiftResultModal(false);
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
