import { axiosInstance } from '../../api/axiosInstance';

export const fetchUserStructure = async ({
    companyId,
    setDepartments,
    setStores,
    setSubUsers,
    setSubUser,
    setSubUserShifts,
    isEmployee,
}) => {
    if (!companyId) {
        console.warn('fetchUserStructure: No companyId provided');
        return;
    }

    const url = `/structure/get-structure-by-userId/${companyId}`;
    try {
        const response = await axiosInstance(url);

        // Set the relevant state for departments, stores, and sub-users
        if (setDepartments) setDepartments(response.data.departments);
        if (setStores) setStores(response.data.stores);
        if (setSubUsers) setSubUsers(response.data.subUsers);

        // If the current user is an employee, set specific subUser and its shifts
        if (isEmployee && setSubUser && setSubUserShifts) {
            const subUser = response.data.subUsers.find((s) => s._id === companyId);
            if (subUser) {
                setSubUser(subUser);
                setSubUserShifts(subUser.shifts || []);
            }
        }

        return response.data; // Return data for optional chaining
    } catch (error) {
        console.error('fetchUserStructure: Failed to fetch data:', error);
        throw new Error('Failed to fetch user structure');
    }
};
