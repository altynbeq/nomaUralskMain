import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'tailwindcss/tailwind.css';

const ExportToExcel = ({title, data}) => {
  const handleExport = () => {
    // console.log("Export button pressed");

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Get the number of columns
    const columns = Object.keys(data[0] || {});

    // Set the width of all columns to 30 characters
    worksheet['!cols'] = columns.map(() => ({ wch: 30 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write workbook to an array with the bookType 'xlsx'
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `${title}.xlsx`); // Save as .xlsx file
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleExport}
        className="bg-blue-700 text-white p-3 px-4 rounded-2xl hover:bg-blue-500 focus:outline-none"
      >
        Скачать отчет
      </button>
    </div>
  );
};

export default ExportToExcel;
