import { defineStore } from 'pinia';
import { getLocations, searchLocations, upsertLocation } from '../api/location';
import type { Location } from '../api/location';

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [] as Location[],
    searchResults: [] as Location[],
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
    async searchLocations(query: string, region: string) {
      try {
        const response = await searchLocations(query, region);
        this.searchResults = response.data || [];
      } catch (error) {
        console.error('Failed to search locations:', error);
        this.searchResults = [];
      }
    },
    async upsertLocation(location: Location) {
      try {
        const response = await upsertLocation(location);
        const index = this.locations.findIndex(loc => loc.id === response.data.id);
        if (index !== -1) {
          this.locations[index] = response.data;
        } else {
          this.locations.push(response.data);
        }
        return response.data;
      } catch (error) {
        console.error('Failed to upsert location:', error);
        throw error;
      }
    },
  },
  getters: {
    getLocationById: (state) => (id: string) => {
      return state.locations.find(location => location.id === id);
    },
  },
});
