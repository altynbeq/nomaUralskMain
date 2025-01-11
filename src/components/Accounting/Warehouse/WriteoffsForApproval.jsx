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

    // Подсчет «в ожидании» (pending)
    const pendingCount = writeOffs.filter((w) => w.status === 'pending').length;

    useEffect(() => {
        if (!warehouses || !warehouses.length) return;
        setWarehouseOptions(
            warehouses.map((wh) => ({
                warehouseName: wh.warehouseName,
                id: wh.id,
            })),
        );
    }, [warehouses]);

    // Подгружаем списания
    useEffect(() => {
        if (!clientId) return;

        const fetchWriteOffs = async () => {
            setIsLoading(true);
            try {
                // Собираем query-параметры
                const params = new URLSearchParams();
                // Всегда хотим статус "pending" (можно изменить по логике)
                params.set('status', 'pending');
                if (searchTerm) {
                    params.set('search', searchTerm);
                }
                if (dateRange) {
                    params.set('date', dateRange);
                }
                if (selectedWarehouse) {
                    params.set('warehouseName', selectedWarehouse);
                }

                const response = await axiosInstance.get(
                    `/clientsSpisanie/${clientId}?${params.toString()}`,
                );
                setWriteOffs(response.data);
            } catch (error) {
                console.error('Ошибка при получении списаний:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWriteOffs();
    }, [clientId, searchTerm, selectedWarehouse, dateRange]);

    const openModalWithSubmission = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSubmission(null);
        setIsModalOpen(false);
    };

    const onApprove = () => {
        // Логика подтверждения (PUT/PATCH на сервер или что-то ещё)
        console.log('Approved:', selectedSubmission);
        closeModal();
    };

    const onDecline = () => {
        // Логика отклонения (PUT/PATCH на сервер или что-то ещё)
        console.log('Declined:', selectedSubmission);
        closeModal();
    };

    // Рендер колонок DataTable:

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
        if (!rowData.date) return '';
        return formatSlashDate(rowData.date);
    };

    return (
        <div className="w-full bg-white subtle-border ">
            {/* Заголовок и блок фильтрации */}
            <div className="border-b flex flex-row justify-between border-gray-200">
                <div className="p-4">
                    <div className="flex items-center space-x-3">
                        <h3>Заявки на списание</h3>
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
                                    selectionMode="range"
                                    placeholder="Выберите дату"
                                    type="date"
                                    className="pl-2 min-h-[44px] border-blue-500 border-2 rounded-md"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                />
                            </div>

                            <div className="min-w-[200px]">
                                <Dropdown
                                    value={selectedWarehouse}
                                    options={warehouseOptions}
                                    onChange={(e) => setSelectedWarehouse(e.value)}
                                    optionLabel="warehouseName"
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
                        rowsPerPageOptions={[5, 10, 20]}
                        removableSort
                        sortMode="single"
                        className="w-full"
                        emptyMessage="Нет данных для отображения"
                        onRowClick={(e) => openModalWithSubmission(e.data)}
                    >
                        <Column field="_id" header="Номер заявки" style={{ minWidth: '160px' }} />
                        <Column
                            header="Склад"
                            field="warehouse.warehouseName"
                            style={{ minWidth: '160px' }}
                        />
                        <Column
                            header="Запросил"
                            body={(rowData) => rowData.responsible?.name ?? '—'}
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
                                {selectedSubmission?.warehouse?.warehouseName ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">ID:</span>{' '}
                                {selectedSubmission._id}
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
                                {selectedSubmission.quantity ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Дата:</span>{' '}
                                {new Date(selectedSubmission.date).toLocaleString()}
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
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                            <Button
                                label="Отклонить"
                                className="p-button-outlined p-button-danger"
                                onClick={onDecline}
                            />
                            <Button label="Подтвердить" onClick={onApprove} />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default WriteoffsForApproval;
