export type ShiftStats = {
    subUserId: string;
    name: string;
    email: string;
    storeName: string | null;
    departmentName: string | null;
    totalShifts: number;
    totalWorkedHours: {
        hours: number;
        minutes: number;
    };
    workedTimePercentage: number;
    latePercentage: number;
};
