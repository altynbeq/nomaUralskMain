import { useState } from 'react';
import {
    FaChevronDown,
    FaChevronUp,
    FaTrophy,
    FaSortAmountDown,
    FaSortAmountUpAlt,
} from 'react-icons/fa';
import WorkerInfoModal from './workersComponents/WorkerInfoModal';
import {
    TbRosetteNumber1,
    TbRosetteNumber2,
    TbRosetteNumber3,
    TbRosetteNumber4,
    TbRosetteNumber5,
} from 'react-icons/tb';
import { FiFilter, FiSearch } from 'react-icons/fi';

const stores = ['Все магазины', 'Алматы', 'Сатпаева', 'Панфилова'];
const data = [
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
        name: 'Robert Wolfkisser',
        position: 1,
        number: <TbRosetteNumber1 />,
        email: 'rob_wolf@gmail.com',
        role: 'Collaborator',
        positionStatus: <FaSortAmountUpAlt />,
        positionStatusColor: 'green-400',
        conversion: '73%',
        sales: 52,
        avgCheck: '12 500тг',
        iconColor: 'orange-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaTrophy />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
        name: 'Jill Jailbreaker',
        number: <TbRosetteNumber2 />,
        email: 'jj@breaker.com',
        position: 2,
        conversion: '63%',
        role: 'Collaborator',
        sales: 34,
        positionStatus: <FaSortAmountUpAlt />,
        positionStatusColor: 'green-400',
        avgCheck: '12 500тг',
        lastActive: '6 days ago',
        iconColor: 'green-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountUpAlt />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
        name: 'Henry Silkeater',
        number: <TbRosetteNumber3 />,
        email: 'henry@silkeater.io',
        position: 3,
        role: 'Contractor',
        conversion: '43%',
        avgCheck: '12 500тг',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        lastActive: '2 days ago',
        sales: 40,
        iconColor: 'red-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        name: 'Bill Horsefighter',
        number: <TbRosetteNumber4 />,
        email: 'bhorsefighter@gmail.com',
        position: 4,
        role: 'Contractor',
        conversion: '33%',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        avgCheck: '12 500тг',
        sales: 34,
        lastActive: '5 days ago',
        iconColor: 'red-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
        name: 'Jeremy Footviewer',
        number: <TbRosetteNumber5 />,
        email: 'jeremy@foot.dev',
        position: 5,
        role: 'Manager',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        conversion: '23%',
        avgCheck: '12 500тг',
        sales: 31,
        lastActive: '3 days ago',
        iconColor: 'red-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
];

function Th({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? (reversed ? FaChevronDown : FaChevronUp) : FaChevronDown;
    return (
        <th className="p-2 text-left">
            <button
                onClick={onSort}
                className="flex items-center gap-2 font-medium hover:text-blue-600"
            >
                {children}
                <Icon className="text-sm" />
            </button>
        </th>
    );
}

function filterData(data, search) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(query)),
    );
}

function sortData(data, { sortBy, reversed, search }) {
    const filteredData = filterData(data, search);
    if (!sortBy) return filteredData;

    return filteredData.sort((a, b) =>
        reversed
            ? String(b[sortBy]).localeCompare(String(a[sortBy]))
            : String(a[sortBy]).localeCompare(String(b[sortBy])),
    );
}

const WorkersList = () => {
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedStore, setSelectedStore] = useState('Все магазины');

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (e) => {
        const value = event.target.value;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const handleStoreChange = async (e) => {
        setSelectedStore(e);
    };

    const handleRowClick = (worker) => {
        setSelectedWorker(worker);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedWorker(null);
    };

    return (
        <div className="bg-white w-[90%]  mx-auto md:max-w-screen  p-5 subtle-border dark:bg-gray-900 overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold">Топ сотрудников</h1>
                </div>
                {/* Search field */}
                <div className="relative flex flex-row gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 text-white py-1 px-3 rounded-2xl hover:bg-blue-700 transition-colors">
                        <FiFilter />
                        Filter
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded w-64 py-1 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <Th
                                sorted={sortBy === 'name'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('name')}
                            >
                                Employee
                            </Th>
                            <Th
                                sorted={sortBy === 'role'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('role')}
                            >
                                Role
                            </Th>
                            <Th
                                sorted={sortBy === 'lastActive'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('lastActive')}
                            >
                                Last Active
                            </Th>
                            <Th
                                sorted={sortBy === 'active'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('active')}
                            >
                                Status
                            </Th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item) => (
                            <tr
                                key={item.name}
                                className="border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(item)}
                            >
                                <td className="p-2 flex  items-center gap-3">
                                    <div className="text-2xl  text-black">{item.number}</div>

                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className=" overflow-hidden">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.email}</p>
                                    </div>
                                    {item.icon && (
                                        <div className={`text-${item.iconColor}`}>{item.icon}</div>
                                    )}
                                </td>
                                <td className="p-2">{item.role}</td>
                                <td className="p-2">{item.lastActive}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${item.active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {item.active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-[80%]">
                <WorkerInfoModal isOpen={modalOpen} onClose={closeModal} worker={selectedWorker} />
            </div>
        </div>
    );
};

export default WorkersList;
