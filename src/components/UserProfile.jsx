import React from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';

const UserProfile = () => {
    const { currentColor, handleLogOut, userData, userImage } = useStateContext();

    const userName = userData?.name || 'Unknown User';
    const userEmail = userData?.email || 'Unknown Email';

    return (
        <div className="nav-item absolute right-5 top-16 bg-white subtle-border dark:bg-[#42464D] p-8 rounded-lg w-[90%] md:w-[30%]">
            <div className="flex justify-between text-black items-center">
                <p className="font-semibold text-lg dark:text-gray-200">Профиль</p>
                <Button
                    className="text-black bg-black"
                    icon={<FaRegTimesCircle />}
                    color="white"
                    iconClr="black"
                    size="2xl"
                    borderRadius="50%"
                />
            </div>
            <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
                <img
                    className="rounded-full h-24 w-24"
                    src={userImage ? `https://nomalytica-back.onrender.com${userImage}` : avatar}
                    alt="user-profile"
                />
                <div className="overflow-hidden">
                    <p className="font-semibold text-xl dark:text-gray-200 break-words">
                        {userName}
                    </p>
                    <p className="text-gray-500 text-sm font-semibold dark:text-gray-400 break-words">
                        {userEmail}
                    </p>
                </div>
            </div>
            <div className="mt-5">
                <button
                    type="button"
                    onClick={() => handleLogOut()}
                    style={{ backgroundColor: currentColor }}
                    className={`flex text-white flex-row rounded-2xl justify-center text-center align-center gap-1 px-4 py-1 w-full hover:drop-shadow-xl`}
                >
                    <div className="text-white">Выйти</div>
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
