import React, { useState } from 'react';
import { IoIosTrash, IoIosMore } from 'react-icons/io';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { useStateContext } from '../../contexts/ContextProvider';
import AddSupport from '../Sklad/AddSupport';

const SupportList = ({ data, title, onDelete, onAdd }) => {
    const { currentColor, currentMode } = useStateContext();
    const [newWorker, setNewWorker] = useState({ title: '', desc: '', iconBg: '', amount: '' });
    const [addSupport, setAddSupport] = useState(false);
    const handleAdd = () => {
        setAddSupport(!addSupport);
    };
    return (
        <div className="bg-white w-[90%] md:w-[30%] dark:text-gray-200 dark:bg-secondary-dark-bg p-1 ml-1 rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">{title}</p>
                        <button
                            type="button"
                            onClick={() => handleAdd()}
                            className="text-xl font-semibold text-gray-500"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    <div className="mt-10 ">
                        {data.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4 w-full">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        // style={{ background: item.iconBg }}
                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                    >
                                        <img
                                            src={item.img}
                                            className="h-[50px] w-[50px] rounded-2xl"
                                        />
                                    </button>
                                    <div>
                                        <p className="text-md font-semibold">{item.title}</p>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className={`text-${item.pcColor}`}>{item.amount}</p>
                                    <button className="ml-2 rounded-full" type="button">
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!addSupport ? (
                        <>
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    style={{
                                        backgroundColor: currentColor,
                                        color: 'white',
                                        borderRadius: '24px',
                                        fontFamily: 'Comfortaa',
                                    }}
                                    className={`flex flex-row gap-2 justify-center align-center text-[16px] p-3 px-8 w-fit-content hover:drop-shadow-xl hover:bg-white `}
                                >
                                    Добавить
                                    <div className="flex mt-1">
                                        <FaPlus />
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <AddSupport addSupport={addSupport} handleAdd={handleAdd} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportList;
