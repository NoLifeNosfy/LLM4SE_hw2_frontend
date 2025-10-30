import api from './index';
import type { Trip } from './trip';

export interface Event {
    title: string;
    start_time: string;
    end_time: string;
    type: string;
    budget: number;
    details: any;
    day_index: number;
    location_id: string | null;
    id: string;
    trip_id: string;
    expense: number;
    metadata: any;
}

export interface EventCreate {
    title: string;
    start_time: string;
    end_time: string;
    type: string;
    budget: number;
    details: any;
    day_index: number;
    location_id: string | null;
}

export const getEvents = (tripId: string) => {
    return api.get<Event[]>(`/api/trips/${tripId}/events`);
};

export const createEvent = (tripId: string, event: EventCreate) => {
    return api.post<Event>(`/api/trips/${tripId}/events`, event);
};

export const getEvent = (eventId: string) => {
    return api.get<Event>(`/api/events/${eventId}`);
};

export const updateEvent = (eventId: string, event: EventCreate) => {
    return api.put<Event>(`/api/events/${eventId}`, event);
};

export const deleteEvent = (eventId: string) => {
    return api.delete(`/api/events/${eventId}`);
};
