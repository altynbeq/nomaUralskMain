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
import { FiDollarSign, FiUsers, FiTrendingUp, FiPieChart, FiActivity } from 'react-icons/fi';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Sample data - In a real app, this would come from an API
const monthlyData = [
    { month: 'Jan', adminExpenses: 120000, totalExpenses: 450000, revenue: 800000, employees: 150 },
    { month: 'Feb', adminExpenses: 125000, totalExpenses: 460000, revenue: 820000, employees: 155 },
    { month: 'Mar', adminExpenses: 118000, totalExpenses: 445000, revenue: 790000, employees: 152 },
    { month: 'Apr', adminExpenses: 130000, totalExpenses: 470000, revenue: 850000, employees: 158 },
    { month: 'May', adminExpenses: 127000, totalExpenses: 465000, revenue: 830000, employees: 156 },
    { month: 'Jun', adminExpenses: 135000, totalExpenses: 480000, revenue: 880000, employees: 160 },
];

const departmentData = [
    { department: 'HR', cost: 45000 },
    { department: 'Finance', cost: 55000 },
    { department: 'Operations', cost: 35000 },
    { department: 'Legal', cost: 25000 },
];

const expenseBreakdown = [
    { category: 'Salaries', value: 60000 },
    { category: 'Rent', value: 25000 },
    { category: 'Utilities', value: 15000 },
    { category: 'Technology', value: 20000 },
    { category: 'Other', value: 15000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Custom Card Components
const Card = ({ children, className }) => (
    <div className={`bg-white subtle-border rounded-lg shadow-md p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
    <div className="flex items-center justify-between mb-2">{children}</div>
);

const CardTitle = ({ children }) => (
    <h3 className="text-sm font-medium text-gray-500">{children}</h3>
);

const CardHeaderMain = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitleMain = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

const CardContent = ({ children }) => <div className="space-y-2">{children}</div>;

const MetricCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <Icon className="h-5 w-5 text-gray-500" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && (
                <div
                    className={`flex items-center text-sm ${trendValue >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                    {trendValue >= 0 ? '+' : ''}
                    {trendValue}%
                </div>
            )}
        </CardContent>
    </Card>
);

const AdminExpenses = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Calculate current metrics
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const adminExpenseGrowth =
        ((currentMonth.adminExpenses - previousMonth.adminExpenses) / previousMonth.adminExpenses) *
        100;
    const costPerEmployee = currentMonth.adminExpenses / currentMonth.employees;
    const adminExpenseRatio = (currentMonth.adminExpenses / currentMonth.revenue) * 100;

    return (
        <div className=" p-4 bg-white subtle-border">
            <div className="max-w-7xl mx-auto">
                <CardHeaderMain className="border-b mb-5 flex flex-row justify-between border-gray-200">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CardTitleMain>Administrative Expenses</CardTitleMain>
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
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <MetricCard
                                title="Total Admin Expenses"
                                value={`$${currentMonth.adminExpenses.toLocaleString()}`}
                                icon={FiDollarSign}
                                trend
                                trendValue={adminExpenseGrowth.toFixed(1)}
                            />
                            <MetricCard
                                title="Cost per Employee"
                                value={`$${costPerEmployee.toFixed(2)}`}
                                icon={FiUsers}
                            />
                            <MetricCard
                                title="Admin Expense Ratio"
                                value={`${adminExpenseRatio.toFixed(1)}%`}
                                icon={FiPieChart}
                            />
                            <MetricCard
                                title="Return on Admin Expenses"
                                value={`${(((currentMonth.revenue - currentMonth.adminExpenses) / currentMonth.adminExpenses) * 100).toFixed(1)}%`}
                                icon={FiActivity}
                            />
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Admin Expenses Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Expenses Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                                    dataKey="adminExpenses"
                                                    stroke="#0088FE"
                                                    fill="#0088FE"
                                                    fillOpacity={0.3}
                                                    name="Admin Expenses"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Department Costs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overhead Cost by Department</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={departmentData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="department" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="cost" fill="#00C49F" name="Cost" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Expense Breakdown */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Expense Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expenseBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label
                                                >
                                                    {expenseBreakdown.map((entry, index) => (
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
                                </CardContent>
                            </Card>

                            {/* Admin Expenses vs Total Expenses */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin vs Total Expenses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey="totalExpenses"
                                                    fill="#8884d8"
                                                    name="Total Expenses"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="adminExpenses"
                                                    stroke="#FF8042"
                                                    name="Admin Expenses"
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminExpenses;
