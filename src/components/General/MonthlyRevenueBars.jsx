import React from 'react';

import { SparkLine } from '../../components';
import { SparklineAreaData } from '../../data/ecomData';
import { useStateContext } from '../../contexts/ContextProvider';

const MonthlyRevenueBars = () => {
    const { currentColor, currentMode } = useStateContext();

    return (
        <div className="rounded-2xl  p-4 mx-3 " style={{ backgroundColor: currentColor }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="font-semibold text-white text-2xl">Заработок</p>

                <div className="mt-4 md:mt-0 text-center md:text-right">
                    <p className="text-2xl text-white font-semibold">$63,448.78</p>
                    <p className="text-gray-200">Месячный заработок</p>
                </div>
            </div>

            <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height="100px"
                type="Column"
                width="250px"
                data={SparklineAreaData}
                color="rgb(242, 252, 253)"
            />
        </div>
    );
};

export default MonthlyRevenueBars;
