// components/EmployeeCalendar/PaginationControls.jsx
import React, { memo } from 'react';

export const PaginationControls = memo(
    ({ currentPage, totalPages, handlePrevPage, handleNextPage }) => {
        return (
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ml-4 rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    &lt;
                </button>
                <span className="text-gray-700">{`Страница ${currentPage} из ${totalPages || 1}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 mr-4 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    &gt;
                </button>
            </div>
        );
    },
);

PaginationControls.displayName = 'PaginationControls';
