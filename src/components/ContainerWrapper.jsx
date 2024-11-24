import React from 'react';

const ContainerWrapper = ({ children }) => {
    return (
        <div className="w-full md:w-1/3 p-2">
            <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md p-4">
                {children}
            </div>
        </div>
    );
};

export default ContainerWrapper;
