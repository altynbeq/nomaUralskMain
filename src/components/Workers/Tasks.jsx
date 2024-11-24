import React, { useState } from 'react';
import { IoIosMore } from 'react-icons/io';
import { useStateContext } from '../../contexts/ContextProvider';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import AddTask from '../Sklad/AddTask';

const Tasks = ({ data, title }) => {
    const { currentColor, currentMode } = useStateContext();
    const [taskAddActive, setTaskAddActive] = useState(false);

    return (
        <div className="bg-white dark:text-gray-200 w-[90%] md:w-[30%] dark:bg-secondary-dark-bg p-1 ml-1 rounded-2xl subtle-border">
            <div className="flex flex-wrap justify-center">
                <div className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">{title}</p>
                        <button type="button" className="text-xl font-semibold text-gray-500">
                            <IoIosMore />
                        </button>
                    </div>

                    <div className="mt-10 ">
                        {data.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4 w-full">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        style={{ background: item.iconBg }}
                                        className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                                    >
                                        {item.icon}
                                    </button>
                                    <div>
                                        <p className="text-md font-Comfortaa text-400">
                                            {item.title}
                                        </p>
                                        <p className="text-sm font-Comfortaa text-gray-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                                <button className=" rounded-full" type="button">
                                    <FaRegTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>
                    {!taskAddActive ? (
                        <>
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setTaskAddActive(!taskAddActive)}
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
                        <AddTask
                            setTaskAddActive={setTaskAddActive}
                            taskAddActive={taskAddActive}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
