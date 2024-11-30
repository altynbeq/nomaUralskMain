import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { BsCurrencyDollar, BsShield } from 'react-icons/bs';
import {
    FaShoppingBasket,
    FaDollarSign,
    FaQuestionCircle,
    FaUserTie,
    FaBook,
    FaPhotoVideo,
    FaBoxOpen,
    FaChartLine,
    FaHeadset,
    FaCalendar,
    FaCoins,
} from 'react-icons/fa';
import avatar from './avatar.jpg';
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';

export const links = [
    {
        title: 'аналитика',
        links: [
            {
                name: 'general',
                text: 'Общий обзор',
                icon: <FaChartLine />,
            },
            {
                name: 'finance',
                text: 'Финансы',
                icon: <FaDollarSign />,
            },
            {
                name: 'sales',
                text: 'Продажи',
                icon: <FaShoppingBasket />,
            },
            {
                name: 'workers',
                text: 'Сотрудники',
                icon: <FaUserTie />,
            },
            {
                name: 'sklad',
                text: 'Склад',
                icon: <FaBoxOpen />,
            },
        ],
    },
    {
        title: 'Учёт',
        links: [
            {
                name: 'calendar',
                text: 'Смены',
                icon: <FaCalendar />,
            },
            {
                name: 'accounting-warehouse',
                text: 'Склад',
                icon: <FaBoxOpen />,
            },
            {
                name: 'accounting-expenses',
                text: 'Затраты',
                icon: <FaCoins />,
            },
            {
                name: 'accounting-workers',
                text: 'Сотрудники',
                icon: <FaUserTie />,
            },
        ],
    },
    {
        title: 'Информация',
        links: [
            {
                name: 'docs',
                text: 'Документация',
                icon: <FaBook />,
            },
            {
                name: 'resources',
                text: 'Обучение',
                icon: <FaPhotoVideo />,
            },
        ],
    },
    {
        title: 'Помощь',
        links: [
            {
                name: 'support',
                text: 'Служка поддержки',
                icon: <FaHeadset />,
            },
            {
                name: 'Q&A',
                text: 'Q&A',
                icon: <FaQuestionCircle />,
            },
        ],
    },
];

export const cartData = [
    {
        // image:
        //   product5,
        name: 'butterscotch ice-cream',
        category: 'Milk product',
        price: '$250',
    },
    {
        // image:
        //   product6,
        name: 'Supreme fresh tomato',
        category: 'Vegetable Item',
        price: '$450',
    },
    {
        // image:
        //   product7,
        name: 'Red color candy',
        category: 'Food Item',
        price: '$190',
    },
];

export const chatData = [
    {
        image: avatar2,
        message: 'Roman Joined the Team!',
        desc: 'Congratulate him',
        time: '9:08 AM',
    },
    {
        image: avatar3,
        message: 'New message received',
        desc: 'Salma sent you new message',
        time: '11:56 AM',
    },
    {
        image: avatar4,
        message: 'New Payment received',
        desc: 'Check your earnings',
        time: '4:39 AM',
    },
    {
        image: avatar,
        message: 'Jolly completed tasks',
        desc: 'Assign her new tasks',
        time: '1:12 AM',
    },
];

export const themeColors = [
    {
        name: 'blue-theme',
        color: '#1A97F5',
    },
    {
        name: 'green-theme',
        color: '#03C9D7',
    },
    {
        name: 'purple-theme',
        color: '#7352FF',
    },
    {
        name: 'red-theme',
        color: '#FF5C8E',
    },
    {
        name: 'indigo-theme',
        color: '#1E4DB7',
    },
    {
        color: '#FB9678',
        name: 'orange-theme',
    },
];

export const userProfileData = [
    {
        icon: <BsCurrencyDollar />,
        title: 'Профиль',
        desc: 'Настройка аккаунта',
        iconColor: '#03C9D7',
        iconBg: '#E5FAFB',
    },
    {
        icon: <BsShield />,
        title: 'Почта',
        desc: 'Messages & Emails',
        iconColor: 'rgb(0, 194, 146)',
        iconBg: 'rgb(235, 250, 242)',
    },
    {
        icon: <FiCreditCard />,
        title: 'Подписка',
        desc: 'Оплаты и сроки',
        iconColor: 'rgb(255, 244, 229)',
        iconBg: 'rgb(254, 201, 15)',
    },
];
