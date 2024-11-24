import { FiBarChart } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';

// data of revenue types online/offline
export const revenueTypesDataSales = [
    { x: 'Online', y: 70, text: '70%' },
    { x: 'Offline', y: 30, text: '30%' },
];

// total data for little boxes
export const totalSalesBoxData = [
    {
        icon: <MdOutlineSupervisorAccount />,
        amount: '39,354',
        percentage: '-4%',
        title: 'Клиенты',
        iconColor: '#03C9D7',
        iconBg: '#E5FAFB',
        pcColor: 'red-600',
    },
    {
        icon: <BsBoxSeam />,
        amount: '4,396',
        percentage: '+23%',
        title: 'Продукты',
        iconColor: 'rgb(255, 244, 229)',
        iconBg: 'rgb(254, 201, 15)',
        pcColor: 'green-600',
    },
    {
        icon: <FiBarChart />,
        amount: '423,39',
        percentage: '+38%',
        title: 'Продажи',
        iconColor: 'rgb(228, 106, 118)',
        iconBg: 'rgb(255, 244, 229)',
        pcColor: 'green-600',
    },
    {
        icon: <BsBoxSeam />,
        amount: '4,396',
        percentage: '+23%',
        title: 'Продукты1',
        iconColor: 'rgb(255, 244, 229)',
        iconBg: 'rgb(254, 201, 15)',
        pcColor: 'green-600',
    },
];

// template
export const lineChartData = [
    [
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
    ],
    [
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
    ],
    [
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
        { x: new Date(2024, 2, 2), y: 24 },
    ],
];

export const lineCustomSeries = [
    {
        dataSource: lineChartData[0],
        xName: 'x',
        yName: 'y',
        name: 'Выручка',
        width: '4',
        marker: { visible: true, width: 10, height: 10 },
        type: 'Line',
    },
    {
        dataSource: lineChartData[1],
        xName: 'x',
        yName: 'y',
        name: 'Средний чек',
        width: '4',
        marker: { visible: true, width: 10, height: 10 },
        type: 'Line',
    },
    {
        dataSource: lineChartData[2],
        xName: 'x',
        yName: 'y',
        name: 'Продажи',
        width: '4',
        marker: { visible: true, width: 10, height: 10 },
        type: 'Line',
    },
];

export const LinePrimaryXAxis = {
    valueType: 'DateTime',
    labelFormat: 'y',
    intervalType: 'Years',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    background: 'white',
};

export const LinePrimaryYAxis = {
    labelFormat: '{value}%',
    rangePadding: 'None',
    minimum: 0,
    maximum: 100,
    interval: 20,
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
};

// staked data weekly

export const stackedChartDataWeekly = [
    [
        { x: 'Понедельник', y: 111.1 },
        { x: 'Вторник', y: 127.3 },
        { x: 'Среда', y: 143.4 },
        { x: 'Четверг', y: 159.9 },
        { x: 'Пятница', y: 159.9 },
        { x: 'Суббота', y: 159.9 },
        { x: 'Воскресение', y: 159.9 },
    ],
    [
        { x: 'Понедельник', y: 11.1 },
        { x: 'Вторник', y: 12.3 },
        { x: 'Среда', y: 14.4 },
        { x: 'Четверг', y: 15.9 },
        { x: 'Пятница', y: 15.9 },
        { x: 'Суббота', y: 15.9 },
        { x: 'Воскресение', y: 15.9 },
    ],
];

export const stackedCustomSeries = [
    {
        dataSource: stackedChartDataWeekly[0],
        xName: 'x',
        yName: 'y',
        name: 'Продажи',
        type: 'StackingColumn',
        background: 'blue',
    },
    {
        dataSource: stackedChartDataWeekly[1],
        xName: 'x',
        yName: 'y',
        name: 'Списание',
        type: 'StackingColumn',
        background: 'red',
    },
];

export const stackedPrimaryXAxis = {
    majorGridLines: { width: 0 },
    minorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    interval: 1,
    lineStyle: { width: 0 },
    labelIntersectAction: 'Rotate45',
    valueType: 'Category',
};

export const stackedPrimaryYAxis = {
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: 400,
    interval: 100,
    majorTickLines: { width: 0 },
    majorGridLines: { width: 1 },
    minorGridLines: { width: 1 },
    minorTickLines: { width: 0 },
    labelFormat: '{value}',
};

// staked data monthly

export const stackedChartDataMonthly = [
    [
        { x: '1', y: 111.1 },
        { x: '2', y: 127.3 },
        { x: '3', y: 143.4 },
        { x: '4', y: 159.9 },
        { x: '5', y: 159.9 },
        { x: '6', y: 159.9 },
        { x: '7', y: 159.9 },
        { x: '8', y: 159.9 },
        { x: '9', y: 159.9 },
        { x: '10', y: 159.9 },
        { x: '11', y: 159.9 },
        { x: '12', y: 159.9 },
        { x: '13', y: 159.9 },
        { x: '14', y: 159.9 },
        { x: '15', y: 159.9 },
    ],
    [
        { x: '1', y: 11.1 },
        { x: '2', y: 12.3 },
        { x: '3', y: 13.4 },
        { x: '4', y: 19.9 },
        { x: '5', y: 19.9 },
        { x: '6', y: 59.9 },
        { x: '7', y: 15.9 },
        { x: '8', y: 19.9 },
        { x: '9', y: 19.9 },
        { x: '10', y: 59.9 },
        { x: '11', y: 19.9 },
        { x: '12', y: 15.9 },
        { x: '13', y: 19.9 },
        { x: '14', y: 59.9 },
        { x: '15', y: 59.9 },
    ],
];

export const stackedCustomSeriesMonthly = [
    {
        dataSource: stackedChartDataMonthly[0],
        xName: 'x',
        yName: 'y',
        name: 'Продажи',
        type: 'StackingColumn',
        background: 'blue',
    },
    {
        dataSource: stackedChartDataMonthly[1],
        xName: 'x',
        yName: 'y',
        name: 'Списание',
        type: 'StackingColumn',
        background: 'red',
    },
];

export const stackedPrimaryYAxisMonthly = {
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: 400,
    interval: 100,
    majorTickLines: { width: 0 },
    majorGridLines: { width: 1 },
    minorGridLines: { width: 1 },
    minorTickLines: { width: 0 },
    labelFormat: '{value}',
};

// stacked data yearly total

export const stackedChartDataYearly = [
    [
        { x: 'Январь', y: 111.1 },
        { x: 'Февраль', y: 127.3 },
        { x: 'Март', y: 143.4 },
        { x: 'Апрель', y: 159.9 },
        { x: 'Май', y: 159.9 },
        { x: 'Июнь', y: 159.9 },
        { x: 'Июль', y: 159.9 },
        { x: 'Август', y: 159.9 },
        { x: 'Сентябрь', y: 159.9 },
        { x: 'Октябрь', y: 159.9 },
        { x: 'Ноябрь', y: 159.9 },
        { x: 'Декабрь', y: 159.9 },
    ],
    [
        { x: 'Январь', y: 11.1 },
        { x: 'Февраль', y: 12.3 },
        { x: 'Март', y: 13.4 },
        { x: 'Апрель', y: 19.9 },
        { x: 'Май', y: 19.9 },
        { x: 'Июнь', y: 59.9 },
        { x: 'Июль', y: 15.9 },
        { x: 'Август', y: 19.9 },
        { x: 'Сентябрь', y: 19.9 },
        { x: 'Октябрь', y: 59.9 },
        { x: 'Ноябрь', y: 19.9 },
        { x: 'Декабрь', y: 15.9 },
    ],
];

export const stackedCustomSeriesYearly = [
    {
        dataSource: stackedChartDataYearly[0],
        xName: 'x',
        yName: 'y',
        name: 'Продажи',
        type: 'StackingColumn',
        background: 'blue',
    },
    {
        dataSource: stackedChartDataYearly[1],
        xName: 'x',
        yName: 'y',
        name: 'Списание',
        type: 'StackingColumn',
        background: 'red',
    },
];

export const stackedPrimaryYAxisYearly = {
    majorGridLines: { width: 0 },
    minorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    interval: 1,
    lineStyle: { width: 0 },
    labelIntersectAction: 'Rotate45',
    valueType: 'Category',
};

export const stackedPrimaryXAxisYearly = {
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: 400,
    interval: 100,
    majorTickLines: { width: 0 },
    majorGridLines: { width: 1 },
    minorGridLines: { width: 1 },
    minorTickLines: { width: 0 },
    labelFormat: '{value}',
};
