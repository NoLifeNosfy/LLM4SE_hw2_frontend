import { defineStore } from 'pinia';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../api/route';
import type { Route, RouteCreate } from '../api/route';

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] as Route[],
  }),
  actions: {
    async fetchRoutes(tripId: string) {
      try {
        const response = await getRoutes(tripId);
        this.routes = response.data || [];
      } catch (error) {
        console.error('Failed to fetch routes:', error);
        this.routes = [];
      }
    },
    async addRoute(tripId: string, route: RouteCreate) {
      const response = await createRoute(tripId, route);
      this.routes.push(response.data);
    },
    async editRoute(routeId: string, route: RouteCreate) {
      const response = await updateRoute(routeId, route);
      const index = this.routes.findIndex(r => r.id === routeId);
      if (index !== -1) {
        this.routes[index] = response.data;
      }
    },
    async removeRoute(routeId: string) {
      await deleteRoute(routeId);
      this.routes = this.routes.filter(r => r.id !== routeId);
    },
  },
});
