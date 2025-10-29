import { defineStore } from 'pinia';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/event';
import type { Event, EventCreate } from '../api/event';

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
  }),
  actions: {
    async fetchEvents(tripId: string) {
      const response = await getEvents(tripId);
      this.events = response.data;
    },
    async addEvent(tripId: string, event: EventCreate) {
      const response = await createEvent(tripId, event);
      this.events.push(response.data);
    },
    async editEvent(eventId: string, event: EventCreate) {
      const response = await updateEvent(eventId, event);
      const index = this.events.findIndex(e => e.id === eventId);
      if (index !== -1) {
        this.events[index] = response.data;
      }
    },
    async removeEvent(eventId: string) {
      await deleteEvent(eventId);
      this.events = this.events.filter(e => e.id !== eventId);
    },
  },
});
