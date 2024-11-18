import React, { useRef, useState } from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { AnalyticsAccess } from './AnalyticsAccess';
import { DataEditing } from './DataEditing';
import { EditDepartment } from './EditDepartment';
import { Button } from '@mantine/core';
import {
    Department,
    DEPARTMENT_EDITING_PRIVILEGES,
    DEPARTMENT_ANALYTICS_PRIVILEGES,
} from '../../../models/index';

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

    const [analyticsAccess, setAnalyticsAccess] = useState<
        (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[]
    >([]);
    const [dataEditingAccess, setDataEditingAccess] = useState<
        (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[]
    >([]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const mapPrivilegesToBackend = () => {
        const analyticsPrivileges = Object.keys(DEPARTMENT_ANALYTICS_PRIVILEGES)
            .filter((key) => isNaN(Number(key))) // Оставляем только строковые ключи
            .reduce(
                (acc, key) => {
                    acc[key.toLowerCase()] = analyticsAccess.includes(
                        key as keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES,
                    );
                    return acc;
                },
                {} as Record<string, boolean>,
            );

        const editingPrivileges = Object.keys(DEPARTMENT_EDITING_PRIVILEGES)
            .filter((key) => isNaN(Number(key))) // Оставляем только строковые ключи
            .reduce(
                (acc, key) => {
                    acc[key.toLowerCase()] = dataEditingAccess.includes(
                        key as keyof typeof DEPARTMENT_EDITING_PRIVILEGES,
                    );
                    return acc;
                },
                {} as Record<string, boolean>,
            );

        return {
            analytics: analyticsPrivileges,
            editing: editingPrivileges,
        };
    };

    const handleSave = () => {
        const privileges = mapPrivilegesToBackend();
        console.log(privileges);
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
                <AnalyticsAccess
                    selectedValues={analyticsAccess}
                    setSelectedValues={setAnalyticsAccess}
                />
                <DataEditing
                    selectedValues={dataEditingAccess}
                    setSelectedValues={setDataEditingAccess}
                />
                <div className="flex justify-center items-center">
                    <Button
                        onClick={handleSave}
                        className="flex w-[50%] justify-center items-center rounded-full border-2 border-blue-500 hover:border-blue-700 py-2"
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    );
};
