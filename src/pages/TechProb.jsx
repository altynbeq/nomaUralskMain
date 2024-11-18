import React from 'react';
import Lottie from 'lottie-react';
import animation from '../data/errorAnimation1.json';

const TechProb = () => {
    const screenWidth = window.innerWidth;

    // Define the size based on screen width
    const size = screenWidth > 768 ? 300 : 150; // 300px for desktop, 150px for mobile

    return (
        <section className="w-[100%] h-screen flex flex-col items-center align-center text-center justify-center bg-gray-100 dark:bg-gray-900">
            <Lottie animationData={animation} loop={true} style={{ width: size, height: size }} />
            <h1 className="text-4xl font-bold text-blue-800 dark:text-gray-200 mb-4">
                Технические неполадки
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Возникли трудности с получением данных из 1С и Bitrix24. Пожалуйста, попробуйте
                зайти позже.
            </p>
        </section>
    );
};

export default TechProb;
