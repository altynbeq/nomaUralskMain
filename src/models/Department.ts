export interface Department {
    id: string;
    name: string;
    link?: string;
    level?: number;
    linkedTo?: string;
}

export enum DEPARTMENT_ANALYTICS_PRIVILEGES {
    FINANCES = 'FINANCES',
    SALES = 'SALES',
    EMPLOYEES = 'EMPLOYEES',
    WAREHOUSE = 'WAREHOUSE',
}

export enum DEPARTMENT_EDITING_PRIVILEGES {
    SHIFTS = 'SHIFTS',
    WAREHOUSE = 'WAREHOUSE',
    EXPENSES = 'EXPENSES',
    EMPLOYEES = 'EMPLOYEES',
}
