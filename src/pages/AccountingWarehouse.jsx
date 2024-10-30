import React, { useState } from 'react';
import ManageWarehouse from "../components/Accounting/Warehouse/ManageWarehouse";
import ListOfExpenses from "../components/Accounting/Warehouse/ListOfExpenses";

const AccountingWarehouse = () => {
    return(
        <>
            <ManageWarehouse/>
            <ListOfExpenses/>
        </>
    )

};

export default AccountingWarehouse;