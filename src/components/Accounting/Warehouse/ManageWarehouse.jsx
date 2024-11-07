import React, { useState } from 'react';
import { MdInsertDriveFile, MdPieChart, MdDescription, MdClose } from 'react-icons/md'; // Replace with appropriate icons

const ManageWarehouse = () => {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const fileInput1 = React.useRef(null);
    const fileInput2 = React.useRef(null);

    const handleFileUpload = (ref) => {
        ref.current.click();
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                        <MdClose size={24} />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    {children}
                </div>
            </div>
        );
    };

    const FormContent = () => (
        <form className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="date"
                        className="w-full rounded-md border border-gray-300 p-2"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Organisation</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter organisation"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Responsible</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter responsible person"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Warehouse</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter warehouse"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter reason"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter amount"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <input
                        type="number"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Enter price"
                    />
                </div>

                {/* Photo Upload / Capture */}
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <p className="text-xs text-gray-500">Upload a photo or take one directly.</p>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="submit"
                    className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                    Submit
                </button>
            </div>
        </form>
    );


    return (
        <div className="w-[90%] mx-auto mt-5 md:mt-0 pt-10 md:pt-0 flex items-center justify-center">
            <div className=" w-full flex flex-col md:flex-row  gap-8">
                {/* First Component */}
                <div className="w-full h-72 bg-white rounded-lg shadow-md p-6 flex flex-col relative">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 absolute top-4 left-6">
                        Добавить поступление
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-4">
                        <div
                            className="flex m-5 p-8 flex-col items-center justify-center w-full  border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <p className="text-gray-600">Drag and drop your files here</p>
                            <div className="flex gap-4 justify-center my-4">
                                <MdInsertDriveFile size={32} className="text-blue-500"/>
                                <MdPieChart size={32} className="text-blue-500"/>
                                <MdDescription size={32} className="text-blue-500"/>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen2(true)}
                                    className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-blue-950 transition-colors font-medium"
                                >
                                    Add
                                </button>
                                <input
                                    type="file"
                                    ref={fileInput2}
                                    className="hidden"
                                    onChange={(e) => console.log(e.target.files[0])}
                                />
                                <button
                                    onClick={() => handleFileUpload(fileInput2)}
                                    className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-blue-950 transition-colors font-medium"
                                >
                                    Upload file
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Component */}
                <div className="w-full h-72 bg-white rounded-lg shadow-md p-6 flex flex-col relative">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 absolute top-4 left-6">
                        Добавить списания
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-4">
                        <div
                            className="flex m-5 p-8 flex-col items-center justify-center w-full  border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <p className="text-gray-600">Drag and drop your files here</p>
                            <div className="flex gap-4 justify-center my-4">
                                <MdInsertDriveFile size={32} className="text-blue-500"/>
                                <MdPieChart size={32} className="text-blue-500"/>
                                <MdDescription size={32} className="text-blue-500"/>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen2(true)}
                                    className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-blue-950 transition-colors font-medium"
                                >
                                    Add
                                </button>
                                <input
                                    type="file"
                                    ref={fileInput2}
                                    className="hidden"
                                    onChange={(e) => console.log(e.target.files[0])}
                                />
                                <button
                                    onClick={() => handleFileUpload(fileInput2)}
                                    className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-blue-950 transition-colors font-medium"
                                >
                                    Upload file
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for first component */}
            <Modal
                isOpen={isModalOpen1}
                onClose={() => setIsModalOpen1(false)}
                title="Добавить поступление"
            >
                <FormContent/>
            </Modal>

            {/* Modal for second component */}
            <Modal
                isOpen={isModalOpen2}
                onClose={() => setIsModalOpen2(false)}
                title="Добавить списания"
            >
                <FormContent/>
            </Modal>
        </div>
    );
};


export default ManageWarehouse