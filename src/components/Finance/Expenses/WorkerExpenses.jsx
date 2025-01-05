import React, { useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
} from 'recharts';
import {
    FiDollarSign,
    FiUsers,
    FiTrendingUp,
    FiActivity,
    FiAward,
    FiBookOpen,
    FiClock,
    FiHeart,
} from 'react-icons/fi';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
// Sample data
const monthlyData = [
    {
        month: 'Jan',
        totalExpenses: 850000,
        salaries: 600000,
        benefits: 150000,
        bonuses: 50000,
        training: 25000,
        overtime: 15000,
        reimbursements: 10000,
        headcount: 100,
        revenue: 2000000,
    },
    // Additional months...
].map((month) => ({
    ...month,
    laborEfficiency: month.revenue / month.headcount,
    expensePerRevenue: month.totalExpenses / month.revenue,
}));

const departmentSalaries = [
    { department: 'Engineering', salary: 450000 },
    { department: 'Sales', salary: 350000 },
    { department: 'Marketing', salary: 250000 },
    { department: 'HR', salary: 150000 },
    { department: 'Operations', salary: 200000 },
];

const benefitsBreakdown = [
    { type: 'Healthcare', value: 80000 },
    { type: 'Retirement', value: 40000 },
    { type: 'Insurance', value: 30000 },
    { type: 'Other Perks', value: 20000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Custom Components
const Card = ({ children, className }) => (
    <div className={`bg-white subtle-border rounded-lg shadow-md p-4 ${className}`}>{children}</div>
);

const CardHeaderMain = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitleMain = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const MetricCard = ({ title, value, icon: Icon, subValue, trend }) => (
    <Card>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subValue && (
                <div className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend >= 0 ? '+' : ''}
                    {trend}% vs last period
                </div>
            )}
        </div>
    </Card>
);

const WorkerExpenses = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Calculate current metrics
    const currentMonth = monthlyData[0];
    const benefitsToSalaryRatio = ((currentMonth.benefits / currentMonth.salaries) * 100).toFixed(
        1,
    );
    const expensePerEmployee = (currentMonth.totalExpenses / currentMonth.headcount).toFixed(0);

    return (
        <div className="p-4 bg-white subtle-border">
            <div className="max-w-7xl mx-auto">
                <CardHeaderMain className="border-b mb-5 flex flex-row justify-between border-gray-200">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CardTitleMain>Employee Expenses</CardTitleMain>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mr-4 cursor-pointer text-2xl"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <FaAngleDown /> : <FaAngleUp />}
                    </div>
                </CardHeaderMain>
                {!isCollapsed && (
                    <>
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <MetricCard
                                title="Total Employee Expenses"
                                value={`$${currentMonth.totalExpenses.toLocaleString()}`}
                                icon={FiDollarSign}
                                trend={5.2}
                            />
                            <MetricCard
                                title="Expense per Employee"
                                value={`$${expensePerEmployee}`}
                                icon={FiUsers}
                                trend={2.1}
                            />
                            <MetricCard
                                title="Benefits to Salary Ratio"
                                value={`${benefitsToSalaryRatio}%`}
                                icon={FiHeart}
                                trend={0.5}
                            />
                            <MetricCard
                                title="Labor Efficiency"
                                value={`$${Math.round(currentMonth.laborEfficiency).toLocaleString()}`}
                                icon={FiActivity}
                                trend={3.8}
                            />
                        </div>
                        {/* Additional Metrics Grid */}
                        <div className="grid grid-cols-1 mb-10 md:grid-cols-3 gap-4 mt-6">
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Training & Development</h3>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${currentMonth.training.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Per employee: $
                                    {(currentMonth.training / currentMonth.headcount).toFixed(0)}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-medium mb-4">Overtime Expenses</h3>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${currentMonth.overtime.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {(
                                        (currentMonth.overtime / currentMonth.totalExpenses) *
                                        100
                                    ).toFixed(1)}
                                    % of total expenses
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-medium mb-4">Reimbursements</h3>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${currentMonth.reimbursements.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Average: $
                                    {(currentMonth.reimbursements / currentMonth.headcount).toFixed(
                                        0,
                                    )}
                                    /employee
                                </div>
                            </Card>
                        </div>
                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Salary Distribution by Department */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">
                                    Salary Distribution by Department
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={departmentSalaries}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="department" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="salary"
                                                fill="#0088FE"
                                                name="Total Salary"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Benefits Breakdown */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Benefits Breakdown</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={benefitsBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label
                                            >
                                                {benefitsBreakdown.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Headcount vs Expenses Trend */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">
                                    Headcount vs Expenses Trend
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="totalExpenses"
                                                fill="#8884d8"
                                                name="Total Expenses"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="headcount"
                                                stroke="#ff7300"
                                                name="Headcount"
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Expense Components Trend */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">
                                    Expense Components Trend
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="salaries"
                                                stackId="1"
                                                stroke="#8884d8"
                                                fill="#8884d8"
                                                name="Salaries"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="benefits"
                                                stackId="1"
                                                stroke="#82ca9d"
                                                fill="#82ca9d"
                                                name="Benefits"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="bonuses"
                                                stackId="1"
                                                stroke="#ffc658"
                                                fill="#ffc658"
                                                name="Bonuses"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkerExpenses;
