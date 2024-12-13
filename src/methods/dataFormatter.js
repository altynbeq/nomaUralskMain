// utils/formatDate.js

import { DateTime } from 'luxon';

export const formatDate = (date, pattern = 'dd MMMM yyyy, HH:mm') => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('UTC+5')
        .toFormat(pattern, { locale: 'ru' });
};

export const formatOnlyTimeDate = (date) => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('UTC+5')
        .toFormat('HH:mm', { locale: 'ru' });
};

export const formatOnlyDate = (date) => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('UTC+5')
        .toFormat('dd MMMM yyyy', { locale: 'ru' });
};
