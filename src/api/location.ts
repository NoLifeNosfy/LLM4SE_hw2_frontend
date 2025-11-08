import api from './index';

export interface Location {
    name: string;
    address: string;
    lng: number;
    lat: number;
    place_id: string;
    type: string;
    metadata: any;
    id: string;
}

export const getLocations = () => {
    return api.get<Location[]>('/api/locations');
};

export const searchLocations = (query: string, region: string) => {
    return api.get<Location[]>(`/api/map/search_locations?query=${query}&region=${region}`);
};

export const upsertLocation = (location: Location) => {
    return api.post<Location>('/api/locations/upsert', location);
};
