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

function convertUrl(apiUrl) {
    // Replace the base URL with '/api'
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const Sklad = ({ urls }) => {
    const { skeletonUp, kkm, spisanie } = useStateContext();
    const [productStats, setProductStats] = useState({});
    const [productsGridRows, setProductGridRows] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [spisanieStats, setSpisanieStats] = useState([]);
    const [spisanieBarSeries, setSpisanieBarSeries] = useState([]);

    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');
    const [userSpisanieUrl, setUserSpisanieUrl] = useState('');

    useEffect(() => {
        if (kkm.monthFormedKKM && spisanie.monthSpisanie) {
            setProductGridRows(ProductSoldGridList(kkm.monthFormedKKM));
            setSpisanieStats(SpisanieStats(spisanie.monthSpisanie));
            setTableRows(GridSpisanieListRows(spisanie.monthSpisanie));
            setProductStats(ProductsStats(kkm.monthFormedKKM));
            setSpisanieBarSeries(SpisanieBarSeriesByStore(spisanie.monthSpisanie));
        }
        if (urls.externalApis && urls.externalApis.apiUrlKKM) {
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
                setUserReceiptsUrl(convReceipt);
                setUserSpisanieUrl(convSpis);
            }
        }
        window.scrollTo(0, 0);
    }, []);

    if (skeletonUp) {
        return (
            <div className="flex mx-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        );
    }
    return (
        <div className="mt-12 flex w-[100%] flex-col justify-center  align-center gap-8">
            <div className="flex mt-5 w-[100%] flex-wrap xs:flex-col  gap-4 justify-center ">
                <SpisanieMonthChart
                    short={true}
                    userSpisanieUrl={userSpisanieUrl}
                    title="Списания за месяц"
                    series={spisanieBarSeries}
                />
                {/* <ProductStatsComp title="Товары" stats={productStats} /> */}
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
            <div className="flex flex-col  md:flex-row gap-2 justify-center align-center  items-center">
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
    );
};

export default Sklad;
