// App.js
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar } from './components';
import { TechProb, LogInForm } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getCompanyData } from './methods/getCompanyData';
import 'primeicons/primeicons.css';
import { MainContent } from './MainContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    useAuthStore,
    useProfileStore,
    useCompanyStore,
    useCompanyStructureStore,
} from './store/index';
import { axiosInstance } from './api/axiosInstance';

const App = () => {
    const {
        currentMode,
        activeMenu,
        setSkeletonUp,
        setUserData,
        setAccess,
        setSubUser,
        setProducts,
        setWarehouses,
    } = useStateContext();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const setLeads = useCompanyStore((state) => state.setLeads);
    const setKKM = useCompanyStore((state) => state.setKKM);
    const setReceipts = useCompanyStore((state) => state.setReceipts);
    const setWriteOffs = useCompanyStore((state) => state.setWriteOffs);
    const setDeals = useCompanyStore((state) => state.setDeals);
    const setName = useProfileStore((state) => state.setName);
    const setEmail = useProfileStore((state) => state.setEmail);
    const setDepartments = useCompanyStructureStore((state) => state.setDepartments);
    const setStores = useCompanyStructureStore((state) => state.setStores);
    const setSubUsers = useCompanyStructureStore((state) => state.setSubUsers);
    const [techProblem, setTechProblem] = useState(false);
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

            if (user && user.role === 'user') {
                try {
                    const companyData = await getCompanyData(user.id);
                    if (!companyData) {
                        console.error('No company data received');
                        return;
                    }
                    setLeads(JSON.parse(companyData.leads));
                    setDeals(JSON.parse(companyData.deals));
                    setKKM(JSON.parse(companyData.kkmData));
                    setReceipts(JSON.parse(companyData.salesReceipt));
                    setWriteOffs(JSON.parse(companyData.productsSpisanie));
                    setEmail(companyData.email);
                    setName(companyData.name);
                    setUrls(companyData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setSkeletonUp(false);
                }
            }
        };

        fetchData();
    }, [
        isLoggedIn,
        setDeals,
        setEmail,
        setKKM,
        setLeads,
        setName,
        setReceipts,
        setSkeletonUp,
        setWriteOffs,
        user,
    ]);

    useEffect(() => {
        const fetchUserStructure = async () => {
            const companyId = isEmployee() ? '' : user?.id;

            if (!companyId) {
                console.error('Не удалось получить companyId из localStorage.');
                return;
            }

            const url = `/structure/get-structure-by-userId/${companyId}`;
            try {
                const response = await axiosInstance(url);
                setDepartments(response.data.departments);
                setStores(response.data.stores);
                setSubUsers(response.data.subUsers);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchUserStructure();
    }, [isEmployee, setDepartments, setStores, setSubUsers, user?.id]);

    // useEffect(() => {
    // const searchParams = new URLSearchParams(window.location.search);
    // const isQr = searchParams.get('isQrRedirect') === 'true';

    // if (isQr) {
    //     setIsQrRedirect(true);
    // }

    //     if (!isLoggedIn) {
    //         return;
    //     }

    //     if (user && user.role === 'user') {
    //         const fetchCompanyData = async () => {
    //             const companyData = await getCompanyData(user.id); // Добавляем await
    //             if (!companyData) {
    //                 console.error('Failed to fetch company data or companyData is null');
    //                 return;
    //             }
    //             setLeads(JSON.parse(companyData.leads));
    //             setDeals(JSON.parse(companyData.deals));
    //             setKKM(JSON.parse(companyData.kkmData));
    //             setReceipts(JSON.parse(companyData.salesReceipt));
    //             setSpisanie(JSON.parse(companyData.productsSpisanie));
    //             setUrls(companyData);
    //         };
    //         fetchCompanyData();
    //     }

    // const fetchData = async () => {
    //     try {
    //         if (isEmployee()) {
    //             await fetchSubUserData();
    //             await fetchCompanyDataForSubuser();
    //         } else {
    //             await fetchCompanyData();
    //         }
    //         await fetchUserStructure();
    //     } catch (error) {
    //         setTechProblem(true);
    //     } finally {
    //         setSkeletonUp(false);
    //     }
    // };

    // if (isLoggedIn) {
    //     fetchData();
    // } else {
    //     setSkeletonUp(false);
    // }
    // }, []);

    const fetchSubUserData = async () => {
        const departmentId = localStorage.getItem('departmentId');
        const currentUserId = localStorage.getItem('_id');

        if (!departmentId || !currentUserId) {
            return;
        }

        try {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/access/access-and-subusers/${departmentId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            const currentUserSubUser = result.subUsers.find((user) => user._id === currentUserId);

            if (currentUserSubUser) {
                setUserData({
                    email: currentUserSubUser.email,
                    name: currentUserSubUser.name,
                });
                setAccess(result.access);
                setSubUser(currentUserSubUser);
            }
        } catch (error) {
            console.error('Error fetching sub-user data:', error);
        }
    };

    const fetchCompanyData = async (companyId) => {
        if (!companyId) {
            return;
        }

        try {
            const companyData = await getCompanyData(companyId);

            if (!companyData) {
                setTechProblem(true);
                return;
            }

            setUserData({
                email: companyData.email,
                name: companyData.name,
            });
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    const fetchCompanyDataForSubuser = async () => {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
            return;
        }

        try {
            const companyData = await getCompanyData(companyId);

            if (!companyData) {
                setTechProblem(true);
                return;
            }

            setLeads(JSON.parse(companyData.leads));
            setDeals(JSON.parse(companyData.deals));
            setKKM(JSON.parse(companyData.kkmData));
            setReceipts(JSON.parse(companyData.salesReceipt));
            setWriteOffs(JSON.parse(companyData.productsSpisanie));
            setUrls(companyData);
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    const fetchCompanyProductsAndWarehouses = async () => {
        let companyId;

        if (isEmployee()) {
            companyId = localStorage.getItem('companyId');
        } else {
            companyId = localStorage.getItem('_id');
        }

        if (!companyId) {
            console.error('Не удалось получить companyId из localStorage.');
            return;
        }

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

    if (techProblem) {
        return <TechProb />;
    }

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <BrowserRouter>
                {!isLoggedIn && <LogInForm isQrRedirect={isQrRedirect} />};
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
                    <MainContent urls={urls} activeMenu={activeMenu} />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
