import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Настраиваем иконку для маркера
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng); // Передаем координаты родителю
        },
    });
    return null;
};

export const MapPicker = ({
    selectedLocation,
    setSelectedLocation,
    savedSelectedStoreLocation,
}) => {
    useEffect(() => {
        if (savedSelectedStoreLocation) {
            setSelectedLocation(savedSelectedStoreLocation);
        }
    }, [savedSelectedStoreLocation, setSelectedLocation]);

    const handleLocationSelect = (latlng) => {
        setSelectedLocation(latlng);
    };

    return (
        <div>
            <MapContainer
                center={
                    savedSelectedStoreLocation
                        ? [savedSelectedStoreLocation.lat, savedSelectedStoreLocation.lng]
                        : [51.1694, 71.4491] // Центр карты по умолчанию
                }
                zoom={13}
                style={{ height: '300px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {(selectedLocation || savedSelectedStoreLocation) && (
                    <Marker
                        position={[
                            (selectedLocation || savedSelectedStoreLocation).lat,
                            (selectedLocation || savedSelectedStoreLocation).lng,
                        ]}
                    />
                )}
            </MapContainer>
        </div>
    );
};
