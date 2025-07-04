// App.js
import './App.css';
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar } from './components';
import { LogInForm } from './pages';
import { useStateContext } from './contexts/ContextProvider';
import { getCompanyData } from './methods/getCompanyData';
import 'primeicons/primeicons.css';
import { MainContent } from './MainContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    useAuthStore,
    useCompanyStore,
    useCompanyStructureStore,
    useSubUserStore,
} from './store/index';
import { axiosInstance } from './api/axiosInstance';

const App = () => {
    const { currentMode, activeMenu, setSkeletonUp } = useStateContext();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const setLeads = useCompanyStore((state) => state.setLeads);
    const setKKM = useCompanyStore((state) => state.setKKM);
    const setReceipts = useCompanyStore((state) => state.setReceipts);
    const setWriteOffs = useCompanyStore((state) => state.setWriteOffs);
    const setProducts = useCompanyStore((state) => state.setProducts);
    const setCategories = useCompanyStore((state) => state.setCategories);
    const setWarehouses = useCompanyStore((state) => state.setWarehouses);
    const setDeals = useCompanyStore((state) => state.setDeals);
    const setDepartments = useCompanyStructureStore((state) => state.setDepartments);
    const setStores = useCompanyStructureStore((state) => state.setStores);
    const setSubUsers = useCompanyStructureStore((state) => state.setSubUsers);
    const setSubUserShifts = useSubUserStore((state) => state.setShifts);
    const [subUserTodayShifts, setSubUserTodayShifts] = useState([]);
    const setSubUser = useSubUserStore((state) => state.setSubUser);
    const [urls, setUrls] = useState('');
    const [isQrRedirect, setIsQrRedirect] = useState(false);

    const isEmployee = useCallback(() => {
        return user?.role === 'subUser';
    }, [user?.role]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        if (isQr) {
            setIsQrRedirect(true);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) return;

            try {
                const companyData = await getCompanyData(
                    user.role === 'user' ? user.id : user.companyId,
                );
                if (!companyData) {
                    return;
                }
                setLeads(JSON.parse(companyData.leads));
                setDeals(JSON.parse(companyData.deals));
                setKKM(JSON.parse(companyData.kkmData));
                setReceipts(JSON.parse(companyData.salesReceipt));
                setWriteOffs(JSON.parse(companyData.productsSpisanie));
                setUrls(companyData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setSkeletonUp(false);
            }
        };

        fetchData();
    }, [isLoggedIn, setDeals, setKKM, setLeads, setReceipts, setSkeletonUp, setWriteOffs, user]);

    useEffect(() => {
        const fetchUserStructure = async () => {
            const companyId = user?.companyId ? user.companyId : user?.id;
            if (!companyId) {
                return;
            }
            const url = `/structure/get-structure-by-userId/${companyId}`;
            try {
                const response = await axiosInstance(url);
                setDepartments(response.data.departments);
                setStores(response.data.stores);
                setSubUsers(response.data.subUsers);
                if (isEmployee()) {
                    const subUser = response.data.subUsers.find((s) => s._id === user?.id);
                    setSubUser(subUser);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchUserStructure();
    }, [
        isEmployee,
        setDepartments,
        setStores,
        setSubUser,
        setSubUserShifts,
        setSubUsers,
        user?.companyId,
        user?.id,
    ]);

    useEffect(() => {
        (async () => {
            if (!user && user?.role !== 'subUser') return;

            try {
                const response = await axiosInstance.get(`/shifts/subUser/${user?.id}`);
                setSubUserShifts(response.data.allShifts);
                setSubUserTodayShifts(response.data.todayShifts);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [setSubUserShifts, setSubUserTodayShifts, user, user?.id, user?.role]);

    useEffect(() => {
        (async () => {
            const companyId = isEmployee() ? user?.companyId : user?.id;

            if (!companyId) {
                return;
            }

            try {
                const response = await axiosInstance.get(`/warehouses/${companyId}`);
                setWarehouses(response.data);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        })();
    }, [isEmployee, setWarehouses, user?.companyId, user?.id]);

    useEffect(() => {
        (async () => {
            const companyId = isEmployee() ? user?.companyId : user?.id;

            if (!companyId) {
                return;
            }

            try {
                const response = await axiosInstance.get(`/category/${companyId}`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        })();
    }, [isEmployee, setCategories, user?.companyId, user?.id]);

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <BrowserRouter>
                {isLoggedIn ? (
                    <div className="flex relative dark:bg-main-dark-bg">
                        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                            <TooltipComponent content="Settings" position="Top" />
                        </div>
                        {activeMenu ? (
                            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                                <Sidebar />
                            </div>
                        ) : (
                            <div className="w-0 dark:bg-secondary-dark-bg">
                                <Sidebar />
                            </div>
                        )}
                        <ToastContainer position="top-center" autoClose={5000} />
                        <MainContent
                            subUserTodayShifts={subUserTodayShifts}
                            urls={urls}
                            activeMenu={activeMenu}
                        />
                    </div>
                ) : (
                    <LogInForm isQrRedirect={isQrRedirect} />
                )}
            </BrowserRouter>
        </div>
    );
};

export default App;
