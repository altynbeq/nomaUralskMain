import React, { useEffect, useRef, useState } from 'react';
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
import { useFetch } from '../../../methods/hooks/useFetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: Department;
    tooltipIconsClickHandler: () => void;
}

interface DepartAccesses {
    departmentId: string;
    access: {
        Analytics: Record<string, boolean>;
        DataManagement: boolean;
        _id: string;
    };
    subUsers: Array<{
        role: string;
        image: string | null;
        _id: string;
        email: string;
        name: string;
    }>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    isOpen,
    onClose,
    department,
    tooltipIconsClickHandler,
}) => {
    const modalContentRef = useRef<HTMLDivElement>(null);
    const { isLoading, fetchData, data } = useFetch<DepartAccesses>();

    const [analyticsAccess, setAnalyticsAccess] = useState<
        (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[]
    >([]);
    const [dataEditingAccess, setDataEditingAccess] = useState<
        (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[]
    >([]);
    const [hasAccesses, setHasAccesses] = useState(false);

    if (!isOpen) {
        return null;
    }

    if (!department) {
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (department) {
            try {
                fetchData(`access/access-and-subusers/${department.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch {
                setHasAccesses(false);
            }
        }
    }, [department, fetchData]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (data) {
            const { Analytics, DataManagement } = data.access;

            const analyticsAccessFromBackend = Object.keys(Analytics).filter(
                (key) => Analytics[key] === true,
            ) as (keyof typeof DEPARTMENT_ANALYTICS_PRIVILEGES)[];

            const editingAccessFromBackend: (keyof typeof DEPARTMENT_EDITING_PRIVILEGES)[] =
                DataManagement ? ['Allow'] : [];

            setAnalyticsAccess(analyticsAccessFromBackend);
            setDataEditingAccess(editingAccessFromBackend);
            setHasAccesses(true);
        }
    }, [data]);

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
            DataManagement: editingPrivileges['Allow'],
        };
    };

    const handleSave = async () => {
        const privileges = mapPrivilegesToBackend();
        try {
            await fetchData('access/create-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...privileges, departmentId: department.id }),
            });
            toast.success('Данные сохранены');
            onClose();
        } catch {
            toast.error('Не удалось сохранить, попробуйте еще.');
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
                <ToastContainer position="top-center" autoClose={5000} />
                <div className="flex justify-center items-center">
                    {isLoading ? (
                        <p>Загрузка...</p>
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
