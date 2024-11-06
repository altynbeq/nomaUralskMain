import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar } from './components';
import { General, Sales, ComingSoon, Sklad, Finance, Workers, TechProb, LogInForm, Calendar } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getKKMReceiptsFront } from './methods/dataFetches/getKKM'
import { getSalesReceiptsFront } from './methods/dataFetches/getSalesReceipts'
import { getSpisanie } from './methods/dataFetches/getSpisanie'
import {Loader} from './pages';
import { getLeadsBack } from './methods/dataFetches/getLeadsBack';
import { fetchDeals } from './methods/dataFetches/getDealsBitrix';
import { getUserUrls } from './methods/getUserUrls';
import AccountingWarehouse from "./pages/AccountingWarehouse";
import AccountingWorkers from "./pages/AccountingWorkers";

const App = () => {
  const {currentMode, setLeads, setDeals, activeMenu, dateRanges,  setKKM, setSkeletonUp, receipts, setReceipts, spisanie, setSpisanie, userData, setUserData  } = useStateContext();
  const [ loading, setLoading ] = useState(true);
  const [ techProblem, setTechProblem ] = useState(false);
  const [ localStorageState, setLocalStorageState] = useState(false)
  const [ urls, setUrls ] = useState("");

  useEffect(()=> {
    const currentUserId = localStorage.getItem('_id');

    const checkStorage =  () => {
    let result = (localStorage.getItem('_id') === null
     && localStorage.getItem('token') === null);
      if (result){
        setLocalStorageState(result)
        // window.location.href ='/general';
      }
      return result;
    };
    checkStorage();
    console.log('checking storage: ' + localStorageState);
    async function collector(userId) {
      try {
        const [ bitrixData, urls  ] = await Promise.all([
          getLeadsBack(userId),
          getUserUrls(userId)
        ]);
        console.log("=>(App.js:45) bitrixData", bitrixData);
        setUserData({
          email: bitrixData.email,
          name: bitrixData.name,
        })

        setLeads(JSON.parse(bitrixData.leads));
        setDeals(JSON.parse(bitrixData.deals));
        setKKM(JSON.parse(bitrixData.kkmData));
        setReceipts(JSON.parse(bitrixData.salesReceipt));
        setSpisanie(JSON.parse(bitrixData.productsSpisanie));

        setUrls(urls);

        console.log(bitrixData)
        if ( !bitrixData ) {
          setTechProblem(true);
          setLoading(false);
          return;
        }
      } finally {
        setLoading(false); 
        setSkeletonUp(false);
      }
    }
      if(currentUserId) {
        collector(currentUserId);
      }
      if(!currentUserId){
        setLoading(false);
        setSkeletonUp(false);
      }
  },  []);

  if(techProblem){
    return <TechProb />
  }

  return (

    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      {loading  ? (
        <Loader />
      ) : (
          localStorageState ? <LogInForm /> : <BrowserRouter>
          <>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
              <TooltipComponent
                content="Settings"
                position="Top"
              >
              </TooltipComponent>
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
                  ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                  : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
              }
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
              
              <div>
                <Routes>
                      <>
                        <Route path="/" element={<General urls={urls} />} />
                        <Route path="/general" element={ <General urls={urls} /> }/>
                        <Route path="/finance" element={<Finance urls={urls} />} />
                        <Route path="/sales" element={<Sales urls={urls} />} />
                        <Route path="/workers" element={ <Workers urls={urls} />} />
                        <Route path="/sklad" element={ <Sklad urls={urls} />} />
                        <Route path="/docs" element={<ComingSoon />} />
                        <Route path="/resources" element={<ComingSoon />} />
                        <Route path="/support" element={<ComingSoon />} />
                        <Route path="/Q&A" element={<ComingSoon />} />
                        <Route path="/login" element={<LogInForm />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/accounting-warehouse" element={<AccountingWarehouse/>} />
                        <Route path="/accounting-workers" element={<AccountingWorkers/>} />
                      </>
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
         </>
        </BrowserRouter>
      )}
      </div>
  )
};

export default App;