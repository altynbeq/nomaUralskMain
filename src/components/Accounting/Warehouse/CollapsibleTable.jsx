import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Calendar } from 'primereact/calendar';

function createData(
    name,
    date,
    totalAmount,
    amount,
    productName,
    organization,
    warehouse,
    reason,
    responsible,
) {
    return {
        name,
        date,
        totalAmount,
        amount,
        productName,
        organization,
        warehouse,
        reason,
        responsible,
        history: [
            {
                date: '2024-11-25',
                totalAmount: '11091700',
                amount: 3,
                productName: 'Roses',
                organization: 'Организация A',
                warehouse: 'Склад 1',
                reason: 'Списание',
                responsible: 'Иванов И.И.',
            },
            {
                date: '2024-11-25',
                totalAmount: '11091700',
                amount: 3,
                productName: 'Roses',
                organization: 'Организация A',
                warehouse: 'Склад 1',
                reason: 'Списание',
                responsible: 'Иванов И.И.',
            },
        ],
    };
}

function Row({ row, onOpenModal }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? '▲' : '▼'}
                    </IconButton>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.totalAmount}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                История
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Количество</TableCell>
                                        <TableCell>Название товара</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => onOpenModal(historyRow)}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            <TableCell>{historyRow.date}</TableCell>
                                            <TableCell>{historyRow.totalAmount}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell>{historyRow.productName}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const rows = [
    createData(
        'Frozen yoghurt',
        '2024-11-25',
        '11091700',
        3,
        'Roses',
        'Организация A',
        'Склад 1',
        'Списание',
        'Иванов И.И.',
    ),
    createData(
        'Frozen yoghurt',
        '2024-11-25',
        '11091700',
        3,
        'Roses',
        'Организация A',
        'Склад 1',
        'Списание',
        'Иванов И.И.',
    ),
    createData(
        'Frozen yoghurt',
        '2024-11-25',
        '11091700',
        3,
        'Roses',
        'Организация A',
        'Склад 1',
        'Списание',
        'Иванов И.И.',
    ),
];

export default function CollapsibleTableWithDetails() {
    const [modalData, setModalData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState(null);

    const handleOpenModal = (data) => {
        setModalData(data);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const filteredRows = rows.filter((row) => {
        const rowDate = new Date(row.date);

        const isWithinDateRange =
            !dateRange ||
            (dateRange[0] &&
                dateRange[1] &&
                rowDate >= new Date(dateRange[0]) &&
                rowDate <= new Date(dateRange[1]));

        return (
            isWithinDateRange &&
            (row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.date.includes(searchQuery))
        );
    });

    return (
        <div className="mx-auto w-[90%]">
            <TableContainer component={Paper} style={{ minHeight: '300px' }}>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-4">
                    <h2 className="text-lg font-bold">Склад</h2>
                    <div className="flex flex-row gap-4 md:gap-4 justify-evenly md:items-center">
                        <div className="w-fit flex flex-row gap-2">
                            <Calendar
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                showIcon
                                dateFormat="yy-mm-dd"
                                placeholder="Дата"
                                className="p-inputtext-sm border border-gray-300 w-fit rounded-lg p-2"
                            />
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                    </div>
                </div>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Название</TableCell>
                            <TableCell align="right">Дата</TableCell>
                            <TableCell align="right">totalAmount</TableCell>
                            <TableCell align="right">Количество</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row, index) => (
                            <Row key={index} row={row} onOpenModal={handleOpenModal} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {modalData && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 relative border border-gray-300 max-w-lg w-full">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-bold mb-4">Детали списания</h2>
                        <p>
                            <strong>Дата:</strong> {modalData.date}
                        </p>
                        <p>
                            <strong>Название товара:</strong> {modalData.productName}
                        </p>
                        <p>
                            <strong>Customer:</strong> {modalData.customerId}
                        </p>
                        <p>
                            <strong>Количество:</strong> {modalData.amount}
                        </p>
                        <p>
                            <strong>Организация:</strong> {modalData.organization}
                        </p>
                        <p>
                            <strong>Склад:</strong> {modalData.warehouse}
                        </p>
                        <p>
                            <strong>Причина:</strong> {modalData.reason}
                        </p>
                        <p>
                            <strong>Ответственный:</strong> {modalData.responsible}
                        </p>
                        <div className="w-20 h-20 bg-gray-300 rounded-lg mt-4 flex items-center justify-center">
                            <span className="text-sm text-gray-500">Фото</span>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// import React from 'react';
// import Box from '@mui/material/Box';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';

// function createData(name, calories, fat, carbs, protein, price) {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//         price,
//         history: [
//             {
//                 date: '2020-01-05',
//                 customerId: '11091700',
//                 amount: 3,
//             },
//             {
//                 date: '2020-01-02',
//                 customerId: 'Anonymous',
//                 amount: 1,
//             },
//         ],
//     };
// }

// function Row({ row }) {
//     const [open, setOpen] = React.useState(false);

//     return (
//         <React.Fragment>
//             <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
//                 <TableCell>
//                     <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//                         {open ? '▲' : '▼'}
//                     </IconButton>
//                 </TableCell>
//                 <TableCell component="th" scope="row">
//                     {row.name}
//                 </TableCell>
//                 <TableCell align="right">{row.calories}</TableCell>
//                 <TableCell align="right">{row.fat}</TableCell>
//                 <TableCell align="right">{row.carbs}</TableCell>
//                 <TableCell align="right">{row.protein}</TableCell>
//             </TableRow>
//             <TableRow>
//                 <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                     <Collapse in={open} timeout="auto" unmountOnExit>
//                         <Box sx={{ margin: 1 }}>
//                             <Typography variant="h6" gutterBottom component="div">
//                                 History
//                             </Typography>
//                             <Table size="small" aria-label="purchases">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Customer</TableCell>
//                                         <TableCell align="right">Amount</TableCell>
//                                         <TableCell align="right">Total price ($)</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {row.history.map((historyRow) => (
//                                         <TableRow key={historyRow.date}>
//                                             <TableCell component="th" scope="row">
//                                                 {historyRow.date}
//                                             </TableCell>
//                                             <TableCell>{historyRow.customerId}</TableCell>
//                                             <TableCell align="right">{historyRow.amount}</TableCell>
//                                             <TableCell align="right">
//                                                 {Math.round(historyRow.amount * row.price * 100) /
//                                                     100}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </Box>
//                     </Collapse>
//                 </TableCell>
//             </TableRow>
//         </React.Fragment>
//     );
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
//     createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
//     createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
//     createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
// ];

// export default function CollapsibleTable() {
//     return (
//         <div className="mx-auto w-[90%]">
//             <TableContainer component={Paper}>
//                 <Table aria-label="collapsible table">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell />
//                             <TableCell>Dessert (100g serving)</TableCell>
//                             <TableCell align="right">Calories</TableCell>
//                             <TableCell align="right">Fat&nbsp;(g)</TableCell>
//                             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//                             <TableCell align="right">Protein&nbsp;(g)</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows.map((row) => (
//                             <Row key={row.name} row={row} />
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     );
// }
