import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar } from './components';
import { General, Sales, ComingSoon, Sklad, Finance, Workers, TechProb } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import { getKKMReceiptsFront } from './methods/dataFetches/getKKM'
import { getSalesReceiptsFront } from './methods/dataFetches/getSalesReceipts'
import { getSpisanie } from './methods/dataFetches/getSpisanie'
import {Loader} from './pages';
import { getDealsBack } from './methods/dataFetches/getDealsBack';
import { getLeadsBack } from './methods/dataFetches/getLeadsBack';

const App = () => {
  const {currentMode, setLeads, setDeals, activeMenu, dateRanges,  setKKM, setSkeletonUp, receipts, setReceipts, spisanie, setSpisanie } = useStateContext();
  const [ loading, setLoading ] = useState(true);
  const [ techProblem, setTechProblem ] = useState(false);

  useEffect(()=> {
    async function collector() {
      try {
        const [ bitrixData, kkm, receipts, spisanie ] = await Promise.all([
          getLeadsBack(),
          getKKMReceiptsFront(dateRanges),
          getSalesReceiptsFront(dateRanges),
          getSpisanie(dateRanges),
        ]);

        setLeads(JSON.parse(bitrixData.leads));
        setDeals(JSON.parse(bitrixData.deals));
        setKKM(kkm);
        setReceipts(receipts);
        setSpisanie(spisanie);
        
        if ( !kkm || !spisanie || !receipts) {
          // console.error("Data is missing or undefined");
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
        <BrowserRouter>
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
                  {/* dashboard  */}
                  <Route path="/" element={<General />} />
                  <Route path="/general" element={ <General /> }/>
                  <Route path="/finance" element={<Finance/>} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/workers" element={ <Workers />} />
                  <Route path="/sklad" element={ <Sklad />} />

                  {/* pages  */}
                  <Route path="/docs" element={<ComingSoon />} />
                  <Route path="/resources" element={<ComingSoon />} />
                  <Route path="/support" element={<ComingSoon />} />
                  <Route path="/Q&A" element={<ComingSoon />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
         </>
        </BrowserRouter>)}
      </div>
  )
};

export default App;