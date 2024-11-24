import React, { useState } from 'react';
import { Group, Text, Paper, Progress, SimpleGrid, Box } from '@mantine/core';
import CustomTooltip from './subcomponents/Tooltip';
import RadarChart from '../../ReCharts/RadarChart';
import ChartLegend from './subcomponents/ChartLegend';
import BubbleChart from '../../ReCharts/BubbleChart';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const data = [
    {
        name: 'Project A (60%)',
        uv: 31.47,
        pv: 2400,
        fill: '#8884d8',
    },
    {
        name: 'Project B (60%)',
        uv: 26.69,
        pv: 4567,
        fill: '#83a6ed',
    },
    {
        name: 'Project C (60%)',
        uv: 15.69,
        pv: 1398,
        fill: '#8dd1e1',
    },
    {
        name: 'Project D (60%)',
        uv: 8.22,
        pv: 9800,
        fill: '#82ca9d',
    },
    {
        name: 'Project E (60%)',
        uv: 8.63,
        pv: 3908,
        fill: '#a4de6c',
    },
    {
        name: 'Task Over 50 (60%)',
        uv: 2.63,
        pv: 4800,
        fill: '#d0ed57',
    },
    {
        name: 'Unknown Tasks (60%)',
        uv: 6.67,
        pv: 4800,
        fill: '#ffc658',
    },
];

const WorkerStatsComp = ({ worker }) => {
    const workerStats = [
        {
            part: 30,
            color: 'green',
            taskName: 'Sell crack to Hunter Biden',
            label: 'Completed Tasks',
            count: 15,
        },
        { part: 90, color: 'green', taskName: 'Sell crack to Hunter Biden', label: '', count: 35 },
        {
            part: 70,
            color: 'orange',
            taskName: 'Sell crack to Hunter Biden',
            label: 'Pending Tasks',
            count: 35,
        },
    ];

    const segments = workerStats.map((segment) => (
        <Progress.Section value={segment.part} color={segment.color} key={segment.color}>
            {segment.part > 10 && (
                <Progress.Label className="text-sm font-semibold">{segment.part}%</Progress.Label>
            )}
        </Progress.Section>
    ));

    const descriptions = workerStats.map((stat) => (
        <Box
            key={stat.label}
            className="border-b-4 pb-1 flex flex-col"
            style={{ borderBottomColor: stat.color }}
        >
            <Text className="uppercase text-xs text-gray-500 font-bold">{stat.label}</Text>
            <Group className="justify-between items-end mt-1">
                <Text className="font-bold text-sm" style={{ color: stat.color }}>
                    {stat.taskName}
                </Text>
                <Text className="font-bold text-sm" style={{ color: stat.color }}>
                    {stat.part}%
                </Text>
            </Group>
        </Box>
    ));
    const [showStats, setShowStats] = useState(false);

    // Toggle the visibility of the stats section
    const toggleStats = () => setShowStats((prev) => !prev);

    return (
        <Paper className="p-6 w-[100%] bg-white rounded-lg shadow-md border-1 ">
            <Group className="justify-between mb-4 flex flex-row">
                <Group className="items-center flex flex-row">
                    <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                        <Text className="text-1xl font-bold">{worker.name}</Text>
                        <Text className="text-gray-500 text-sm">{worker.role}</Text>
                    </div>
                </Group>
                <div className="flex items-center">
                    <div
                        className={`flex mt-1 text-${worker.iconColor}`}
                        style={{ cursor: 'pointer' }}
                    >
                        {React.cloneElement(worker.icon, { style: { color: worker.iconColor } })}
                    </div>
                </div>
            </Group>

            <Text className="text-1xl justify-center align-center flex font-semibold text-gray-800 mb-2">
                Статистика сотрудника
            </Text>

            <Group className="flex flex-col gap-1">
                <Text className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium text-gray-700">Место:</span>
                    <span className="flex items-center">
                        {worker.position}
                        <div
                            className={`flex ml-1 text-${worker.positionStatusColor} hover:scale-110 transition-transform`}
                            style={{ cursor: 'pointer' }}
                        >
                            {React.cloneElement(worker.positionStatus, {
                                style: { color: worker.positionStatusColor },
                            })}
                        </div>
                    </span>
                </Text>

                <Text className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Средний чек:</span>{' '}
                    {worker.avgCheck}
                </Text>
                <Text className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Продаж:</span> {worker.sales}
                </Text>
                <Text className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Конверсия:</span>{' '}
                    {worker.conversion}
                </Text>
            </Group>

            {/* Mobile View Toggle Section */}
            <div className=" sm:hidden justify-center align-center flex">
                <div
                    className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors mt-4 cursor-pointer"
                    onClick={toggleStats}
                >
                    {/* Toggle Icon with rounded styling */}
                    {showStats ? <FaAngleUp /> : <FaAngleDown />}
                </div>
            </div>

            {/* Task Statistics Section */}
            <div className={`${showStats ? 'block' : 'hidden'} sm:block`}>
                <Text className="text-1xl justify-center align-center flex font-semibold text-gray-800 mt-4">
                    Статистика задач
                </Text>
                <SimpleGrid className="flex flex-col gap-4 h-[250px]">
                    <RadarChart data={data} />
                </SimpleGrid>
                <div className="top-0 mt-[-60px]">
                    <ChartLegend data={data} />
                </div>
                <Text className="text-1xl justify-center align-center flex font-semibold text-gray-800 mt-4">
                    Недельная смена
                </Text>
                <div className="mt-4 h-[100px]">
                    <BubbleChart />
                </div>
            </div>
        </Paper>
    );
};

export default WorkerStatsComp;
