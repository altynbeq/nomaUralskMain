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
import { WorkersShiftsStats } from '../../components/Workers';

function convertUrl(apiUrl) {
    return apiUrl.replace(/^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d+\//, '/api/');
}

const InternalTabs = ({ urls }) => {
    const { skeletonUp } = useStateContext();
    const [ready, setReady] = useState(false);
    const [userKkmUrl, setUserKkmUrl] = useState('');
    const [userReceiptsUrl, setUserReceiptsUrl] = useState('');
    const { kkm, writeOffs } = useCompanyStore.getState();
    const stores = useCompanyStructureStore((state) => state.stores);
    const [activeTab, setActiveTab] = useState('finance');

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

    const tabs = [
        {
            id: 'finance',
            label: 'Финансы',
        },
        {
            id: 'plans',
            label: 'Планы',
        },
        {
            id: 'shifts',
            label: 'Смены',
        },
    ];

    const tabContents = {
        finance: (
            <div>
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
        ),
        plans: (
            <div className="flex flex-col gap-3  justify-center ">
                <div className="flex mt-5 gap-10  w-[100%]  flex-row md:flex-row align-center items-center  justify-center align-top">
                    <StoreSalesPlan stores={stores} />
                    <SetStoresSalesPlan />
                </div>
                <div className="flex mt-5 gap-10 w-[100%] flex-col md:flex-col justify-center align-top items-center">
                    {/* <SetStoresSalesPlan /> */}
                    <EmplSalesPlans />
                </div>
            </div>
        ),
        shifts: (
            <div>
                <div className="flex mt-5 gap-10  w-[100%]  flex-col md:flex-row align-center items-center  justify-center align-top">
                    <EmpltSiftStats stores={stores} />
                </div>
                <div className="flex max-w-screen flex-wrap  gap-5 justify-center">
                    <WorkersShiftsStats />
                </div>
            </div>
        ),
    };

    return (
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
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
            <div className="p-6">{tabContents[activeTab]}</div>
        </div>
    );
};

const GeneralCompany = ({ urls }) => {
    return (
        <div className="min-h-screen flex  justify-center align-center bg-gray-100 p-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs urls={urls} />
            </div>
        </div>
    );
};

export default GeneralCompany;
