import React, { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { PaidToAmount } from '../../components/Finance';
import CardWithStats from '../../components/demo/ChartsHolder';
import PeriodStats from '../../components/demo/PeriodStats';
import { StoreSalesPlan } from '../General/StoreSalesPlan';
import { EmplSalesPlans } from '../General/EmplSalesPlans';
import { EmpltSiftStats } from './EmplShiftStats';
import { SetStoresSalesPlan } from './SetStoresSalesPlan';
import { useCompanyStore, useCompanyStructureStore } from '../../store/index';

function convertUrl(apiUrl) {
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

export const GeneralCompany = ({ urls }) => {
    const { skeletonUp } = useStateContext();
    const [ready, setReady] = useState(false);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');
    const { kkm, writeOffs } = useCompanyStore.getState();
    const stores = useCompanyStructureStore((state) => state.stores);

    useEffect(() => {
        if (kkm?.monthFormedKKM && writeOffs?.monthSpisanie) {
            setReady(true);
        }
        if (urls?.externalApis && urls?.externalApis?.apiUrlKKM) {
            const convKkm = urls.externalApis.apiUrlKKM
                ? convertUrl(urls.externalApis.apiUrlKKM)
                : null;
            const convReceipt = urls.externalApis.apiUrlReceipts
                ? convertUrl(urls.externalApis.apiUrlReceipts)
                : null;
            if (convKkm != null && convReceipt != null) {
                setUserKkmUrl(convKkm);
                setUserReceiptsUrl(convReceipt);
            }
        }
    }, [kkm?.monthFormedKKM, urls.externalApis, writeOffs?.monthSpisanie]);

    if (!ready && skeletonUp) {
        return (
            <div className="flex m-10 flex-col gap-6 justify-evenly align-center text-center w-[100%]">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="mt-12 flex flex-col gap-6 align-center w-[100%] justify-center">
            <div className="flex mt-5 gap-10  w-[100%]  flex-col md:flex-row align-center items-center  justify-center align-top">
                <StoreSalesPlan stores={stores} />
                <EmpltSiftStats stores={stores} />
            </div>
            <div className="flex mt-5 gap-10 w-[100%] flex-col md:flex-col justify-center align-top items-center">
                <SetStoresSalesPlan />
                <EmplSalesPlans />
            </div>
            <div className="flex mt-5 gap-4  w-[100%] flex-col md:flex-row  justify-center align-top      items-center">
                <CardWithStats userKkmUrl={userKkmUrl} userReceiptsUrl={userReceiptsUrl} />
            </div>

            <div className="flex w-[100%] flex-wrap  justify-center align-top xs:flex-col    gap-4 items-center">
                <PaidToAmount
                    userReceiptsUrl={userReceiptsUrl}
                    height="520px"
                    comb={true}
                    id="PaidToWeek"
                    title="Выручка"
                />
                <PeriodStats title="Финансы" userKkmUrl={userKkmUrl} />
            </div>
        </div>
    );
};
