import React from 'react';
import loading from '../data/loading.png';

const ComingSoon = () => {
    return (
        <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md text-center p-4">
                <img src={loading} alt="Coming Soon" className="w-full h-[60%] mb-8" />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Еще в разработке!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Мы усердно работаем, чтобы добавить эту функцию для вас. Следите за
                    обновлениями!
                </p>
            </div>
        </section>
    );
};

export default ComingSoon;
