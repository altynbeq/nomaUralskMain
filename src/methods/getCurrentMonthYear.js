export const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString('ru-RU', { month: 'long' }); // Full month name in Russian
    const year = date.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`; // Capitalize the first letter of the month
};
