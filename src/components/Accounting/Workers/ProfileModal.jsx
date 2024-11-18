import React from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';

export const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative font-comfortaa">
                {/* Close Button */}
                <ProfileModalHeader onClose={onClose} />

                {/* User Image */}
                {/* <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-gray-600">{user?.email}</p>
                    </div>
                </div> */}

                {/* Role and Department */}
                {/* <div className="mb-4">
                    <p className="text-gray-700">
                        <span className="font-medium">Роль:</span> {user?.role}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Отдел:</span> {user?.department}
                    </p>
                </div> */}

                {/* Delete Button */}
                {/* <div className="flex justify-between items-center mt-6">
                    <button
                        className="w-full flex justify-center items-center gap-2 py-2 bg-white text-black rounded-md hover:bg-red-600 shadow-md"
                        onClick={() => console.log('Delete clicked')}
                    >
                        Удалить
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M4 7h16m-3-3a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H7"
                            />
                        </svg>
                    </button>
                </div> */}
            </div>
        </div>
    );
};
