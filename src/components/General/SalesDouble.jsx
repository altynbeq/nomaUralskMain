import React from 'react';
import { Stacked, Button, SparkLine, ExportToExcel } from '../../components';
import { SparklineAreaData } from '../../data/ecomData';
import { useStateContext } from '../../contexts/ContextProvider';
import {
    stackedCustomSeries,
    stackedPrimaryXAxis,
    stackedPrimaryYAxis,
} from '../../data/salesData';

const SalesDouble = () => {
    const { currentColor, currentMode } = useStateContext();
    return (
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg mx-3 p-4 w-[90%] md:w-[60%] rounded-2xl subtle-border">
            <div className="flex flex-col md:flex-row justify-between">
                <p className="font-semibold text-xl">Обновления по FIN</p>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                        <span>Затраты</span>
                    </p>
                    <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                        <span>Бюджет</span>
                    </p>
                </div>
            </div>
            <div className="mt-10 flex flex-col lg:flex-row gap-10 justify-center">
                <div className="border-r-1 border-color m-4 pr-10">
                    <div>
                        <p>
                            <span className="text-3xl font-semibold">$93,438</span>
                            <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                                23%
                            </span>
                        </p>
                        <p className="text-gray-500 mt-1">Бюджет</p>
                    </div>
                    <div className="mt-8">
                        <p className="text-3xl font-semibold">$48,487</p>
                        <p className="text-gray-500 mt-1">Затраты</p>
                    </div>
                    <div className="mt-5">
                        <SparkLine
                            currentColor={currentColor}
                            id="line-sparkLine"
                            type="Line"
                            height="80px"
                            data={SparklineAreaData}
                            color={currentColor}
                        />
                    </div>
                    <div className="mt-10">
                        {/* <Button
                    color="white"
                    bgColor={currentColor}
                    text="Скачать отчет"
                    borderRadius="10px"
                    /> */}
                        <ExportToExcel />
                    </div>
                </div>
                <div className="m-auto lg:m-0">
                    <Stacked
                        stackedCustomSeries={stackedCustomSeries}
                        stackedPrimaryXAxis={stackedPrimaryXAxis}
                        stackedPrimaryYAxis={stackedPrimaryYAxis}
                        currentMode={currentMode}
                        width="320px"
                        height="360px"
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesDouble;

{
    /* <div className="bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
            <div className="flex justify-between">
                <p className="font-semibold text-xl">Обновления по доходам</p>
                <div className="flex items-center gap-4">
                <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                    <span>

                    </span>
                    <span>Затраты</span>
                </p>
                <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                    <span>

                    </span>
                    <span>Бюджет</span>
                </p>
                </div>
            </div>
            <div className="mt-10 gap-10  justify-center">
                <div className=" border-r-1 border-color m-4 pr-10">

                    <div>
                        <p>
                        <span className="text-3xl font-semibold">$93,438</span>
                        <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                            23%
                        </span>
                        </p>
                        <p className="text-gray-500 mt-1">Бюджет</p>
                    </div>

                    <div className="mt-8">
                        <p className="text-3xl font-semibold">$48,487</p>

                        <p className="text-gray-500 mt-1">Затраты</p>
                    </div>

                    <div className="mt-5">
                        <SparkLine currentColor={currentColor} id="line-sparkLine" type="Line" height="80px" width="250px" data={SparklineAreaData} color={currentColor} />
                    </div>

                    <div className="mt-10">
                        <Button
                        color="white"
                        bgColor={currentColor}
                        text="Скачать отчет"
                        borderRadius="10px"
                        />
                    </div>
                </div>
                <div>
                    <Stacked stackedCustomSeries={stackedCustomSeries} stackedPrimaryXAxis={stackedPrimaryXAxis} stackedPrimaryYAxis={stackedPrimaryYAxis} currentMode={currentMode} width="320px" height="360px" />
                </div>
            </div>
        </div> */
}
