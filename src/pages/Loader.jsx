import React from 'react';
import loaderIcon from './../data/loaderIcon.gif'; // Adjust the path if necessary

const Loader = () => {
    return (
        <div className="flex items-center justify-center text-center h-screen w-screen">
            <div className="text-center">
                <img src={loaderIcon} alt="Loading..." className="w-22 h-22 mb-4" />
                <p className="text-lg font-semibold">Загрузка...</p>
            </div>
        </div>
    );
};

export default Loader;
