/**
 * Get multiple route options between two coordinates
 */
import axios from "axios";

const API_KEY = "5b3ce3597851110001cf6248af507074edec4b2a9bbe19c2d107bced";
const BASE_URL = "https://api.openrouteservice.org";

export const getCoordinates = async (location) => {
    try {
        const response = await axios.get(`${BASE_URL}/geocode/search`, {
            params: {
                api_key: API_KEY,
                text: location,
                size: 1
            }
        });

        if (response.data.features.length > 0) {
            const [lng, lat] = response.data.features[0].geometry.coordinates;
            return [lat, lng]; // Return in Leaflet format (lat, lng)
        } else {
            console.error("No coordinates found for", location);
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error.response?.data || error.message);
        return null;
    }
};

export const getRoute = async (start, end) => {
    try {
        const response = await axios.post(`${BASE_URL}/v2/directions/cycling-regular/geojson`, 
            {
                coordinates: [
                    [start[1], start[0]], // Convert (lat, lng) to (lng, lat)
                    [end[1], end[0]]
                ],
                alternative_routes: {
                    target_count: 3, // Request up to 3 routes
                    share_factor: 0.6, // Determines how different alternative routes should be
                    weight_factor: 1.4 // Penalizes longer routes
                }
            },
            {
                headers: {
                    "Authorization": API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching routes:", error.response?.data || error.message);
        return null;
    }
};
