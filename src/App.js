// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar } from './components';
import { TechProb, LogInForm } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getCompanyData } from './methods/getCompanyData';
import { isValidDepartmentId } from './methods/isValidDepartmentId';
import 'primeicons/primeicons.css';
import { MainContent } from './MainContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './store/authStore';
import { useApi } from './methods/hooks/useApi';
import { axiosInstance } from './api/axiosInstance';

const App = () => {
    const {
        currentMode,
        setLeads,
        setDeals,
        activeMenu,
        setKKM,
        setSkeletonUp,
        setReceipts,
        setSpisanie,
        setUserData,
        setAccess,
        setSubUser,
        setCompanyStructure,
        setProducts,
        setWarehouses,
    } = useStateContext();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const [techProblem, setTechProblem] = useState(false);
    const [urls, setUrls] = useState('');
    const [isQrRedirect, setIsQrRedirect] = useState(false);
    const { get } = useApi();

    const isEmployee = () => {
        const departmentId = localStorage.getItem('departmentId');
        return !!departmentId && isValidDepartmentId(departmentId);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        if (isQr) {
            setIsQrRedirect(true);
        }

        if (!isLoggedIn) {
            return;
        }

        if (user && user.role === 'user') {
            const companyData = getCompanyData(user.id);
            console.log(companyData);
        }

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
    }, []);

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

            setLeads(JSON.parse(companyData.leads));
            setDeals(JSON.parse(companyData.deals));
            setKKM(JSON.parse(companyData.kkmData));
            setReceipts(JSON.parse(companyData.salesReceipt));
            setSpisanie(JSON.parse(companyData.productsSpisanie));
            setUrls(companyData);
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
            setSpisanie(JSON.parse(companyData.productsSpisanie));
            setUrls(companyData);
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    const fetchUserStructure = async () => {
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

        const url = `https://nomalytica-back.onrender.com/api/structure/get-structure-by-userId/${companyId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setCompanyStructure(data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
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
