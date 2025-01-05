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
} from 'recharts';
import {
    FiDollarSign,
    FiPackage,
    FiTrendingUp,
    FiUsers,
    FiArrowUp,
    FiArrowDown,
} from 'react-icons/fi';

import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Sample data - in a real app, this would come from your API/database
const monthlyData = [
    { month: 'Jan', cogs: 150000, sales: 280000, units: 5000, customers: 2000 },
    { month: 'Feb', cogs: 165000, sales: 310000, units: 5500, customers: 2200 },
    { month: 'Mar', cogs: 145000, sales: 290000, units: 4800, customers: 1900 },
    { month: 'Apr', cogs: 180000, sales: 350000, units: 6000, customers: 2400 },
    { month: 'May', cogs: 170000, sales: 320000, units: 5600, customers: 2100 },
    { month: 'Jun', cogs: 190000, sales: 380000, units: 6300, customers: 2600 },
];

const categoryData = [
    { category: 'Fresh Flowers', value: 45000 },
    { category: 'Packaging', value: 25000 },
    { category: 'Shipping', value: 35000 },
    { category: 'Labor', value: 55000 },
];

const vendorData = [
    { name: 'Vendor A', cogs: 75000 },
    { name: 'Vendor B', cogs: 45000 },
    { name: 'Vendor C', cogs: 35000 },
    { name: 'Vendor D', cogs: 25000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Custom Card Components
const Card = ({ children, className }) => (
    <div className={`bg-white subtle-border rounded-lg shadow-md p-4 ${className}`}>{children}</div>
);

const CardHeaderMain = ({ className = '', children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
    <div className={`flex items-center justify-between mb-2 ${className}`}>{children}</div>
);
const CardTitleMain = ({ className = '', children }) => (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);
const CardTitle = ({ children, className }) => (
    <h3 className={`text-sm font-medium text-gray-500 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className }) => <div className={`${className}`}>{children}</div>;

const COGS = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    // Calculate metrics
    const currentCOGS = monthlyData[monthlyData.length - 1].cogs;
    const previousCOGS = monthlyData[monthlyData.length - 2].cogs;
    const cogsGrowth = ((currentCOGS - previousCOGS) / previousCOGS) * 100;
    const totalSales = monthlyData[monthlyData.length - 1].sales;
    const grossProfit = totalSales - currentCOGS;
    const cogsPerUnit = currentCOGS / monthlyData[monthlyData.length - 1].units;
    const cogsPerCustomer = currentCOGS / monthlyData[monthlyData.length - 1].customers;

    return (
        <div className="p-4 bg-white subtle-border">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <CardHeaderMain className="border-b mb-10 flex flex-row justify-between border-gray-200">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CardTitleMain>COGS</CardTitleMain>
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
                            {/* Total COGS Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total COGS</CardTitle>
                                    <FiDollarSign className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${currentCOGS.toLocaleString()}
                                    </div>
                                    <div
                                        className={`flex items-center text-sm ${cogsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {cogsGrowth >= 0 ? (
                                            <FiArrowUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <FiArrowDown className="h-4 w-4 mr-1" />
                                        )}
                                        {Math.abs(cogsGrowth).toFixed(1)}%
                                    </div>
                                </CardContent>
                            </Card>

                            {/* COGS per Unit Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS per Unit</CardTitle>
                                    <FiPackage className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${cogsPerUnit.toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Gross Profit Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gross Profit</CardTitle>
                                    <FiTrendingUp className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${grossProfit.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* COGS per Customer Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS per Customer</CardTitle>
                                    <FiUsers className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${cogsPerCustomer.toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* COGS Trend Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="cogs"
                                                    stroke="#0088FE"
                                                    name="COGS"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* COGS by Category */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="category" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" fill="#0088FE" name="Amount" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* COGS as Percentage of Sales */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS vs Sales</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'COGS', value: currentCOGS },
                                                        {
                                                            name: 'Other',
                                                            value: totalSales - currentCOGS,
                                                        },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label
                                                >
                                                    {[0, 1].map((entry, index) => (
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

                            {/* COGS by Vendor */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>COGS by Vendor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={vendorData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="cogs" fill="#0088FE" name="COGS" />
                                            </BarChart>
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

export default COGS;
