import api from './index';

export interface Location {
    name: string;
    address: string;
    geom: {
        type: string;
        coordinates: [number, number];
    };
    place_id: string;
    type: string;
    metadata: any;
    id: string;
}

export const getLocations = () => {
    return api.get<Location[]>('/api/locations');
};
