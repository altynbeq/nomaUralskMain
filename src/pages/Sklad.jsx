import React, { useEffect, useState } from 'react';
import SpisanieMonthChart from '../components/Sklad/SpisanieMonthChart';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useStateContext } from '../contexts/ContextProvider';
import TableSort from '../components/demo/TablesList';
import {
    ProductsStats,
    GridSpisanieListRows,
    GridSpisanieListCols,
    SpisanieStats,
    ProductSoldGridList,
    GridProductListCols,
    SpisanieBarSeriesByStore,
} from '../data/MainDataSource';
import { useCompanyStore } from '../store/companyStore';

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const InternalTabs = ({ urls }) => {
    const kkm = useCompanyStore((state) => state.kkm);
    const writeOffs = useCompanyStore((state) => state.writeOffs);
    const { skeletonUp } = useStateContext();
    const [productStats, setProductStats] = useState({});
    const [productsGridRows, setProductGridRows] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [spisanieStats, setSpisanieStats] = useState([]);
    const [spisanieBarSeries, setSpisanieBarSeries] = useState([]);

    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userSpisanieUrl, setUserSpisanieUrl] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (kkm?.monthFormedKKM && writeOffs?.monthSpisanie) {
            setProductGridRows(ProductSoldGridList(kkm.monthFormedKKM));
            setSpisanieStats(SpisanieStats(writeOffs.monthSpisanie));
            setTableRows(GridSpisanieListRows(writeOffs.monthSpisanie));
            setProductStats(ProductsStats(kkm.monthFormedKKM));
            setSpisanieBarSeries(SpisanieBarSeriesByStore(writeOffs.monthSpisanie));
        }
        if (urls?.externalApis && urls?.externalApis?.apiUrlKKM) {
            const convKkm = urls.externalApis.apiUrlKKM
                ? convertUrl(urls.externalApis.apiUrlKKM)
                : null;
            const convReceipt = urls.externalApis.apiUrlReceipts
                ? convertUrl(urls.externalApis.apiUrlReceipts)
                : null;
            const convSpis = urls.externalApis.apiUrlSpisanie
                ? convertUrl(urls.externalApis.apiUrlSpisanie)
                : null;
            if (convKkm != null && convReceipt != null && convSpis != null) {
                setUserKkmUrl(convKkm);
                setUserSpisanieUrl(convSpis);
            }
        }
        window.scrollTo(0, 0);
    }, [kkm?.monthFormedKKM, writeOffs?.monthSpisanie, urls?.externalApis]);

    if (skeletonUp) {
        return (
            <div className="flex mx-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        );
    }

    const tabs = [
        {
            id: 'general',
            label: 'Общая',
        },
        {
            id: 'spisanie',
            label: 'Списания',
        },
        {
            id: 'products',
            label: 'Товар',
        },
    ];

    const tabContents = {
        general: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex mt-5 w-[100%] flex-wrap xs:flex-col  gap-4 justify-center ">
                    <SpisanieMonthChart
                        short={true}
                        userSpisanieUrl={userSpisanieUrl}
                        title="Списания за месяц"
                        series={spisanieBarSeries}
                    />
                </div>
                <div className="flex flex-col  md:w-[100%]  md:flex-row gap-2 justify-center align-center  items-center">
                    <TableSort
                        displayStats={true}
                        width="25%"
                        userKkmUrl={userKkmUrl}
                        spisanieStats={productStats}
                        rows={productsGridRows}
                        columns={GridProductListCols}
                        title="Продано товаров"
                    />
                </div>
                <div className="flex flex-col  md:w-[100%]  md:flex-row gap-2 justify-center align-center  items-center">
                    <TableSort
                        title="Списания"
                        width="25%"
                        spisanieStats={spisanieStats}
                        userSpisanieUrl={userSpisanieUrl}
                        userKkmUrl={userKkmUrl}
                        rows={tableRows}
                        columns={GridSpisanieListCols}
                    />
                </div>
            </div>
        ),
        spisanie: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex mt-5 w-[100%] flex-wrap xs:flex-col  gap-4 justify-center ">
                    <SpisanieMonthChart
                        short={true}
                        userSpisanieUrl={userSpisanieUrl}
                        title="Списания за месяц"
                        series={spisanieBarSeries}
                    />
                </div>
                <div className="flex flex-col  md:w-[100%]  md:flex-row gap-2 justify-center ">
                    <TableSort
                        title="Списания"
                        spisanieStats={spisanieStats}
                        userSpisanieUrl={userSpisanieUrl}
                        userKkmUrl={userKkmUrl}
                        rows={tableRows}
                        columns={GridSpisanieListCols}
                    />
                </div>
            </div>
        ),
        products: (
            <div className="flex flex-col gap-3  justify-center ">
                <h2 className="text-2xl font-bold mb-4">Продажи</h2>
                <p className="text-gray-700">Здесь будет отображаться информация о продажах.</p>
            </div>
        ),
    };

    return (
        <div className="bg-white border-2 max-w-screen border-gray-300 rounded-2xl overflow-hidden">
            {/* Internal Tab Navigation */}
            <div className="border-b border-gray-300">
                <nav className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                            flex-1 py-3 px-3 text-center transition-colors duration-300
                            ${
                                activeTab === tab.id
                                    ? 'bg-blue-800 text-white font-semibold'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }
                            ${activeTab === tab.id ? 'first:rounded-tl-2xl last:rounded-tr-2xl' : ''}
                        `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-2">{tabContents[activeTab]}</div>
        </div>
    );

    // return (
    //     <div className="mt-12 flex w-[100%] flex-col justify-center  align-center gap-8">
    //         <div className="flex mt-5 w-[100%] flex-wrap xs:flex-col  gap-4 justify-center ">
    //             <SpisanieMonthChart
    //                 short={true}
    //                 userSpisanieUrl={userSpisanieUrl}
    //                 title="Списания за месяц"
    //                 series={spisanieBarSeries}
    //             />
    //         </div>
    //         <div className="flex flex-col  md:w-[100%]  md:flex-row gap-2 justify-center align-center  items-center">
    //             <TableSort
    //                 displayStats={true}
    //                 width="25%"
    //                 userKkmUrl={userKkmUrl}
    //                 spisanieStats={productStats}
    //                 rows={productsGridRows}
    //                 columns={GridProductListCols}
    //                 title="Продано товаров"
    //             />
    //         </div>
    //         <div className="flex flex-col  md:flex-row gap-2 justify-center align-center  items-center">
    //             <TableSort
    //                 title="Списания"
    //                 spisanieStats={spisanieStats}
    //                 userSpisanieUrl={userSpisanieUrl}
    //                 userKkmUrl={userKkmUrl}
    //                 rows={tableRows}
    //                 columns={GridSpisanieListCols}
    //             />
    //         </div>
    //     </div>
    // );
};

const Sklad = ({ urls }) => {
    return (
        <div className="min-h-screen flex justify-center align-center bg-gray-100 p-6 w-[100%]">
            <div className="w-[90%]">
                <InternalTabs urls={urls} />
            </div>
        </div>
    );
};

export default Sklad;
