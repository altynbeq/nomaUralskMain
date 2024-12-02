import React from 'react';
import ListOfExpenses from '../components/Accounting/Warehouse/ListOfExpenses';
import CollapsibleTable from '../components/Accounting/Warehouse/CollapsibleTable';
import { AddWarehouse } from '../components/Accounting/Warehouse/AddWarehouse';

const AccountingWarehouse = () => {
    return (
        <div className="flex flex-col mt-10">
            <AddWarehouse />
            <ListOfExpenses />
            <CollapsibleTable />
        </div>
    );
};

export default AccountingWarehouse;
