import React from 'react';
import { totalSalesBoxData } from '../../data/salesData';

const BoxTotalStats = () => {
    return (
        <div className="grid xl:justify-center xl:w-full xl:p-8 xl:m-8 xl:pl-0  md:p-50">
            <div className="grid grid-cols-2 gap-10  sm:grid-cols-2 p-5  md:grid-cols-2 lg:grid-cols-4     ">
                {totalSalesBoxData.map((item) => (
                    <div
                        key={item.title}
                        className="   bg-white  h-full md:w-[90%] lg:w-[90%]  dark:text-gray-200 dark:bg-secondary-dark-bg  p-4 pt-9 rounded-2xl flex-shrink-0
              xl:w-full xl:pt-6  xl:pb-7 xl:pr-20 xl:pl-20 2xl:m-15  sm:w-[105%]  xs:p-7
              "
                    >
                        <button
                            type="button"
                            style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                            className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                        >
                            {item.icon}
                        </button>
                        <p className="mt-3">
                            <span className="text-lg font-semibold">{item.amount}</span>
                            <span className={`text-sm text-${item.pcColor} ml-2`}>
                                {item.percentage}
                            </span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoxTotalStats;

{
    /* <div className="flex m-3 flex-wrap justify-center gap-[1.5rem] ml-6 items-center w-full">
{totalSalesBoxData.map((item) => (
  <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-[100%]  p-4 pt-9 rounded-2xl ">
    <button
      type="button"
      style={{ color: item.iconColor, backgroundColor: item.iconBg }}
      className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
    >
      {item.icon}
    </button>
    <p className="mt-3">
      <span className="text-lg font-semibold">{item.amount}</span>
      <span className={`text-sm text-${item.pcColor} ml-2`}>
        {item.percentage}
      </span>
    </p>
    <p className="text-sm text-gray-400  mt-1">{item.title}</p>
  </div>
))}
</div> */
}
