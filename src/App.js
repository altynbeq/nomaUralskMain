import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar } from './components';
import { TechProb, LogInForm } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getLeadsBack } from './methods/dataFetches/getLeadsBack';
import { getUserUrls } from './methods/getUserUrls';
import { isValidDepartmentId } from './methods/isValidDepartmentId';
import { Loader } from './components/Loader';
import 'primeicons/primeicons.css';
import { MainContent } from './MainContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        subUser,
    } = useStateContext();

    const [loading, setLoading] = useState(true);
    const [techProblem, setTechProblem] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [urls, setUrls] = useState('');
    const [isQrRedirect, setIsQrRedirect] = useState(false);

    useEffect(() => {
        const currentUserId = localStorage.getItem('_id');
        const currentToken = localStorage.getItem('token');
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        const userLoggedIn = currentUserId !== null && currentToken !== null;
        setIsLoggedIn(userLoggedIn);

        const searchParams = new URLSearchParams(window.location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true'; // Проверяем наличие параметра isQr=true

        if (isQr) {
            setIsQrRedirect(true);
        }

        const fetchData = async (userId) => {
            try {
                const [bitrixData, urlsData] = await Promise.all([
                    getLeadsBack(userId),
                    getUserUrls(userId),
                ]);

                if (!bitrixData) {
                    setTechProblem(true);
                    return;
                }

                setUserData({
                    email: bitrixData.email,
                    name: bitrixData.name,
                });

                setLeads(JSON.parse(bitrixData.leads));
                setDeals(JSON.parse(bitrixData.deals));
                setKKM(JSON.parse(bitrixData.kkmData));
                setReceipts(JSON.parse(bitrixData.salesReceipt));
                setSpisanie(JSON.parse(bitrixData.productsSpisanie));
                setUrls(urlsData);
            } catch (error) {
                setTechProblem(true);
            } finally {
                setLoading(false);
                setSkeletonUp(false);
            }
        };

        const fetchSubUserData = async (departmentId) => {
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
                const currentUserSubUser = result.subUsers.find(
                    (user) => user._id === currentUserId,
                );

                setUserData({
                    email: currentUserSubUser.email,
                    name: currentUserSubUser.name,
                });

                setAccess(result.access);
                if (currentUserSubUser) {
                    setSubUser(currentUserSubUser);
                }
            } catch (error) {
                console.error('Error fetching sub-user data:', error);
            }
        };

        if (userLoggedIn) {
            if (isValidDepartmentId(currentUserDepartmentId)) {
                fetchSubUserData(currentUserDepartmentId);
                setLoading(false);
                setSkeletonUp(false);
            } else {
                fetchData(currentUserId);
                fetchUserStructure(currentUserId);
            }
        } else {
            setLoading(false);
            setSkeletonUp(false);
        }
    }, [setDeals, setKKM, setLeads, setReceipts, setSkeletonUp, setSpisanie, setUserData]);

    const fetchUserStructure = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/structure/get-structure-by-userId/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setCompanyStructure(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        const companyId = localStorage.getItem('_id');
        if (isValidDepartmentId(currentUserDepartmentId)) {
            fetchCompanyData(subUser.companyId);
        } else {
            fetchCompanyData(companyId);
        }
    }, [subUser]);

    const fetchCompanyData = async (companyId) => {
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

    if (loading) {
        return <Loader />;
    }

    if (!isLoggedIn) {
        return <LogInForm isQrRedirect={isQrRedirect} />;
    }

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <BrowserRouter>
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
