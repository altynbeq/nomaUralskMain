import React from 'react';

const CustomTooltip = ({ children, text }) => {
    return (
        <div className="relative inline-block group">
            {children}
            <div className="absolute hidden group-hover:block p-2 text-white bg-black rounded-md text-sm">
                {text}
            </div>
        </div>
    );
};

export default CustomTooltip;
