// utils/formatDate.js

import { DateTime } from 'luxon';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату в заданной временной зоне.
 * @param {string|Date} date - Дата в формате ISO или объект Date.
 * @param {string} timeZone - Временная зона для форматирования (например, "Asia/Almaty").
 * @param {string} pattern - Формат даты (например, 'dd MMMM yyyy, HH:mm').
 * @returns {string} - Отформатированная дата.
 */
export const formatDate = (date, timeZone, pattern = 'dd MMMM yyyy, HH:mm') => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('Asia/Almaty')
        .toFormat(pattern, { locale: 'ru' });
};

/**
 * Форматирует только время в заданной временной зоне.
 * @param {string|Date} date - Дата в формате ISO или объект Date.
 * @param {string} timeZone - Временная зона для форматирования.
 * @returns {string} - Отформатированное время.
 */
export const formatOnlyTimeDate = (date, timeZone) => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('Asia/Almaty')
        .toFormat('HH:mm', { locale: 'ru' });
};

/**
 * Форматирует только дату в заданной временной зоне.
 * @param {string|Date} date - Дата в формате ISO или объект Date.
 * @param {string} timeZone - Временная зона для форматирования.
 * @returns {string} - Отформатированная дата.
 */
export const formatOnlyDate = (date, timeZone) => {
    if (!date) return '';
    return DateTime.fromISO(date, { zone: 'utc' })
        .setZone('Asia/Almaty')
        .toFormat('dd MMMM yyyy', { locale: 'ru' });
};
