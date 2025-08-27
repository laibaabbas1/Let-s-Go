import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

const planeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3125/3125713.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

function RouteMap({ origin, destination }) {

    const mapCenter = [30.3753, 69.3451];

    // Calculation aur line banane ka lie logic
    let flightPath = null;
    let distance = 0;
    let estimatedTimeHours = 0;

    if (origin && destination) {
        flightPath = [
            [origin.lat, origin.lng],
            [destination.lat, destination.lng]
        ];

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
        estimatedTimeHours = distance / 800;
    }

    const hours = Math.floor(estimatedTimeHours);
    const minutes = Math.round((estimatedTimeHours - hours) * 60);

    return (
        <div className="map-wrapper shadow-sm" style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {origin && (
                    <Marker position={[origin.lat, origin.lng]} icon={planeIcon}>
                        <Popup><b>Origin:</b> {origin.city} ({origin.name})</Popup>
                    </Marker>
                )}
                {destination && (
                    <Marker position={[destination.lat, destination.lng]} icon={planeIcon}>
                        <Popup><b>Destination:</b> {destination.city} ({destination.name})</Popup>
                    </Marker>
                )}
                {flightPath && (
                    <Polyline pathOptions={{ color: 'red', weight: 3, dashArray: '5, 10' }} positions={flightPath} />
                )}
            </MapContainer>

            {/* Default message code  */}
            {(!origin || !destination) && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.8)', padding: '15px 25px', borderRadius: '8px',
                    color: '#333', fontWeight: '500', zIndex: 1000
                }}>
                    Please select Origin and Destination to see the route.
                </div>
            )}

            {/* Distance aur time info code */}
            {origin && destination && (
                <div className="map-info p-2 bg-light text-center" style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 1000 }}>
                    <strong>Distance:</strong> {Math.round(distance)} km | <strong>Estimated Flight Time:</strong> {hours}h {minutes}m
                </div>
            )}
        </div>
    );
}

export default RouteMap;