import { useEffect } from 'react';

export const GeolocationChecker = ({ qrData, onLocation, onResult }) => {
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    onLocation(coords);
                    validateLocation(coords);
                },
                (error) => {
                    console.error('Geolocation Error: ', error);
                    onResult('Error accessing location');
                },
            );
        } else {
            onResult('Geolocation is not supported by your browser');
        }
    }, [qrData]);

    const validateLocation = (coords) => {
        const officeCoords = { latitude: 40.7128, longitude: -74.006 }; // Replace with actual office coordinates
        const radius = 0.01; // Example radius in degrees

        const isWithinRadius =
            Math.abs(coords.latitude - officeCoords.latitude) <= radius &&
            Math.abs(coords.longitude - officeCoords.longitude) <= radius;

        if (isWithinRadius) {
            onResult('Attendance marked successfully');
        } else {
            onResult('Location mismatch');
        }
    };

    return null;
};
