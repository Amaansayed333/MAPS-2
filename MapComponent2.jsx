import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { getRoute, getCoordinates } from "../services/orsService2";

const MapComponent2 = () => {
    const [routes, setRoutes] = useState([]); // To store multiple routes
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    const handleGetRoute = async () => {
        if (!startLocation || !endLocation) {
            alert("Please enter both start and end locations.");
            return;
        }

        // Convert locations to coordinates
        const start = await getCoordinates(startLocation);
        const end = await getCoordinates(endLocation);

        if (!start || !end) {
            alert("Could not find coordinates for given locations.");
            return;
        }

        setStartCoords(start);
        setEndCoords(end);

        // Fetch routes
        const data = await getRoute(start, end);
        if (data && data.features.length > 0) {
            const formattedRoutes = data.features.map(feature =>
                feature.geometry.coordinates.map(([lng, lat]) => [lat, lng])
            );
            setRoutes(formattedRoutes);
        } else {
            console.error("No routes found.");
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Enter start location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter end location"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                />
                <button onClick={handleGetRoute}>Get Routes</button>
            </div>

            <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Display Start and End Markers */}
                {startCoords && <Marker position={startCoords}><Popup>Start: {startLocation}</Popup></Marker>}
                {endCoords && <Marker position={endCoords}><Popup>End: {endLocation}</Popup></Marker>}

                {/* Render multiple routes with different colors */}
                {routes.map((route, index) => (
                    <Polyline
                        key={index}
                        positions={route}
                        color={["blue", "green", "red"][index % 3]} // Cycle through colors
                        weight={4}
                        opacity={0.7}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent2;
