import React, { useState } from 'react';
import ManageWarehouse from "../components/Accounting/Warehouse/ManageWarehouse";
import ListOfExpenses from "../components/Accounting/Warehouse/ListOfExpenses";
import CollapsibleTable from "../components/Accounting/Warehouse/CollapsibleTable";

const AccountingWarehouse = () => {
    return(
        <>
            <ManageWarehouse/>
            <ListOfExpenses/>
            <CollapsibleTable/>
        </>
    )

};

export default AccountingWarehouse;