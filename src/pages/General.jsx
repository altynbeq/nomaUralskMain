import React, { useEffect, useState } from 'react';
import { GeneralCompany } from '../components/General/GeneralCompany';
import { GeneralSubuser } from '../components/General/GeneralSubuser';
import { isValidDepartmentId } from '../methods/isValidDepartmentId';

const General = ({ urls }) => {
    const [generalType, setGeneralType] = useState();
    useEffect(() => {
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        setGeneralType(isValidDepartmentId(currentUserDepartmentId) ? 'subUser' : 'user');
    }, []);

    return generalType === 'user' ? <GeneralCompany urls={urls} /> : <GeneralSubuser />;
};

export default General;
