import React from 'react';
import { IoIosMore } from 'react-icons/io';
import { ExportToExcel } from '../';
import { FaFileAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SpisanieStats = ({ idcomponent, title, spisanie, rawSpisanie, width }) => {
    const listObject = spisanie.itemsSpisanie;

    // Convert object to array
    const listArray = Object.entries(listObject).map(([title, amount]) => ({
        title,
        amount,
    }));
    const handleExport = () => {
        console.log('Export button pressed');

        const worksheet = XLSX.utils.json_to_sheet(rawSpisanie);

        // Get the number of columns
        const columns = Object.keys(rawSpisanie[0] || {});

        // Set the width of all columns to 30 characters
        worksheet['!cols'] = columns.map(() => ({ wch: 30 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write workbook to an array with the bookType 'xlsx'
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, `${title}.xlsx`); // Save as .xlsx file
    };

    return (
        <div
            className={`bg-white dark:text-gray-200 justify-center dark:bg-secondary-dark-bg w-[90%] md:w-[27%]  rounded-2xl subtle-border`}
        >
            <div className="flex flex-wrap justify-center">
                <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3 h-[400px] overflow-y-auto">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold">{title}</p>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="text-xl font-semibold text-gray-500 border-2 rounded-2xl p-2"
                        >
                            <FaFileAlt />
                        </button>
                    </div>
                    <div className="mt-10">
                        {listArray && listArray.length > 0 ? (
                            listArray.map((item, index) => (
                                <div key={index} className="flex justify-between mt-4 ">
                                    <div className="flex gap-4">
                                        <p className="text-md font-semibold">{item.title}</p>
                                    </div>

                                    <p className="text-gray-500">{item.amount} шт</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Нету списаний</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpisanieStats;
