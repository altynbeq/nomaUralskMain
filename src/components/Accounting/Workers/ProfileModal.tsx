import React, { useRef, useState } from 'react';
import { ProfileModalHeader } from './ProfileModalHeader';
import { AnalyticsAccess } from './AnalyticsAccess';
import { DataEditing } from './DataEditing';
import { EditDepartment } from './EditDepartment';
import { Button, Alert } from '@mantine/core';
import {
    Department,
    DEPARTMENT_EDITING_PRIVILEGES,
    DEPARTMENT_ANALYTICS_PRIVILEGES,
} from '../../../models/index';
import { useFetch } from '../../../methods/hooks/useFetch';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: Department;
    tooltipIconsClickHandler: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    isOpen,
    onClose,
    department,
    tooltipIconsClickHandler,
}) => {
    const modalContentRef = useRef<HTMLDivElement>(null);
    const { isLoading, error, fetchData } = useFetch();

    const [analyticsAccess, setAnalyticsAccess] = useState<
        (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[]
    >([]);
    const [dataEditingAccess, setDataEditingAccess] = useState<
        (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[]
    >([]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const mapPrivilegesToBackend = () => {
        const analyticsPrivileges = Object.keys(DEPARTMENT_ANALYTICS_PRIVILEGES)
            .filter((key) => isNaN(Number(key)))
            .reduce(
                (acc, key) => {
                    acc[key] = analyticsAccess.includes(
                        key as keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES,
                    );
                    return acc;
                },
                {} as Record<string, boolean>,
            );

        const editingPrivileges = Object.keys(DEPARTMENT_EDITING_PRIVILEGES)
            .filter((key) => isNaN(Number(key)))
            .reduce(
                (acc, key) => {
                    acc[key] = dataEditingAccess.includes(
                        key as keyof typeof DEPARTMENT_EDITING_PRIVILEGES,
                    );
                    return acc;
                },
                {} as Record<string, boolean>,
            );

        return {
            Analytics: analyticsPrivileges,
            DataManagement: true,
        };
    };

    const handleSave = async () => {
        const privileges = mapPrivilegesToBackend();

        await fetchData('create-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...privileges, departmentId: department.id }),
        });

        if (error) {
            
            return;
        }

        onClose();
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
                <EditDepartment
                    tooltipIconsClickHandler={tooltipIconsClickHandler}
                    item={department}
                />
                <AnalyticsAccess
                    selectedValues={analyticsAccess}
                    setSelectedValues={setAnalyticsAccess}
                />
                <DataEditing
                    selectedValues={dataEditingAccess}
                    setSelectedValues={setDataEditingAccess}
                />
                <div className="flex justify-center items-center">
                    {isLoading ? (
                        <p>Загрузка</p>
                    ) : (
                        <Button
                            onClick={handleSave}
                            className="flex w-[50%] justify-center items-center rounded-full border-2 border-blue-500 hover:border-blue-700 py-2"
                        >
                            Сохранить
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
