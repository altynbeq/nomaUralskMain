import React, { useState } from 'react';
import {
    FaTruck,
    FaClipboardList,
    FaBoxOpen,
    FaRegWindowClose,
    FaSearch,
    FaCalendarAlt,
    FaSlidersH,
} from 'react-icons/fa';

// Mock data for demonstration
const mockHistory = {
    transfers: [
        {
            id: 1,
            date: '2024-03-19',
            from: 'Warehouse A',
            to: 'Warehouse B',
            items: ['Laptop', 'Monitor'],
            quantity: [2, 3],
            operator: 'John Doe',
        },
        {
            id: 2,
            date: '2024-03-18',
            from: 'Warehouse C',
            to: 'Warehouse A',
            items: ['Keyboard'],
            quantity: [5],
            operator: 'Jane Smith',
        },
    ],
    revisions: [
        {
            id: 1,
            date: '2024-03-19',
            warehouse: 'Warehouse A',
            itemsChecked: 150,
            discrepancies: 3,
            operator: 'Mike Johnson',
        },
        {
            id: 2,
            date: '2024-03-17',
            warehouse: 'Warehouse B',
            itemsChecked: 200,
            discrepancies: 0,
            operator: 'Sarah Wilson',
        },
    ],
    arrivals: [
        {
            id: 1,
            date: '2024-03-19',
            warehouse: 'Warehouse A',
            items: ['Mouse', 'Headphones'],
            quantity: [10, 15],
            supplier: 'Tech Supplies Inc',
        },
        {
            id: 2,
            date: '2024-03-16',
            warehouse: 'Warehouse B',
            items: ['Keyboard', 'Webcam'],
            quantity: [20, 5],
            supplier: 'Electronics Pro',
        },
    ],
};

const Calendar = ({ selectedDate, onChange, isOpen, onClose }) => {
    const currentDate = new Date();
    const [viewDate, setViewDate] = useState(currentDate);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    const handleDateClick = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(newDate);
        onClose();
    };

    const renderDays = () => {
        const daysArray = [];
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === viewDate.getMonth() &&
                selectedDate?.getFullYear() === viewDate.getFullYear();

            daysArray.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center
            ${isSelected ? 'bg-blue-700 text-white' : 'hover:bg-gray-100'}`}
                >
                    {day}
                </button>,
            );
        }
        return daysArray;
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-4 z-50">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() =>
                        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    ←
                </button>
                <span className="font-medium">
                    {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button
                    onClick={() =>
                        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    →
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                    <div
                        key={day}
                        className="h-8 w-8 flex items-center justify-center text-sm text-gray-500"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
    );
};

const SearchField = ({ value, onChange }) => (
    <div className="relative">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Поиск..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:border-blue-700"
        />
        <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
        />
    </div>
);

const FilterButton = ({ onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg border ${
            isActive ? 'border-blue-700 text-blue-700' : 'border-gray-200 text-gray-600'
        } hover:border-blue-700 hover:text-blue-700`}
    >
        <FaSlidersH size={20} />
    </button>
);

const FilterControls = ({
    date,
    onDateChange,
    searchValue,
    onSearchChange,
    onFilterClick,
    isFilterActive,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <div className="flex gap-4 mb-4">
            <div className="relative">
                <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:border-blue-700"
                >
                    <FaCalendarAlt size={20} className="text-gray-400" />
                    <span>{date ? date.toLocaleDateString() : 'Select date'}</span>
                </button>
                <Calendar
                    selectedDate={date}
                    onChange={onDateChange}
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                />
            </div>
            <div className="flex-1">
                <SearchField value={searchValue} onChange={onSearchChange} />
            </div>
            <FilterButton onClick={onFilterClick} isActive={isFilterActive} />
        </div>
    );
};

const HistoryBox = ({ title, icon: Icon, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all
      ${active ? 'bg-blue-700 text-white' : 'bg-white border border-gray-200 hover:border-blue-700'}`}
    >
        <Icon size={24} className={active ? 'text-white' : 'text-blue-700'} />
        <span className="mt-2 font-medium">{title}</span>
    </div>
);

const Modal = ({ isOpen, onClose, data, type }) => {
    if (!isOpen) return null;

    const renderContent = () => {
        switch (type) {
            case 'transfers':
                return (
                    <div>
                        <h3 className="font-bold mb-4">Transfer Details</h3>
                        <p>Date: {data.date}</p>
                        <p>From: {data.from}</p>
                        <p>To: {data.to}</p>
                        <p>Items:</p>
                        <ul className="list-disc pl-5">
                            {data.items.map((item, idx) => (
                                <li key={idx}>
                                    {item} - Quantity: {data.quantity[idx]}
                                </li>
                            ))}
                        </ul>
                        <p>Operator: {data.operator}</p>
                    </div>
                );
            case 'revisions':
                return (
                    <div>
                        <h3 className="font-bold mb-4">Revision Details</h3>
                        <p>Date: {data.date}</p>
                        <p>Warehouse: {data.warehouse}</p>
                        <p>Items Checked: {data.itemsChecked}</p>
                        <p>Discrepancies Found: {data.discrepancies}</p>
                        <p>Operator: {data.operator}</p>
                    </div>
                );
            case 'arrivals':
                return (
                    <div>
                        <h3 className="font-bold mb-4">Arrival Details</h3>
                        <p>Date: {data.date}</p>
                        <p>Warehouse: {data.warehouse}</p>
                        <p>Items:</p>
                        <ul className="list-disc pl-5">
                            {data.items.map((item, idx) => (
                                <li key={idx}>
                                    {item} - Quantity: {data.quantity[idx]}
                                </li>
                            ))}
                        </ul>
                        <p>Supplier: {data.supplier}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaRegWindowClose size={24} />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const HistoryList = ({ type, data }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isFilterActive, setIsFilterActive] = useState(false);

    const renderListItem = (item) => {
        switch (type) {
            case 'transfers':
                return (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer p-4 border-b hover:bg-gray-50"
                    >
                        <p className="font-medium">{item.date}</p>
                        <p className="text-sm text-gray-600">
                            С {item.from} в {item.to}
                        </p>
                        <p className="text-sm text-gray-600">
                            {item.items.length} перемещено товаров
                        </p>
                    </div>
                );
            case 'revisions':
                return (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer p-4 border-b hover:bg-gray-50"
                    >
                        <p className="font-medium">{item.date}</p>
                        <p className="text-sm text-gray-600">{item.warehouse}</p>
                        <p className="text-sm text-gray-600">
                            {item.itemsChecked} позиций проверено, {item.discrepancies}{' '}
                            несоответствий
                        </p>
                    </div>
                );
            case 'arrivals':
                return (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer p-4 border-b hover:bg-gray-50"
                    >
                        <p className="font-medium">{item.date}</p>
                        <p className="text-sm text-gray-600">{item.warehouse}</p>
                        <p className="text-sm text-gray-600">
                            {item.items.length} товаров получено от {item.supplier}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <FilterControls
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onFilterClick={() => setIsFilterActive(!isFilterActive)}
                    isFilterActive={isFilterActive}
                />
            </div>
            <div className="divide-y divide-gray-200">{data.map(renderListItem)}</div>
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                data={selectedItem}
                type={type}
            />
        </div>
    );
};

const WarehouseHistory = () => {
    const [activeType, setActiveType] = useState(null);

    return (
        <div className="p-6 min-w-[100%]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <HistoryBox
                        title="Перемещение товаров"
                        icon={FaTruck}
                        active={activeType === 'transfers'}
                        onClick={() =>
                            setActiveType(activeType === 'transfers' ? null : 'transfers')
                        }
                    />
                    <HistoryBox
                        title="Ревизия инвентаря"
                        icon={FaClipboardList}
                        active={activeType === 'revisions'}
                        onClick={() =>
                            setActiveType(activeType === 'revisions' ? null : 'revisions')
                        }
                    />
                    <HistoryBox
                        title="Прием товара"
                        icon={FaBoxOpen}
                        active={activeType === 'arrivals'}
                        onClick={() => setActiveType(activeType === 'arrivals' ? null : 'arrivals')}
                    />
                </div>

                {activeType && <HistoryList type={activeType} data={mockHistory[activeType]} />}
            </div>
        </div>
    );
};

export default WarehouseHistory;
