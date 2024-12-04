// ContextProvider.js
import React, { createContext, useContext, useState, useMemo } from 'react';
import { getDateRange } from '../methods/getDateRange';

const StateContext = createContext();

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
};

export const ContextProvider = ({ children }) => {
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#1E4DB7');
    const [currentMode, setCurrentMode] = useState('Light');
    const [themeSettings, setThemeSettings] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);
    const [isClicked, setIsClicked] = useState(initialState);
    const [skeletonUp, setSkeletonUp] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [kkm, setKKM] = useState({});
    const [receipts, setReceipts] = useState({});
    const [spisanie, setSpisanie] = useState({});
    const [leads, setLeads] = useState({});
    const [deals, setDeals] = useState({});
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState({});
    const [access, setAccess] = useState({
        Analytics: {},
        DataManagement: false,
    });
    const [subUser, setSubUser] = useState({});
    const [userImage, setUserImage] = useState('');
    const [companyStructure, setCompanyStructure] = useState({});
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [subUserShifts, setSubUserShifts] = useState([]);
    const [isSubuser, setIsSubuser] = useState(false);

    const setMode = (e) => {
        setCurrentMode(e.target.value);
        localStorage.setItem('themeMode', e.target.value);
    };

    const dateRanges = useMemo(() => {
        const dateDay = getDateRange('today');
        const dateWeek = getDateRange('week');
        const dateMonth = getDateRange('month');

        return [dateDay, dateWeek, dateMonth];
    }, []);

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
    };

    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });
    const handleLogin = (id) => {
        setUserId(id);
    };
    const handleLogOut = () => {
        setUserId('');
        localStorage.clear();
        window.location.reload();
    };
    const updateAccessData = (accessData) => {
        setAccess({
            Analytics: accessData.Analytics,
            DataManagement: accessData.DataManagement,
        });
    };
    const updateSubUser = (subUserData) => {
        setSubUser(subUserData);
    };

    // Мемоизация объекта value
    const value = useMemo(
        () => ({
            leads,
            setLeads,
            deals,
            setDeals,
            receipts,
            setReceipts,
            spisanie,
            setSpisanie,
            isLoading,
            setLoading,
            kkm,
            setKKM,
            skeletonUp,
            setSkeletonUp,
            dateRanges,
            currentColor,
            currentMode,
            activeMenu,
            screenSize,
            setScreenSize,
            handleClick,
            isClicked,
            initialState,
            setIsClicked,
            setActiveMenu,
            setCurrentColor,
            setCurrentMode,
            setMode,
            setColor,
            themeSettings,
            setThemeSettings,
            handleLogin,
            userId,
            handleLogOut,
            userData,
            setUserData,
            access,
            setAccess: updateAccessData,
            subUser,
            setSubUser: updateSubUser,
            setUserImage,
            userImage,
            companyStructure,
            setCompanyStructure,
            warehouses,
            setWarehouses,
            products,
            setProducts,
            subUserShifts,
            setSubUserShifts,
        }),
        [
            leads,
            deals,
            receipts,
            spisanie,
            isLoading,
            kkm,
            skeletonUp,
            dateRanges,
            currentColor,
            currentMode,
            activeMenu,
            screenSize,
            isClicked,
            themeSettings,
            userId,
            userData,
            access,
            subUser,
            userImage,
            companyStructure,
            warehouses,
            setWarehouses,
            products,
            setProducts,
            subUserShifts,
            setSubUserShifts,
        ],
    );

    return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
