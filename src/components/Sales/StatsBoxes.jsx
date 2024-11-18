import { BsCurrencyDollar } from 'react-icons/bs';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const icons = {
    user: BsCurrencyDollar,
    discount: BsCurrencyDollar,
    receipt: BsCurrencyDollar,
    coin: BsCurrencyDollar,
};

const data = [
    { title: 'Выручка', icon: 'receipt', value: '13,456', diff: 34 },
    { title: 'Прибыль', icon: 'coin', value: '4,145', diff: -13 },
    { title: 'Использование купонов', icon: 'discount', value: '745', diff: 18 },
    { title: 'Новые клиенты', icon: 'user', value: '188', diff: -30 },
];

const StatsBoxes = () => {
    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];
        const DiffIcon = stat.diff > 0 ? FaArrowUp : FaArrowDown;

        return (
            <div className="border rounded-xl p-4 shadow-md bg-white" key={stat.title}>
                <div className="flex justify-between">
                    <p className="text-xs uppercase font-semibold text-gray-500">Demo</p>
                    <Icon className="text-gray-400" size={22} stroke={1.5} />
                </div>

                <div className="flex items-end gap-2 mt-6">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                        className={`text-sm font-medium ${
                            stat.diff > 0 ? 'text-teal-500' : 'text-red-500'
                        } flex items-center`}
                    >
                        {stat.diff}%
                        <DiffIcon className="ml-1" size={16} stroke={1.5} />
                    </p>
                </div>

                <p className="text-xs text-gray-500 mt-2">От прошлого месяца</p>
            </div>
        );
    });

    return (
        <div className="p-6 w-[95%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats}
        </div>
    );
};

export default StatsBoxes;
