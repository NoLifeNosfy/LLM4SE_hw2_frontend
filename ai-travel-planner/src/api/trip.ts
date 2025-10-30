import apiClient from './index';

export interface TripCreate {
  title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
}

export const getTrips = () => {
  return apiClient.get('api/trips');
};

export const addTrip = (trip: TripCreate) => {
  return apiClient.post('api/trips', trip);
};

export const deleteTrip = (id: string) => {
  return apiClient.delete(`api/trips/${id}`);
};

export const getTrip = (id: string) => {
  return apiClient.get(`api/trips/${id}`);
};
