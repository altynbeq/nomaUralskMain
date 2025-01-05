import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
    AreaChart,
    Area,
    ComposedChart,
    Scatter,
} from 'recharts';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Sample data structure
const SAMPLE_DATA = {
    generalMetrics: {
        totalOpex: 1250000,
        opexRatio: 28.5,
        previousOpexRatio: 30.2,
        expenseGrowth: -1.7,
        fixedVsVariable: [
            { name: 'Fixed Expenses', value: 750000 },
            { name: 'Variable Expenses', value: 500000 },
        ],
        monthlyTrend: [
            { month: 'Jan', opex: 980000, revenue: 3500000 },
            { month: 'Feb', opex: 1050000, revenue: 3800000 },
            { month: 'Mar', opex: 1250000, revenue: 4200000 },
        ],
    },
    efficiencyMetrics: {
        costPerEmployee: {
            current: 5200,
            benchmark: 5500,
            trend: [
                { month: 'Jan', cost: 5000 },
                { month: 'Feb', cost: 5100 },
                { month: 'Mar', cost: 5200 },
            ],
        },
        revenuePerOpex: {
            current: 3.36,
            previous: 3.15,
            trend: [
                { month: 'Jan', ratio: 3.15 },
                { month: 'Feb', ratio: 3.25 },
                { month: 'Mar', ratio: 3.36 },
            ],
        },
    },
    departmentalMetrics: {
        allocation: [
            { department: 'Sales', amount: 350000 },
            { department: 'Marketing', amount: 250000 },
            { department: 'R&D', amount: 300000 },
            { department: 'Admin', amount: 200000 },
            { department: 'Operations', amount: 150000 },
        ],
        costPerUnit: {
            current: 42,
            benchmark: 45,
            trend: [
                { month: 'Jan', cost: 44 },
                { month: 'Feb', cost: 43 },
                { month: 'Mar', cost: 42 },
            ],
        },
    },
    benchmarkMetrics: {
        industryComparison: [
            { metric: 'OPEX Ratio', company: 28.5, industry: 30 },
            { metric: 'Cost per Employee', company: 5200, industry: 5500 },
            { metric: 'Revenue per OPEX', company: 3.36, industry: 3.2 },
        ],
        varianceAnalysis: {
            budget: 1200000,
            actual: 1250000,
            variance: -50000,
            variancePercent: -4.17,
        },
    },
};

// Custom Components
const MetricCard = ({ title, value, change, subtitle, format = 'number' }) => {
    const formattedValue =
        format === 'currency'
            ? `$${value.toLocaleString()}`
            : format === 'percent'
              ? `${value}%`
              : value.toLocaleString();

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-semibold">{formattedValue}</span>
                {change && (
                    <span
                        className={`ml-2 text-sm font-medium ${
                            change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {change > 0 ? '+' : ''}
                        {change}%
                    </span>
                )}
            </div>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border rounded shadow-lg">
                <p className="font-semibold">{label}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.color }}>
                        {pld.name}:{' '}
                        {typeof pld.value === 'number'
                            ? pld.value.toLocaleString(undefined, {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                              })
                            : pld.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const formattedExpenseGrowth = (expenseGrowth) => {
    return Math.round(expenseGrowth * 10) / 10 === expenseGrowth
        ? expenseGrowth.toFixed(1) // Keep as is if it's already a clean rounded number
        : (Math.round(expenseGrowth * 10) / 10).toFixed(1);
};
const CardHeader = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OperationalMetrics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('monthly');
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(SAMPLE_DATA);
                setError(null);
            } catch (err) {
                setError('Failed to fetch OPEX metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6 p-6 bg-white subtle-border w-[100%] ">
            {/* Header */}
            <CardHeader className="border-b flex flex-row justify-between border-gray-200">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CardTitle>OPEX Metrics Dashboard</CardTitle>
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Operating Expenses"
                            value={data.generalMetrics.totalOpex}
                            format="currency"
                            change={formattedExpenseGrowth(data.generalMetrics.expenseGrowth, 1)}
                            subtitle="vs. previous period"
                        />
                        <MetricCard
                            title="OPEX Ratio"
                            value={data.generalMetrics.opexRatio}
                            format="percent"
                            change={formattedExpenseGrowth(
                                data.generalMetrics.previousOpexRatio -
                                    data.generalMetrics.opexRatio,
                            )}
                            subtitle="of total revenue"
                        />
                        <MetricCard
                            title="Revenue per OPEX Dollar"
                            value={data.efficiencyMetrics.revenuePerOpex.current}
                            change={formattedExpenseGrowth(
                                (data.efficiencyMetrics.revenuePerOpex.current -
                                    data.efficiencyMetrics.revenuePerOpex.previous) *
                                    100,
                            )}
                            subtitle="efficiency ratio"
                        />
                        <MetricCard
                            title="Cost per Employee"
                            value={data.efficiencyMetrics.costPerEmployee.current}
                            format="currency"
                            subtitle="vs. benchmark: $5,500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Fixed vs Variable Expenses
                            </h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.generalMetrics.fixedVsVariable}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {data.generalMetrics.fixedVsVariable.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold mb-4">Departmental Allocation</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.departmentalMetrics.allocation}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="department" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="amount" fill="#0088FE">
                                            {data.departmentalMetrics.allocation.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ),
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold mb-4">OPEX vs Revenue Trend</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={data.generalMetrics.monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="opex" fill="#0088FE" name="OPEX" />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#FF8042"
                                            name="Revenue"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold mb-4">Efficiency Metrics Trend</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.efficiencyMetrics.revenuePerOpex.trend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ratio"
                                            stroke="#0088FE"
                                            name="Revenue per OPEX"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OperationalMetrics;
