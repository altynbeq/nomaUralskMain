import React, { useState, useEffect } from 'react';
import { Products } from '../components/Accounting/Warehouse/Products';
import { WriteOffs } from '../components/Accounting/Warehouse/WriteOffs';
import { Loader } from '../components/Loader';
import { axiosInstance } from '../api/axiosInstance';
import { useAuthStore, useCompanyStore } from '../store/index';
import SkladBoxStats from '../components/Sklad/SkladBoxStats';
import MoveItemsSklad from '../components/Accounting/Warehouse/MoveItemsSklad';
import InventoryRevision from '../components/Accounting/Warehouse/InventoryRevision';
import ItemsArrival from '../components/Accounting/Warehouse/ItemsArrival';
import WarehouseHistory from '../components/Accounting/Warehouse/WarehouseHistory';
import LatestActionsWarehouse from '../components/Accounting/Warehouse/LatestActionsWarehouse';
import CurrentActions from '../components/Accounting/Warehouse/CurrentActions';
import WriteoffsForApproval from '../components/Accounting/Warehouse/WriteoffsForApproval';

const InternalTabs = () => {
    const clientId = useAuthStore((state) => state.user.companyId);
    const totalProducts = useCompanyStore((state) => state.products)?.length || 0;
    const [isLoading, setIsLoading] = useState(false);
    const [writeOffs, setWriteOffs] = useState([]);
    const [activeTab, setActiveTab] = useState('sklad');

    useEffect(() => {
        (async () => {
            if (!clientId) return;
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/writeOff/${clientId}?status=approved`);
                setWriteOffs(response.data);
            } catch (error) {
                console.error('Ошибка при получении списаний:', error);
                return [];
            } finally {
                setIsLoading(false);
            }
        })();
    }, [clientId]);

    const tabs = [
        { id: 'sklad', label: 'Склад' },
        { id: 'items', label: 'Товары' },
        { id: 'actions', label: 'Действия' },
        { id: 'history', label: 'История' },
    ];

    const tabContents = {
        sklad: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mb-10 p-2">
                    <SkladBoxStats
                        totalProducts={totalProducts}
                        totalWriteOffs={writeOffs.length}
                    />
                    <Products title="Товар близок к мин остатку" filterExceedMinStock={true} />
                    <WriteOffs title="Подтвержденные списания" writeOffs={writeOffs || []} />
                </div>
            </div>
        ),
        items: (
            <div className="flex flex-col gap-3 justify-center">
                <div className=" mb-10 p-2">
                    <Products title="Список товаров" />
                    {/* <WriteOffs writeOffs={writeOffs || []} /> */}
                </div>
            </div>
        ),
        actions: (
            <div className="flex flex-col gap-3 justify-center">
                <div className="flex flex-row mb-2 p-2">
                    <WriteoffsForApproval writeOffs={writeOffs || []} />
                </div>
                <div className="flex flex-row mb-2 p-2">
                    <CurrentActions />
                </div>
                <div className="flex flex-row mb-10 p-2">
                    <MoveItemsSklad />
                </div>
                <div className="flex flex-row mb-10 p-2">
                    <InventoryRevision />
                </div>
                <div className="flex flex-row mb-10 p-2">
                    <ItemsArrival />
                </div>
            </div>
        ),
        history: (
            <div className="flex flex-col gap-1 justify-center">
                <div className="flex flex-row p-2">
                    <WarehouseHistory />
                </div>
                <div className="flex flex-row mb-10 px-6">
                    <LatestActionsWarehouse />
                </div>
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
                                ${
                                    activeTab === tab.id
                                        ? 'first:rounded-tl-2xl last:rounded-tr-2xl'
                                        : ''
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Loader or Content */}
            <div className="p-2 relative min-h-[300px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                        <Loader />
                    </div>
                ) : (
                    tabContents[activeTab]
                )}
            </div>
        </div>
    );
};

const AccountingWarehouse = () => {
    return (
        <div className="min-h-screen flex mt-10 md:px-6 md:mt-0 justify-center align-center bg-gray-100 pt-6 w-[100%]">
            <div className="w-[100%]">
                <InternalTabs />
            </div>
        </div>
    );
};

export default AccountingWarehouse;
