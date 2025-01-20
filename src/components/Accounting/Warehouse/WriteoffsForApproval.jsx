import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp, FaExclamationTriangle } from 'react-icons/fa';

// PrimeReact компоненты
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useAuthStore, useCompanyStore } from '../../../store/index';
import { axiosInstance } from '../../../api/axiosInstance';
import { formatSlashDate } from '../../../methods/dataFormatter';
import { addLocale } from 'primereact/api';
import { toast } from 'react-toastify';

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
    today: 'Сегодня',
    clear: 'Очистить',
});

function getStatusBadge(status) {
    switch (status) {
        case 'pending':
            return 'Ожидание';
        case 'approved':
            return 'Подтверждено';
        case 'declined':
        case 'rejected':
            return 'Отклонено';
        default:
            return 'Неизвестно';
    }
}

const WriteoffsForApproval = () => {
    const [isLoading, setIsLoading] = useState(false);
    const clientId = useAuthStore((state) => state.user.companyId);
    const warehouses = useCompanyStore((state) => state.warehouses);

    const [writeOffs, setWriteOffs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Поля для поиска и фильтрации
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [warehouseOptions, setWarehouseOptions] = useState([]);
    // Сворачивание/разворачивание панели с фильтрами
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Для debounce

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms задержка

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    // Подсчет «в ожидании» (pending)
    const pendingCount = 5;

    useEffect(() => {
        if (!warehouses || !warehouses.length) return;
        setWarehouseOptions(warehouses.map((wh) => wh.name));
    }, [warehouses]);

    useEffect(() => {
        if (!clientId) return;

        const fetchWriteOffs = async () => {
            setIsLoading(true);
            try {
                // Собираем query-параметры
                const params = new URLSearchParams();
                params.set('status', 'pending'); // Фильтрация по статусу

                // Фильтрация по диапазону дат
                if (dateRange && dateRange.length > 0) {
                    // Если выбрана только одна дата, используем её для начала и конца диапазона
                    const startDate = new Date(dateRange[0]).toISOString();
                    const endDate =
                        dateRange.length === 2 ? new Date(dateRange[1]).toISOString() : startDate; // Если второй даты нет, используем первую

                    params.set('dateRange', JSON.stringify([startDate, endDate]));
                }

                // Фильтр по складу
                if (selectedWarehouse) {
                    params.set('warehouseName', selectedWarehouse);
                }

                // Фильтр поиска
                if (debouncedSearchTerm) {
                    params.set('search', debouncedSearchTerm.trim());
                }

                // Выполняем запрос
                const response = await axiosInstance.get(
                    `/writeOff/${clientId}?${params.toString()}`,
                );
                setWriteOffs(response.data);
            } catch (error) {
                console.error('Ошибка при получении списаний:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWriteOffs();
    }, [clientId, debouncedSearchTerm, selectedWarehouse, dateRange]);

    const openModalWithSubmission = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setIsModalOpen(false);
    };

    // 1) Статус
    const statusBodyTemplate = (rowData) => {
        return (
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-800">
                {getStatusBadge(rowData.status)}
            </span>
        );
    };

    // 2) Подробности (кнопка, открывающая диалог)
    const detailsBodyTemplate = (rowData) => {
        return (
            <Button
                label="Просмотреть"
                icon="pi pi-search"
                className="p-button-text p-button-sm text-blue-700"
                onClick={() => openModalWithSubmission(rowData)}
            />
        );
    };

    // 3) Дата (форматируем)
    const dateBodyTemplate = (rowData) => {
        if (!rowData.createdAt) return '';
        return formatSlashDate(rowData.createdAt);
    };

    const updateStatus = async (submissionId, newStatus) => {
        try {
            setIsLoading(true);

            await axiosInstance.put(`/writeOff/${clientId}/status/${submissionId}`, {
                status: newStatus,
            });

            setWriteOffs((prevWriteOffs) =>
                prevWriteOffs.map((item) =>
                    item.id === submissionId ? { ...item, status: newStatus } : item,
                ),
            );
            toast.success('Вы успешно обновили статус товара');
            closeModal();
        } catch (error) {
            toast.error('Не удалось обновить статус товара');
            console.error('Ошибка при обновлении статуса:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onApprove = () => {
        if (!selectedSubmission) return;
        updateStatus(selectedSubmission.id, 'approved');
    };

    const onDecline = () => {
        if (!selectedSubmission) return;
        updateStatus(selectedSubmission.id, 'declined');
    };

    return (
        <div className="w-full bg-white subtle-border ">
            {/* Заголовок и блок фильтрации */}
            <div className="border-b flex flex-row justify-between border-gray-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-gray-900">Заявки на списание</h3>
                        {pendingCount > 0 && (
                            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                <FaExclamationTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                <span className="text-sm text-yellow-800">
                                    {pendingCount} в ожидании
                                </span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            {/* Поиск */}
                            <div className="flex-1 min-w-[200px] relative">
                                <InputText
                                    placeholder="Поиск..."
                                    className="pl-2 border-blue-500 border-2 rounded-md min-h-[44px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Дата */}
                            <div className="relative">
                                <Calendar
                                    showIcon
                                    locale="ru"
                                    selectionMode="range"
                                    placeholder="Выберите дату"
                                    type="date"
                                    className="pl-2 min-h-[44px] border-blue-500 border-2 rounded-md"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target)}
                                />
                            </div>

                            <div className="min-w-[200px]">
                                <Dropdown
                                    value={selectedWarehouse}
                                    options={warehouseOptions}
                                    showClear
                                    onChange={(e) => setSelectedWarehouse(e.value)}
                                    optionLabel="name"
                                    placeholder="Выберите склад"
                                    className="w-full border-blue-500 border-2 rounded-md text-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="mr-4 cursor-pointer text-2xl flex items-center"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </div>
            </div>

            {/* DataTable из PrimeReact */}
            {!isCollapsed && (
                <div className="p-4">
                    <DataTable
                        value={writeOffs}
                        loading={isLoading}
                        paginator
                        rows={10}
                        removableSort
                        sortMode="single"
                        className="w-full"
                        emptyMessage="Нет данных для отображения"
                        onRowClick={(e) => openModalWithSubmission(e.data)}
                    >
                        <Column field="id" header="Номер заявки" style={{ minWidth: '160px' }} />
                        <Column
                            header="Склад"
                            field="warehouse.name"
                            style={{ minWidth: '160px' }}
                        />
                        <Column
                            header="Запросил"
                            body={(rowData) =>
                                rowData.user?.name + '\n' + rowData.user?.email ?? '—'
                            }
                            style={{ minWidth: '180px' }}
                        />
                        <Column
                            header="Дата"
                            body={dateBodyTemplate}
                            style={{ minWidth: '120px' }}
                        />
                        <Column
                            header="Статус"
                            body={statusBodyTemplate}
                            style={{ minWidth: '120px' }}
                        />
                        <Column
                            header="Подробности"
                            body={detailsBodyTemplate}
                            style={{ minWidth: '150px' }}
                        />
                    </DataTable>
                </div>
            )}

            {/* Диалоговое окно для просмотра/подтверждения/отклонения */}
            <Dialog visible={isModalOpen} onHide={closeModal} header="Подробности заявки" modal>
                {selectedSubmission && (
                    <div className="space-y-6">
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>
                                <span className="font-medium text-gray-900">Склад:</span>{' '}
                                {selectedSubmission?.warehouse?.name ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Номер заявки:</span>{' '}
                                {selectedSubmission.id}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Статус:</span>{' '}
                                {getStatusBadge(selectedSubmission.status)}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Причина:</span>{' '}
                                {selectedSubmission.reason ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Кол-во:</span>{' '}
                                {selectedSubmission.requestedAmount ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Дата:</span>{' '}
                                {formatSlashDate(selectedSubmission.createdAt)}
                            </p>
                        </div>

                        {/* Можно отобразить дополнительные поля, если необходимо */}
                        <div className="space-y-2 text-sm text-gray-700">
                            <h4 className="font-semibold">Товар:</h4>
                            <p>
                                <span className="font-medium text-gray-900">Наименование:</span>{' '}
                                {selectedSubmission?.product?.name ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Цена:</span>{' '}
                                {selectedSubmission?.product?.price ?? '—'}
                            </p>
                            <img
                                src={`https://nomalytica-back.onrender.com${selectedSubmission.imagePath}`}
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                            <Button
                                label="Отклонить"
                                className="bg-black text-white  p-2"
                                onClick={onDecline}
                                disabled={isLoading}
                            />
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 p-2"
                                label="Подтвердить"
                                onClick={onApprove}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default WriteoffsForApproval;
