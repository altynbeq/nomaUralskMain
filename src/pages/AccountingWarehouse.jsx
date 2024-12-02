import React from 'react';
import ManageWarehouse from '../components/Accounting/Warehouse/ManageWarehouse';
import ListOfExpenses from '../components/Accounting/Warehouse/ListOfExpenses';
import CollapsibleTable from '../components/Accounting/Warehouse/CollapsibleTable';

const AccountingWarehouse = () => {
    return (
        <div className="flex flex-col mt-10">
            <ManageWarehouse />
            <ListOfExpenses />
            <CollapsibleTable />
        </div>
    );
};

export default AccountingWarehouse;
