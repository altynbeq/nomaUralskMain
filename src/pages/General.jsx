import React, { useEffect, useState } from 'react';
import { GeneralCompany } from '../components/General/GeneralCompany';
import { GeneralSubuser } from '../components/General/GeneralSubuser';
import { isValidDepartmentId } from '../methods/isValidDepartmentId';
import { useStateContext } from '../contexts/ContextProvider';

const General = ({ urls }) => {
    const { setProducts, setWarehouses } = useStateContext();
    const [generalType, setGeneralType] = useState();
    useEffect(() => {
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        setGeneralType(isValidDepartmentId(currentUserDepartmentId) ? 'subUser' : 'user');
    }, []);

    useEffect(() => {
        const companyId =
            generalType === 'user'
                ? localStorage.getItem('_id')
                : localStorage.getItem('companyId');
        if (companyId) {
            const fetchCompanyData = async () => {
                try {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/companies/${companyId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setProducts(data.products);
                    if (data.warehouses) {
                        setWarehouses(
                            data.warehouses.map((warehouseName, index) => ({
                                warehouseName,
                                id: index.toString(),
                            })),
                        );
                    }
                } catch (error) {
                    console.error('Error fetching company data:', error);
                }
            };

            fetchCompanyData();
        }
    }, [generalType, setProducts, setWarehouses]);

    return generalType === 'user' ? <GeneralCompany urls={urls} /> : <GeneralSubuser />;
};

export default General;
