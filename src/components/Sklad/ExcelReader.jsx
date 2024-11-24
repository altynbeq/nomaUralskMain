import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ importType }) => {
    const [jsonData, setJsonData] = useState(null);

    console.log(importType);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            setJsonData(json);
            console.log(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="m-5 flex flex-col justify-center">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>}
        </div>
    );
};

export default ExcelReader;
