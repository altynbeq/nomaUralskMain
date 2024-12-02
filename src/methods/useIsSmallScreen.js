import { useState, useEffect } from 'react';

export const useIsSmallScreen = (breakpoint = 768) => {
    const [isSmallScreen, setIsSmallScreen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);

        // Устанавливаем начальное значение
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isSmallScreen;
};
