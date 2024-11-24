import React from 'react';

import { Button } from '../../components';
import { recentTransactions, dropdownData } from '../../data/ecomData';
import { useStateContext } from '../../contexts/ContextProvider';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const DropDown = ({ currentMode }) => (
    <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
        <DropDownListComponent
            id="time"
            fields={{ text: 'Time', value: 'Id' }}
            style={{ border: 'none', color: currentMode === 'Dark' && 'white' }}
            value="1"
            dataSource={dropdownData}
            popupHeight="220px"
            popupWidth="120px"
        />
    </div>
);

const ThirdRowTransList = () => {
    const { currentColor, currentMode } = useStateContext();
    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 w-[90%] md:w-[30%]  rounded-2xl subtle-border">
            <div className="flex justify-between items-center gap-2">
                <p className="text-xl font-semibold">Последние транзакции</p>
                <DropDown currentMode={currentMode} />
            </div>
            <div className="mt-10 ">
                {recentTransactions.map((item) => (
                    <div key={item.title} className="flex justify-between mt-4">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                style={{
                                    color: item.iconColor,
                                    backgroundColor: item.iconBg,
                                }}
                                className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                            >
                                {item.icon}
                            </button>
                            <div>
                                <p className="text-md font-semibold">{item.title}</p>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                        <p className={`text-${item.pcColor} mr-2`}>{item.amount}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-5 border-t-1 border-color">
                <div className="mt-3">
                    <Button color="white" bgColor={currentColor} text="Add" borderRadius="10px" />
                </div>

                <p className="text-gray-400 text-sm">36 Последние транзакции</p>
            </div>
        </div>
    );
};

export default ThirdRowTransList;
