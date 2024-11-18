import { useState } from 'react';
import {
    FaChevronDown,
    FaTrophy,
    FaDollarSign,
    FaFunnelDollar,
    FaSearch,
    FaRegTimesCircle,
} from 'react-icons/fa';

const WorkerInfoModal = ({ isOpen, onClose, worker }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed p-8 md:p-0 mt-5 md:mt-0 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 relative w-full max-w-md">
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                >
                    <FaRegTimesCircle size={20} />
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center align-center justify-center mb-4">
                    <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-20 h-20 rounded-full shadow-md"
                    />
                    {worker.name}
                </div>
                <div className="flex gap-2 flex-wrap items-center align-center justify-center mb-4">
                    <button className="p-1 text-xs  flex flex-row justify-center gap-2 align-center items-center px-2 bg-green-300 rounded-2xl">
                        Best salesman <FaTrophy className=" text-orange-400" />{' '}
                    </button>
                    <button className="p-1 text-xs flex flex-row justify-center gap-2 align-center items-center px-2 bg-green-300 rounded-2xl">
                        Best avg check <FaDollarSign className=" text-orange-400" />{' '}
                    </button>
                    <button className="p-1 text-xs flex flex-row justify-center gap-2 align-center items-center px-2 bg-green-300 rounded-2xl">
                        Best conversion <FaFunnelDollar className=" text-orange-400" />{' '}
                    </button>
                </div>
                {/* Worker Information Form */}
                <div className="space-y-3">
                    {/* <div className="flex flex-col">
              <label className="text-sm text-gray-500 font-medium">Name</label>
              <input
                type="text"
                value={worker.name}
                disabled
                className="w-full px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 text-sm"
              />
            </div> */}

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 font-medium">Job</label>
                        <input
                            type="text"
                            value={worker.job}
                            disabled
                            className="w-full px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 font-medium">Email</label>
                        <input
                            type="email"
                            value={worker.email}
                            disabled
                            className="w-full px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 font-medium">Role</label>
                        <input
                            type="text"
                            value={worker.role}
                            disabled
                            className="w-full px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 font-medium">Last Active</label>
                        <input
                            type="text"
                            value={worker.lastActive}
                            disabled
                            className="w-full px-3 py-1.5 border rounded-lg bg-gray-50 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 font-medium">Status</label>
                        <input
                            type="text"
                            value={worker.active ? 'Active' : 'Disabled'}
                            disabled
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                                worker.active
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-gray-50 text-gray-600'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerInfoModal;
