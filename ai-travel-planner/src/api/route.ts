import api from './index';

export interface Route {
    from_event_id: string;
    to_event_id: string;
    mode: string;
    distance: number;
    duration: number;
    budget: number;
    geometry: any;
    details: string;
    id: string;
    trip_id: string;
}

export interface RouteCreate {
    from_event_id: string;
    to_event_id: string;
    mode: string;
    distance: number;
    duration: number;
    budget: number;
    geometry: any;
    details: string;
}

export const getRoutes = (tripId: string) => {
    return api.get<Route[]>(`/api/trips/${tripId}/routes`);
};

export const createRoute = (tripId: string, route: RouteCreate) => {
    return api.post<Route>(`/api/trips/${tripId}/routes`, route);
};

export const updateRoute = (routeId: string, route: RouteCreate) => {
    return api.put<Route>(`/api/routes/${routeId}`, route);
};

export const deleteRoute = (routeId: string) => {
    return api.delete(`/api/routes/${routeId}`);
};
