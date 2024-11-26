import React, { useEffect, useState } from 'react';
import { GeneralCompany } from '../components/General/GeneralCompany';
import { GeneralSubuser } from '../components/General/GeneralSubuser';
import { isValidDepartmentId } from '../methods/isValidDepartmentId';
import { useStateContext } from '../contexts/ContextProvider';

const General = ({ urls }) => {
    const { setUserImage } = useStateContext();
    const [generalType, setGeneralType] = useState();
    useEffect(() => {
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        setGeneralType(isValidDepartmentId(currentUserDepartmentId) ? 'subUser' : 'user');
    }, []);

    useEffect(() => {
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        if (isValidDepartmentId(currentUserDepartmentId)) {
            const subuserId = localStorage.getItem('_id');
            const fetchSubUserImage = async () => {
                try {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/subusers/byId/${subuserId}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        },
                    );

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }

                    const result = await response.json();
                    setUserImage(result.image);
                } catch (error) {
                    console.error('Error fetching sub-user data:', error);
                }
            };
            fetchSubUserImage();
        }
    }, []);

    return generalType === 'user' ? <GeneralCompany urls={urls} /> : <GeneralSubuser />;
};

export default General;
