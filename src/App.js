import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar } from './components';
import { General, Sales, ComingSoon, Sklad, Finance, Workers, TechProb, LogInForm } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getKKMReceiptsFront } from './methods/dataFetches/getKKM'
import { getSalesReceiptsFront } from './methods/dataFetches/getSalesReceipts'
import { getSpisanie } from './methods/dataFetches/getSpisanie'
import {Loader} from './pages';
import { getLeadsBack } from './methods/dataFetches/getLeadsBack';
import { fetchDeals } from './methods/dataFetches/getDealsBitrix';

const App = () => {
  const {currentMode, setLeads, setDeals, activeMenu, dateRanges,  setKKM, setSkeletonUp, receipts, setReceipts, spisanie, setSpisanie } = useStateContext();
  const [ loading, setLoading ] = useState(true);
  const [ techProblem, setTechProblem ] = useState(false);
  const [ localStorageState, setLocalStorageState] = useState(false)

  useEffect(()=> {
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
    async function collector() {
      try {
        const [ bitrixData, spisanie ] = await Promise.all([
          getLeadsBack(),
          getSpisanie(dateRanges),
        ]);
        setLeads(JSON.parse(bitrixData.leads));
        setDeals(JSON.parse(bitrixData.deals));
        setKKM(JSON.parse(bitrixData.kkmData));
        setReceipts(JSON.parse(bitrixData.salesReceipt));
        setSpisanie(spisanie);
        
        if ( !spisanie ) {
          setTechProblem(true);
          setLoading(false);
          return;
        }
      } finally {
        setLoading(false); 
        setSkeletonUp(false);
      }
    }
    collector();
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
                        <Route path="/" element={<General />} />
                        <Route path="/general" element={ <General /> }/>
                        <Route path="/finance" element={<Finance/>} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/workers" element={ <Workers />} />
                        <Route path="/sklad" element={ <Sklad />} />
                        <Route path="/docs" element={<ComingSoon />} />
                        <Route path="/resources" element={<ComingSoon />} />
                        <Route path="/support" element={<ComingSoon />} />
                        <Route path="/Q&A" element={<ComingSoon />} />
                        <Route path="/login" element={<LogInForm />} />
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