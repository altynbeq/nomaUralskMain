import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { getCurrentMonthYear } from '../../methods/getCurrentMonthYear';
import avatar from '../../data/avatar.jpg';

export const StorePlanModal = ({ isVisible, onHide, store }) => {
    return (
        <Dialog
            visible={isVisible}
            onHide={onHide}
            header={
                <div className="flex gap-2">
                    <img
                        src={
                            store?.image
                                ? `https://nomalytica-back.onrender.com${store.image}`
                                : avatar
                        }
                        alt={store.storeName}
                        className="w-12 h-12 rounded-full object-cover mb-2"
                    />
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg">
                            {store?.storeName || 'Название магазина'}
                        </h3>
                        <p className="text-sm font-semibold">План на {getCurrentMonthYear()}</p>
                    </div>
                </div>
            }
            style={{ width: '450px' }}
            modal
            closable
        >
            <div className="flex justify-end mt-3">
                <Button label="Добавить" icon="pi pi-plus" className="" />
            </div>
        </Dialog>
    );
};
