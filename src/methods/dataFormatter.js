import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ru });
};

export const formatOnlyTimeDate = (date) => {
    return format(new Date(date), 'HH:mm', { locale: ru });
};

export const formatOnlyDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: ru });
};
