import React from 'react';

export const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-white">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-700 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Загрузка...</p>
            </div>
        </div>
    );
};
