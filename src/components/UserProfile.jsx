import React, { useEffect, useState } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { MdDescription } from 'react-icons/md'; // Replace with appropriate icons

const UserProfile = () => {
    const { currentColor, handleLogOut, userData, userImage } = useStateContext();
    const [isUploading, setIsUploading] = useState(false);

    // Safely access properties of userData
    const userName = userData?.name || 'Unknown User';
    const userEmail = userData?.email || 'Unknown Email';
    const userId = userData?._id || '';
    const fileInput = React.useRef(null);

    const handleFileUpload = async (event) => {
        const userId = localStorage.getItem('_id');
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                setIsUploading(true);
                const response = await fetch(
                    `https://nomalytica-back.onrender.com/api/subusers/subusers/${userId}/avatar`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to upload avatar');
                }
                const result = await response.json();
                console.log('Avatar uploaded successfully:', result);
                alert('Avatar updated successfully!');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Failed to upload avatar');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUploadButtonClick = () => {
        fileInput.current.click();
    };

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
            <div className="flex mt-5 p-8 gap-4 flex-col items-center justify-center w-full border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <MdDescription size={32} className="text-blue-500" />
                <div className="flex gap-3">
                    <button
                        className="py-2 px-3 bg-gray-200 text-black rounded-full hover:bg-blue-600 transition-colors font-medium"
                        onClick={handleUploadButtonClick}
                    >
                        Загрузить аватар
                    </button>
                    <input
                        type="file"
                        ref={fileInput}
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                </div>
                {isUploading && <p className="text-gray-500 text-sm mt-2">Загрузка...</p>}
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
