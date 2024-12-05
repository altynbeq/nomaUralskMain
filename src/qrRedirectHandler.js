// QRRedirectHandler.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';

const QRRedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsQrRedirect } = useStateContext();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isQr = searchParams.get('isQrRedirect') === 'true';

        if (isQr) {
            setIsQrRedirect(true);

            // Удаляем 'isQrRedirect' из query params
            searchParams.delete('isQrRedirect');
            const newSearch = searchParams.toString();
            const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}${location.hash}`;

            // Навигация без добавления новой записи в историю
            navigate(newPath, { replace: true });
        }
    }, [location, navigate, setIsQrRedirect]);

    return null; // Компонент не рендерит ничего
};

export default QRRedirectHandler;
