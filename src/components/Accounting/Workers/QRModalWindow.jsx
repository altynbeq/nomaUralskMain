import React from 'react'
import QRCode from 'react-qr-code';
import { Button } from 'primereact/button';

const QRModalWindow = ({ selectedStore, setShowStoreInfoModal }) => {

    const qrRef = useRef(null);

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
    )
}

export default QRModalWindow