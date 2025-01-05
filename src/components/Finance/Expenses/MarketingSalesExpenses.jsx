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
    FiTrendingUp,
    FiUsers,
    FiTarget,
    FiActivity,
    FiBarChart2,
    FiGlobe,
} from 'react-icons/fi';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
// Sample data
const monthlyData = [
    {
        month: 'Jan',
        totalExpenses: 250000,
        digitalAds: 80000,
        traditionalAds: 40000,
        salesTeam: 100000,
        events: 30000,
        leads: 1200,
        conversions: 180,
        revenue: 800000,
    },
    // More months...
];

const platformSpend = [
    { platform: 'Google Ads', spend: 45000 },
    { platform: 'Facebook', spend: 35000 },
    { platform: 'LinkedIn', spend: 25000 },
    { platform: 'Instagram', spend: 20000 },
    { platform: 'Twitter', spend: 15000 },
];

const campaignData = [
    {
        campaign: 'Summer Sale',
        spend: 50000,
        revenue: 150000,
        leads: 500,
        conversions: 75,
    },
    // More campaigns...
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

const MetricCard = ({ title, value, subValue, icon: Icon, trend }) => (
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

const MarketingSalesExpenses = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [selectedCampaign, setSelectedCampaign] = useState('all');
    const [isCollapsed, setIsCollapsed] = useState(true);
    // Calculate metrics
    const currentData = monthlyData[0];
    const cac = (currentData.totalExpenses / currentData.conversions).toFixed(2);
    const roi = (
        ((currentData.revenue - currentData.totalExpenses) / currentData.totalExpenses) *
        100
    ).toFixed(1);
    const cpl = (currentData.totalExpenses / currentData.leads).toFixed(2);

    return (
        <div className="p-4 bg-white subtle-border">
            <div className="max-w-7xl mx-auto">
                <CardHeaderMain className="border-b mb-5 flex flex-row justify-between border-gray-200">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CardTitleMain>Marketing & Sales Expenses</CardTitleMain>
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
                                title="Total Marketing & Sales Expenses"
                                value={`$${currentData.totalExpenses.toLocaleString()}`}
                                icon={FiDollarSign}
                                trend={5.2}
                            />
                            <MetricCard
                                title="Customer Acquisition Cost"
                                value={`$${cac}`}
                                icon={FiUsers}
                                trend={-2.1}
                            />
                            <MetricCard
                                title="Marketing ROI"
                                value={`${roi}%`}
                                icon={FiTrendingUp}
                                trend={3.5}
                            />
                            <MetricCard
                                title="Cost per Lead"
                                value={`$${cpl}`}
                                icon={FiTarget}
                                trend={-1.8}
                            />
                        </div>
                        {/* Additional Metrics */}
                        <div className="grid grid-cols-1 mb-10 md:grid-cols-3 gap-4 mt-6">
                            <Card>
                                <h3 className="text-lg font-medium mb-4">
                                    Email Marketing Performance
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cost per Email</span>
                                        <span className="font-medium">$0.05</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Open Rate</span>
                                        <span className="font-medium">24.5%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Click Rate</span>
                                        <span className="font-medium">3.2%</span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-medium mb-4">Content Marketing</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Blog Posts</span>
                                        <span className="font-medium">$12,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Videos</span>
                                        <span className="font-medium">$25,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Infographics</span>
                                        <span className="font-medium">$8,000</span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-medium mb-4">Sales Team Performance</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Base Salaries</span>
                                        <span className="font-medium">$75,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Commissions</span>
                                        <span className="font-medium">$25,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Bonuses</span>
                                        <span className="font-medium">$15,000</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Platform Spend Distribution */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">
                                    Platform Spend Distribution
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={platformSpend}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="spend"
                                                nameKey="platform"
                                                label
                                            >
                                                {platformSpend.map((entry, index) => (
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

                            {/* Expense Trends */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Expense Trends</h3>
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
                                                dataKey="digitalAds"
                                                stackId="1"
                                                stroke="#8884d8"
                                                fill="#8884d8"
                                                name="Digital Ads"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="traditionalAds"
                                                stackId="1"
                                                stroke="#82ca9d"
                                                fill="#82ca9d"
                                                name="Traditional Ads"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="salesTeam"
                                                stackId="1"
                                                stroke="#ffc658"
                                                fill="#ffc658"
                                                name="Sales Team"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Campaign Performance */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Campaign Performance</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={campaignData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="campaign" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="spend"
                                                fill="#8884d8"
                                                name="Spend"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#ff7300"
                                                name="Revenue"
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Funnel Metrics */}
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Sales Funnel Metrics</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { stage: 'Awareness', value: 1000 },
                                                { stage: 'Interest', value: 750 },
                                                { stage: 'Decision', value: 500 },
                                                { stage: 'Action', value: 250 },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="stage" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#0088FE" name="Prospects" />
                                        </BarChart>
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

export default MarketingSalesExpenses;
