export const isValidDepartmentId = (id) => {
    return id !== null && id !== undefined && id !== 'undefined' && id !== 'null' && id !== '';
};
