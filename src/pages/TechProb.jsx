import React from 'react';

const TechProb = () => {
    // Define the size based on screen width

    return (
        <section className="w-[100%] h-screen flex flex-col items-center align-center text-center justify-center bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-blue-800 dark:text-gray-200 mb-4">
                Технические неполадки
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Пожалуйста, попробуйте зайти позже.
            </p>
        </section>
    );
};

export default TechProb;
