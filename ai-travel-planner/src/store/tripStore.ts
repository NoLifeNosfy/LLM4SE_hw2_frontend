import { defineStore } from 'pinia';
import { getTrips, addTrip, deleteTrip, getTrip } from '../api/trip';
import type { TripCreate } from '../api/trip';

export interface Trip {
  title: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  metadata: any;
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTripStore = defineStore('trip', {
  state: () => ({
    trips: [] as Trip[],
  }),
  actions: {
    async fetchTrips() {
      try {
        const response = await getTrips();
        this.trips = response.data;
      } catch (error: any) {
        console.error('Failed to fetch trips:', error);
        throw error.response?.data || error;
      }
    },
    async addTrip(trip: TripCreate) {
      try {
        const response = await addTrip(trip);
        this.trips.push(response.data);
      } catch (error: any) {
        console.error('Failed to add trip:', error);
        throw error.response?.data || error;
      }
    },
    async deleteTrips(ids: string[]) {
      try {
        for (const id of ids) {
          await deleteTrip(id);
        }
      } catch (error: any) {
        console.error('Failed to delete trips:', error);
        throw error.response?.data || error;
      }
    },
    async fetchTrip(id: string) {
      try {
        const response = await getTrip(id);
        const trip = response.data;
        const index = this.trips.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trips[index] = trip;
        } else {
          this.trips.push(trip);
        }
      } catch (error: any) {
        console.error('Failed to fetch trip:', error);
        throw error.response?.data || error;
      }
    },
  },
});
