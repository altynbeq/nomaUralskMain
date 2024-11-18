import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

import { useStateContext } from '../../contexts/ContextProvider';
import { cartData } from '../../data/dummy';
import { Button } from '../';
import { ExcelReader } from '../../components/Sklad';

const OrdersEditModal = ({ active, setActive }) => {
    const [excelUpload, setExcelUpload] = useState(false);
    const [excelUploadType, setExcelUploadType] = useState('');
    const { currentColor } = useStateContext();

    return (
        <div className=" absolute flex  justify-end   nav-item ">
            <div className=" flex-col flex justify-center border-2 rounded-2xl float-right h-full w-full duration-1000 ease-in-out dark:text-gray-700 transition-all dark:bg-[#484B52] bg-white  p-8">
                <div className="flex justify-center">
                    <div className="flex justify-center">
                        <p className="font-semibold text-lg">Выгрузка данных</p>
                    </div>
                    <div className=" right-0">
                        <button className="p-2" onClick={() => setActive(!active)}>
                            <MdOutlineCancel />
                        </button>
                    </div>
                </div>
                {!excelUpload ? (
                    <div className="mt-5 gap-3 flex flex-col">
                        <button
                            type="button"
                            onClick={() => {
                                setExcelUpload(!excelUpload);
                                setExcelUploadType('newItemAdd');
                            }}
                            style={{
                                backgroundColor: currentColor,
                                color: 'white',
                                borderRadius: '24px',
                            }}
                            className={` text-1xl p-3 hover:drop-shadow-xl hover:bg-${currentColor}`}
                        >
                            Добавить товары
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setExcelUpload(!excelUpload);
                                setExcelUploadType('newItemAdd');
                            }}
                            style={{
                                backgroundColor: currentColor,
                                color: 'white',
                                borderRadius: '24px',
                            }}
                            className={` text-1xl p-3 hover:drop-shadow-xl hover:bg-${currentColor}`}
                        >
                            Новый список
                        </button>
                    </div>
                ) : (
                    <ExcelReader importType={excelUploadType} />
                )}
            </div>
        </div>
    );
};

export default OrdersEditModal;
