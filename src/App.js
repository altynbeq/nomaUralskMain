import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar } from './components';
import { Dialog } from 'primereact/dialog';
import {
    General,
    Sales,
    ComingSoon,
    Sklad,
    Finance,
    Workers,
    TechProb,
    LogInForm,
    Calendar,
} from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getLeadsBack } from './methods/dataFetches/getLeadsBack';
import { getUserUrls } from './methods/getUserUrls';
import { isValidDepartmentId } from './methods/isValidDepartmentId';
import AccountingWarehouse from './pages/AccountingWarehouse';
import AccountingWorkers from './pages/AccountingWorkers';
import { Loader } from './components/Loader';
import 'primeicons/primeicons.css';
import { MdDescription } from 'react-icons/md';

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
        setUserImage,
    } = useStateContext();

    const [loading, setLoading] = useState(true);
    const [techProblem, setTechProblem] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [urls, setUrls] = useState('');
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInput = React.useRef(null);

    const handleFileUpload = async (event) => {
        const userId = localStorage.getItem('_id');
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                setIsUploading(true);
                const response = await fetch(
                    `https://nomalytica-back.onrender.com/api/subusers/subusers/${userId}/avatar`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to upload avatar');
                }
                const result = await response.json();
                setUserImage(result.image);
                setShowUploadImageModal(false);
            } catch (error) {
                console.error('Error uploading avatar:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUploadButtonClick = () => {
        fileInput.current.click();
    };

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
                    if (!result.image) {
                        setShowUploadImageModal(true);
                    } else {
                        setUserImage(result.image);
                    }
                } catch (error) {
                    console.error('Error fetching sub-user data:', error);
                }
            };
            fetchSubUserImage();
        }
    }, []);

    useEffect(() => {
        const currentUserId = localStorage.getItem('_id');
        const currentToken = localStorage.getItem('token');
        const currentUserDepartmentId = localStorage.getItem('departmentId');
        const userLoggedIn = currentUserId !== null && currentToken !== null;
        setIsLoggedIn(userLoggedIn);

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
            }
        } else {
            setLoading(false);
            setSkeletonUp(false);
        }
    }, [setDeals, setKKM, setLeads, setReceipts, setSkeletonUp, setSpisanie, setUserData]);

    if (techProblem) {
        return <TechProb />;
    }

    if (loading) {
        return <Loader />;
    }

    if (!isLoggedIn) {
        return <LogInForm />;
    }

    const handleModalClose = () => {
        setShowUploadImageModal(false);
    };

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
                    <div
                        className={
                            activeMenu
                                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
                        }
                    >
                        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                            <Navbar />
                        </div>

                        <div>
                            <Routes>
                                <Route path="/" element={<General urls={urls} />} />
                                <Route path="/general" element={<General urls={urls} />} />
                                <Route path="/finance" element={<Finance urls={urls} />} />
                                <Route path="/sales" element={<Sales urls={urls} />} />
                                <Route path="/workers" element={<Workers urls={urls} />} />
                                <Route path="/sklad" element={<Sklad urls={urls} />} />
                                <Route path="/docs" element={<ComingSoon />} />
                                <Route path="/resources" element={<ComingSoon />} />
                                <Route path="/support" element={<ComingSoon />} />
                                <Route path="/Q&A" element={<ComingSoon />} />
                                <Route path="/login" element={<LogInForm />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route
                                    path="/accounting-warehouse"
                                    element={<AccountingWarehouse />}
                                />
                                <Route path="/accounting-workers" element={<AccountingWorkers />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </BrowserRouter>

            <Dialog
                visible={showUploadImageModal}
                onHide={handleModalClose}
                style={{ width: '25vw' }}
                closable={false}
            >
                <p className="text-center text-lg">
                    Пожалуйста загрузите аватарку чтобы продолжить
                </p>
                <div className="flex mt-5 p-8 gap-4 flex-col items-center justify-center w-full border-4 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <MdDescription size={32} className="text-blue-500" />
                    <div className="flex gap-3 justify-center">
                        <button
                            className="py-2 px-3 bg-gray-200 text-black rounded-full hover:bg-blue-600 transition-colors font-medium"
                            onClick={handleUploadButtonClick}
                        >
                            Загрузить аватар
                        </button>
                        <input
                            type="file"
                            ref={fileInput}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*"
                        />
                    </div>
                    {isUploading && <p className="text-gray-500 text-sm mt-2">Загрузка...</p>}
                </div>
                {/* <button
                    onClick={handleModalClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Close
                </button> */}
            </Dialog>
        </div>
    );
};

export default App;
