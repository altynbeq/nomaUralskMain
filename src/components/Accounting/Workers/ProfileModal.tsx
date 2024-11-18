import React, { useRef } from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { AnalyticsAccess } from './AnalyticsAccess';
import { DataEditing } from './DataEditing';
import { EditDepartment } from './EditDepartment';
import { Button } from '@mantine/core';
import { Department } from '../../../models/index';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: Department;
    tooltipIconsClickHandler: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    isOpen,
    onClose,
    user,
    tooltipIconsClickHandler,
}) => {
    const modalContentRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="flex flex-col fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-50"
        >
            <div
                ref={modalContentRef}
                className="bg-white rounded-xl shadow-lg w-[430px] p-6 relative font-comfortaa flex flex-col justify-center gap-10"
            >
                <ProfileModalHeader onClose={onClose} />
                <EditDepartment tooltipIconsClickHandler={tooltipIconsClickHandler} item={user} />
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
