import React from 'react';
import { GeneralCompany } from '../components/General/GeneralCompany';
import { GeneralSubuser } from '../components/General/GeneralSubuser';
import { useAuthStore } from '../store/authStore';

const General = ({ urls }) => {
    const user = useAuthStore((state) => state.user);
    console.log(user);
    return user?.role === 'user' ? <GeneralCompany urls={urls} /> : <GeneralSubuser />;
};

export default General;
