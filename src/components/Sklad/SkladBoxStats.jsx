import { BsCurrencyDollar } from 'react-icons/bs';
import {
    FaWarehouse,
    FaArrowDown,
    FaArrowUp,
    FaBalanceScaleRight,
    FaFileSignature,
    FaBoxes,
} from 'react-icons/fa';

const icons = {
    user: BsCurrencyDollar,
    discount: BsCurrencyDollar,
    receipt: BsCurrencyDollar,
    coin: BsCurrencyDollar,
};

const data = [
    { title: 'Алматы', icon: 'receipt', value: '13,456', diff: 34 },
    { title: 'Астана', icon: 'coin', value: '4,145', diff: -13 },
    { title: 'Караганда', icon: 'discount', value: '745', diff: 18 },
    { title: 'Актобе', icon: 'user', value: '188', diff: -30 },
];

// Calculate total stats
// Assuming `value` is a string that can be converted to number:
// For a real scenario, you should convert value to a number and sum them up properly.
const numericValues = data.map((d) => Number(d.value.replace(',', '')));
const totalValue = numericValues.reduce((acc, curr) => acc + curr, 0);

// Calculate an overall diff or other aggregate metrics as needed.
// For demonstration, let's just sum up diffs.
const totalDiff = data.reduce((acc, curr) => acc + curr.diff, 0);

const SkladBoxStats = () => {
    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];
        const DiffIcon = stat.diff > 0 ? FaArrowUp : FaArrowDown;

        return (
            <div className="border rounded-xl p-4 shadow-md bg-white" key={stat.title}>
                <div className="flex flex-row justify-between">
                    <p className="text-xs uppercase font-semibold text-gray-500">{stat.title}</p>
                    <FaWarehouse className="text-gray-400" size={22} stroke={1.5} />
                </div>
                <div className="flex flex-row justify-between">
                    <div>
                        <div className="flex items-end gap-2 mt-6">
                            <p className="text-2xl">{stat.value}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Лимит</p>
                    </div>
                    <div>
                        <div className="flex items-end gap-2 mt-6">
                            <p className="text-2xl">{stat.value}</p>
                            <p
                                className={`text-sm font-medium ${
                                    stat.diff > 0 ? 'text-teal-500' : 'text-red-500'
                                } flex items-center`}
                            >
                                {stat.diff}%
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Всего товара</p>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <div>
                        <div className="flex items-end gap-2 mt-6">
                            <p className="text-xl">{stat.value}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Списаний</p>
                    </div>
                    <div>
                        <div className="flex items-end gap-2 mt-6">
                            <p className="text-xl">{stat.value}</p>
                            <p
                                className={`text-sm font-medium ${
                                    stat.diff > 0 ? 'text-teal-500' : 'text-red-500'
                                } flex items-center`}
                            >
                                {stat.diff}%
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Доступно места</p>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="p-6 w-[100%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Full-width total stats box */}
            <div className="border rounded-xl p-4 mb-5 shadow-md bg-white md:col-span-4">
                <div className="flex flex-row  justify-between">
                    <p className="text-xs uppercase font-semibold text-gray-500">Общее</p>
                    <FaWarehouse className="text-gray-400" size={22} stroke={1.5} />
                </div>
                <div className="flex flex-row justify-between">
                    {/* Всего товара */}
                    <div>
                        <div className="flex items-center gap-2 mt-6">
                            <FaBoxes className="text-blue-500" size={20} />
                            <p className="text-3xl">{totalValue.toLocaleString()}</p>
                            <p
                                className={`text-sm font-medium ${
                                    totalDiff > 0 ? 'text-teal-500' : 'text-red-500'
                                } flex items-center`}
                            >
                                {totalDiff}%
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Всего товара</p>
                    </div>

                    {/* Списаний */}
                    <div>
                        <div className="flex items-center gap-2 mt-6">
                            <FaFileSignature className="text-blue-500" size={20} />
                            <p className="text-3xl">{totalValue.toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Списаний</p>
                    </div>

                    {/* Доступно места */}
                    <div>
                        <div className="flex items-center gap-2 mt-6">
                            <FaWarehouse className="text-blue-500" size={20} />
                            <p className="text-3xl">{totalValue.toLocaleString()}</p>
                            <p
                                className={`text-sm font-medium ${
                                    totalDiff > 0 ? 'text-teal-500' : 'text-red-500'
                                } flex items-center`}
                            >
                                {totalDiff}%
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Доступно места</p>
                    </div>

                    {/* Лимит (Сумма) */}
                    <div>
                        <div className="flex items-center gap-2 mt-6">
                            <FaBalanceScaleRight className="text-blue-500" size={20} />
                            <p className="text-3xl">{totalValue.toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Лимит (Сумма)</p>
                    </div>
                </div>
            </div>
            {stats}
        </div>
    );
};

export default SkladBoxStats;
