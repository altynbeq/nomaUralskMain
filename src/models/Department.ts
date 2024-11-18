export interface Department {
    id: string;
    name: string;
    link?: string;
    level?: number;
    linkedTo?: string;
}

export enum DEPARTMENT_ANALYTICS_PRIVILEGES {
    FINANCES,
    SALES,
    EMPLOYEES,
    WAREHOUSE,
}

export enum DEPARTMENT_EDITING_PRIVILEGES {
    SHIFTS,
    WAREHOUSE,
    EMPLOYEES,
    EXPENSES,
}
