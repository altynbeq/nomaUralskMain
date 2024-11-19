export interface Department {
    id: string;
    name: string;
    link?: string;
    level?: number;
    linkedTo?: string;
}

export enum DEPARTMENT_ANALYTICS_PRIVILEGES {
    Finance = 'Finance',
    Sales = 'Sales',
    Workers = 'Workers',
    Warehouse = 'Warehouse',
}

export enum DEPARTMENT_EDITING_PRIVILEGES {
    Shifts = 'Shifts',
    Warehouse = 'Warehouse',
    Expenses = 'Expenses',
    Workers = 'Workers',
    Allow = 'Allow',
}
