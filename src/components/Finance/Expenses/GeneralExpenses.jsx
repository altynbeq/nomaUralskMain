import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
} from 'recharts';

import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Custom Select Component
const CustomSelect = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border rounded-md px-4 py-2 w-32 flex items-center justify-between text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {value}
                <span className="ml-2">▼</span>
            </button>
            {isOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Custom Card Component
const CustomCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>{children}</div>
);

// Sample data
const SAMPLE_DATA = {
    total: 22000,
    previousTotal: 20000,
    averageExpense: 3142.86,
    largestExpense: 12000,
    categories: [
        { name: 'Rent', amount: 5000 },
        { name: 'Salaries', amount: 12000 },
        { name: 'Utilities', amount: 2000 },
        { name: 'Marketing', amount: 3000 },
    ],
    trends: [
        { month: 'Jan', total: 15000, expenses: 12000, budget: 16000 },
        { month: 'Feb', total: 14000, expenses: 13000, budget: 16000 },
        { month: 'Mar', total: 16000, expenses: 15000, budget: 16000 },
        { month: 'Apr', total: 15500, expenses: 14500, budget: 16000 },
        { month: 'May', total: 17000, expenses: 16000, budget: 16000 },
        { month: 'Jun', total: 16500, expenses: 15500, budget: 16000 },
    ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Custom Metric Card Component
const MetricCard = ({ title, value, trend, subValue }) => (
    <CustomCard>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline mt-1">
                <p className="text-2xl font-semibold">{value}</p>
                {trend && (
                    <span
                        className={`ml-2 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {trend > 0 ? '+' : ''}
                        {trend}%
                    </span>
                )}
            </div>
            {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
        </div>
    </CustomCard>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border rounded shadow-lg">
                <p className="font-bold">{label}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.color }}>
                        {pld.name}: ${pld.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CardHeader = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

// here is the dropdown that changes data based on the period

{
    /* <CustomSelect
    value={timeRange}
    onChange={setTimeRange}
    options={[
        { value: 'Last Month', label: 'Last Month' },
        { value: 'Last Quarter', label: 'Last Quarter' },
        { value: 'Last Year', label: 'Last Year' },
    ]}
/> */
}

const GeneralExpenses = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('Last Month');
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(SAMPLE_DATA);
                setError(null);
            } catch (err) {
                setError('Failed to fetch expense data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    const percentageChange = (
        ((data.total - data.previousTotal) / data.previousTotal) *
        100
    ).toFixed(1);

    return (
        <div className="space-y-6 p-6 bg-white subtle-border w-[100%] ">
            {/* Header with filters */}
            <CardHeader className="border-b flex flex-row justify-between border-gray-200">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CardTitle>Expense Summary</CardTitle>
                        </div>
                    </div>
                </div>
                <div
                    className="mr-4 cursor-pointer text-2xl"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                </div>
            </CardHeader>
            {!isCollapsed && (
                // {/* Metrics Grid */}
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Expenses"
                            value={`$${data.total.toLocaleString()}`}
                            trend={parseFloat(percentageChange)}
                            subValue="vs last period"
                        />
                        <MetricCard
                            title="Average Expense"
                            value={`$${data.averageExpense.toLocaleString()}`}
                            subValue="per transaction"
                        />
                        <MetricCard
                            title="Largest Expense"
                            value={`$${data.largestExpense.toLocaleString()}`}
                            subValue="this period"
                        />
                        <MetricCard
                            title="Monthly Change"
                            value={`${Math.abs(percentageChange)}%`}
                            subValue={percentageChange >= 0 ? 'Increase' : 'Decrease'}
                        />
                    </div>
                    <CustomCard>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Category Breakdown */}
                            <div className="h-[300px]">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Expenses by Category
                                </h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.categories}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" prefix="$" />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip
                                            formatter={(value) => [
                                                `$${value.toLocaleString()}`,
                                                'Amount',
                                            ]}
                                        />
                                        <Bar dataKey="amount" fill="#0088FE">
                                            {data.categories.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Trends Chart */}
                            <div className="h-[300px] mb-10">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Expense Trends
                                </h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#0088FE"
                                            strokeWidth={2}
                                            name="Total"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="budget"
                                            stroke="#FF8042"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            name="Budget"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CustomCard>
                </>
            )}
        </div>
    );
};

export default GeneralExpenses;
