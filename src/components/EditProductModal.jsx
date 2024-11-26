import React from 'react';

export const EditProductModal = ({ isOpen, onClose, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:text-red-500 hover:bg-gray-300"
                >
                    ✖
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold mb-6">Редактирование</h2>

                {/* Item List */}
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="relative flex items-center">
                            <input
                                type="text"
                                value={item['НоменклатураНаименование']}
                                readOnly
                                className="border border-gray-300 rounded-md p-4 w-full pr-10"
                            />
                            <button
                                onClick={() => console.log(`Editing ${item.name}`)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                            >
                                ✎
                            </button>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Перенести
                    </button>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};
