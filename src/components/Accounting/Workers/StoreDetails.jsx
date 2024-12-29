import { useState, useRef } from 'react';
import { MapPicker } from '../../../components/MapPicker';
import QRCode from 'react-qr-code';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

export const StoreDetails = ({ selectedStore, setShowStoreInfoModal }) => {
    const qrRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGeoSave = async () => {
        if (!selectedLocation || !selectedStore) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(`/stores/update-store/${selectedStore?._id}`, {
                location: selectedLocation,
            });
            if (response.status === 200) {
                setShowStoreInfoModal(false);
                toast.success('Вы успешно обновили гео локацию магазина');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQRDownload = () => {
        if (qrRef.current) {
            try {
                const svg = qrRef.current.querySelector('svg');
                if (!svg) {
                    console.error('QR code SVG not found');
                    return;
                }
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svg);
                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qrcode.svg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="flex gap-5">
            <div className="flex-1 flex flex-col mb-5">
                <h1 className="text-lg font-semibold text-center">Укажите локацию магазина</h1>
                <MapPicker
                    savedSelectedStoreLocation={selectedStore?.location}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />
                <Button
                    disabled={isLoading}
                    className={`${
                        isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                    } mx-auto mt-5 bg-blue-500 text-white rounded p-2 max-w-[180px]`}
                    onClick={() => handleGeoSave()}
                    label="Выбрать локацию"
                />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center" ref={qrRef}>
                <QRCode
                    title="Nomalytica"
                    value={'https://nomalytics-romantic.netlify.app?isQrRedirect=true'}
                    bgColor={'#FFFFFF'}
                    fgColor={'#000000'}
                    size={300}
                />
                <Button
                    className="mt-5 bg-blue-500 text-white rounded p-2"
                    onClick={() => handleQRDownload()}
                    label="Cкачать QR-код"
                />
            </div>
        </div>
    );
};
