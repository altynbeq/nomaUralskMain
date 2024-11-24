import React from 'react';
import noaccess from '../data/noaccess.svg';

const NoAccess = () => {
    return (
        <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md text-center p-4">
                <img src={noaccess} alt="Access Denied" className="w-full h-auto mb-8" />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    У вас нету доступа к этому модулю..
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Пожалуйста свяжитесь с вашим директором!
                </p>
            </div>
        </section>
    );
};

export default NoAccess;
