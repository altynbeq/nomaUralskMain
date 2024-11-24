// import React from 'react'
// import { useStateContext } from '../contexts/ContextProvider';
// import { Pie, LineChart, SparkLine, Stacked, Bar } from '../components';
// import { earningData, earningDataTwo, SparklineAreaData, ecomPieChartData } from '../data/websiteData';
// import  ColorMapping from './Charts/ColorMapping'
// import Pyramid from './Charts/Pyramid';

// const Website = () => {
//     const { currentColor, currentMode } = useStateContext();

//   return (
//     <div className='mt-12 flex flex-col justify-center align-center p-10'>

//          <div className="flex flex-wrap lg:flex-nowrap justify-center">
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
//             <p className="font-semibold text-xl mb-2">Аналитика посещений</p>
//                 <LineChart />
//             </div>
//             <div>
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-4 mr-3 ml-3 ">
//                 <div className="flex justify-between items-center ">
//                 <p className="font-semibold text-white text-2xl">Заработок</p>

//                 <div>
//                     <p className="text-2xl text-white font-semibold mt-8">$63,448.78</p>
//                     <p className="text-gray-200">Месячный заработок</p>
//                 </div>
//                 </div>

//                 <div className="mt-4">
//                 <SparkLine currentColor={currentColor} id="column-sparkLine" height="100px" type="Column" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
//                 </div>
//             </div>

//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10 mt-10">
//                 <div>
//                 <p className="font-semibold text-white text-2xl">Конверсия</p>
//                 <button className='bg-[#e5658f] rounded-2xl p-2 mt-3'>Не успешные</button>
//                 <button className='bg-[#357cd2] rounded-2xl p-2 mt-3'>Успешные</button>
//                 </div>

//                 <div className="w-60">
//                   <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={false} height="160px" width="400px" />
//                 </div>
//             </div>
//             </div>
//         </div>

//         <div className="flex m-3 flex-wrap justify-center gap-2 mt-5 items-center">
//           {earningData.map((item) => (
//             <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-[18rem]  p-4 pt-9 rounded-2xl ">
//               <button
//                 type="button"
//                 style={{ color: item.iconColor, backgroundColor: item.iconBg }}
//                 className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
//               >
//                 {item.icon}
//               </button>
//               <p className="mt-3">
//                 <span className="text-lg font-semibold">{item.amount}</span>
//                 <span className={`text-sm text-${item.pcColor} ml-2`}>
//                   {item.percentage}
//                 </span>
//               </p>
//               <p className="text-sm text-gray-400  mt-1">{item.title}</p>
//             </div>
//           ))}
//         </div>

//         <div className="flex flex-wrap lg:flex-nowrap justify-center mt-5 gap-2">
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-120 md:w-760">
//                 <Pyramid height="100px" width="320"/>
//                 <div className='flex flex-row justify-center'>
//                     {earningDataTwo.map((item) => (
//                         <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-[18rem] ml-4  p-4 rounded-2xl ">
//                         <button
//                             type="button"
//                             style={{ color: item.iconColor, backgroundColor: item.iconBg }}
//                             className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
//                         >
//                             {item.icon}
//                         </button>
//                         <p className="mt-3">
//                             <span className="text-lg font-semibold">{item.amount}</span>
//                             <span className={`text-sm text-${item.pcColor} ml-2`}>
//                             {item.percentage}
//                             </span>
//                         </p>
//                         <p className="text-sm text-gray-400  mt-1">{item.title}</p>
//                         </div>
//                     ))}
//                 </div>

//             </div>
//             <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl  p-10 w-[410px]'>
//                 <Stacked id="stackedChart" currentMode={currentMode} width="320px" height="360px" />
//                 <Bar id="barOne" height="300px" width="340px"/>
//             </div>
//         </div>

//          <div className="flex flex-wrap lg:flex-nowrap justify-center mt-5">
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
//                 <p className="font-semibold text-xl mb-2">Аналитика посещений по часам</p>
//                 <ColorMapping id="hoursChart" />
//             </div>
//             <div>
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-4 mr-3 ml-3 ">
//                 <div className="flex justify-between items-center ">
//                 <p className="font-semibold text-white text-2xl">Заработок</p>

//                 <div>
//                     <p className="text-2xl text-white font-semibold mt-8">$63,448.78</p>
//                     <p className="text-gray-200">Месячный заработок</p>
//                 </div>
//                 </div>

//                 <div className="mt-4 mb-5">
//                 <SparkLine id="column-sparkLine-two" currentColor={currentColor} height="100px" type="Column" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
//                 </div>
//             </div>

//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10 mt-4">
//                 <div>
//                 <p className="font-semibold text-white text-2xl">Устройства</p>
//                 <button className='bg-[#e5658f] rounded-2xl p-2 mt-3'>Не успешные</button>
//                 <button className='bg-[#357cd2] rounded-2xl p-2 mt-3'>Успешные</button>
//                 </div>

//                 <div className="w-40">
//                 <Pie id="pie-chart-two" data={ecomPieChartData} legendVisiblity={false} height="160px" />
//                 </div>
//             </div>
//             <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-10 m-3 flex justify-center items-center gap-10 mt-4">

//             </div>
//             </div>
//         </div>
//     </div>

//   )
// }

// export default Website;
