import React from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { AnalyticsAccess } from './AnalyticsAccess';
import { DataEditing } from './DataEditing';
import { Button } from '@mantine/core';

export const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="flex flex-col fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative font-comfortaa flex flex-col justify-center gap-10">
                <ProfileModalHeader onClose={onClose} />
                <AnalyticsAccess />
                <DataEditing />
                <div className="flex justify-center items-center">
                    <Button
                        onClick={() => console.log('save')}
                        className="flex w-[50%] justify-center items-center rounded-full border-2 border-blue-500 hover:border-blue-700 py-2"
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};
