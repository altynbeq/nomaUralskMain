import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from './ListOfExpensesData';

export default function ListOfExpenses() {
    return (<div className="ml-auto mr-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg my-3 p-4 text-center justify-center align-center w-[100%] md:w-[87%]  rounded-2xl subtle-border">
            <div className='flex flex-col justify-between mb-4 '>
                <p className="flex text-[1rem] font-semibold align-left mb-4 ">Список списаний</p>
                <div className="flex flex-wrap border-solid border-1 rounded-xl  px-2 gap-1 w-full">
                    <DataGrid
                        autoHeight
                        checkboxSelection
                        rows={rows}
                        columns={columns}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        initialState={{
                            pagination: { paginationModel: { pageSize: 20 } },
                        }}
                        pageSizeOptions={[10, 20, 50]}
                        disableColumnResize
                        density="compact"
                        slotProps={{
                            filterPanel: {
                                filterFormProps: {
                                    logicOperatorInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                    },
                                    columnInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                        sx: { mt: 'auto' },
                                    },
                                    operatorInputProps: {
                                        variant: 'outlined',
                                        size: 'small',
                                        sx: { mt: 'auto' },
                                    },
                                    valueInputProps: {
                                        InputComponentProps: {
                                            variant: 'outlined',
                                            size: 'small',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>

    );
}