import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [ skeletonUp, setSkeletonUp ] = useState(true);
  const [ isLoading, setLoading ] = useState(true);
  const [ kkm, setKKM ] = useState({});
  const [ receipts, setReceipts ] = useState({});
  const [ spisanie, setSpisanie ] = useState({});
  const [ leads, setLeads ] = useState({});
  const [ deals, setDeals ] = useState({});
  const [ userId, setUserId] = useState('');

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };
  
  const dateDay = getDateRange('today');
  const dateWeek = getDateRange('week');
  const dateMonth = getDateRange('month');

  const dateRanges = [dateDay, dateWeek, dateMonth];



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
  }
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ leads, setLeads, deals, setDeals, receipts, setReceipts, spisanie, setSpisanie, isLoading, setLoading, kkm, setKKM, skeletonUp, setSkeletonUp, dateRanges, currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings, handleLogin, userId, handleLogOut }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
