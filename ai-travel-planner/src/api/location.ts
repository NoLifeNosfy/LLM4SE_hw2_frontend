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
