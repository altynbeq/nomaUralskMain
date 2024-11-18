import React from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { AnalyticsAccess } from './AnalyticsAccess';
import { DataEditing } from './DataEditing';

export const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="flex flex-col fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[300px] p-6 relative font-comfortaa flex flex-col gap-10">
                <ProfileModalHeader onClose={onClose} />
                <AnalyticsAccess />
                <DataEditing />
            </div>
        </div>
    );
};
