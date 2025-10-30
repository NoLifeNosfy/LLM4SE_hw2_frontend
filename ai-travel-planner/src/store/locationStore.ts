import { defineStore } from 'pinia';
import { getLocations } from '../api/location';
import type { Location } from '../api/location';

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [] as Location[],
  }),
  actions: {
    async fetchLocations() {
      try {
        const response = await getLocations();
        this.locations = response.data || [];
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        this.locations = [];
      }
    },
  },
  getters: {
    getLocationById: (state) => (id: string) => {
      return state.locations.find(location => location.id === id);
    },
  },
});
