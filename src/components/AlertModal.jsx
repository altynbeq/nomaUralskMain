import React from 'react';

const AlertModal = ({ message, open, onClose }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md flex items-center justify-center flex-col">
                <h2 className="text-lg font-semibold mb-4">Внимание</h2>
                <p className="text-gray-700 mb-4 text-center">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Понятно
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
