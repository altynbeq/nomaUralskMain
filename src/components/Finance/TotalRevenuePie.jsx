import React from 'react'
import HalfPie from '../ReCharts/HalfPieChart';

const TotalRevenuePie = () => {
  return (
    <div className="bg-white dark:text-gray-200  dark:bg-secondary-dark-bg rounded-2xl p-4 m-3 flex flex-col  items-center  subtle-border">
       
        <div className="w-full h-[120px] mt-5">
          <HalfPie />
        </div>
          <p className="text-gray-400">Your info</p>
          <p className="text-2xl font-semibold ">Demo</p>
    </div>
  )
}

export default TotalRevenuePie