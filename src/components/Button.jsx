import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({
    icon,
    bgColor,
    color,
    iconClr,
    bgHoverColor,
    size,
    text,
    borderRadius,
    width,
}) => {
    const { setIsClicked, initialState } = useStateContext();

    return (
        <button
            type="button"
            onClick={() => setIsClicked(initialState)}
            style={{ backgroundColor: bgColor, color, borderRadius }}
            className={`flex flex-row justify-center text-center align-center gap-1 text-${size} px-4 py-1 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
        >
            <div className="text-white">{text}</div>

            <div className={`mt-1 text-${iconClr ? iconClr : 'white'}`}>{icon}</div>
        </button>
    );
};

export default Button;
