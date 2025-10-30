import { defineStore } from 'pinia';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/event';
import type { Event, EventCreate } from '../api/event';

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
  }),
  actions: {
    async fetchEvents(tripId: string) {
      try {
        const response = await getEvents(tripId);
        this.events = response.data;
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    },
    async addEvent(tripId: string, event: EventCreate) {
      const data = {
        ...event,
        details: JSON.stringify(event.details),
      };
      const response = await createEvent(tripId, data as any);
      this.events.push(response.data);
    },
    async editEvent(eventId: string, event: EventCreate) {
      const data = {
        ...event,
        details: JSON.stringify(event.details),
      };
      const response = await updateEvent(eventId, data as any);
      const index = this.events.findIndex(e => e.id === eventId);
      if (index !== -1) {
        this.events[index] = response.data;
      }
    },
    async removeEvent(eventId: string) {
      await deleteEvent(eventId);
      this.events = this.events.filter(e => e.id !== eventId);
    },
    async addDay(tripId: string) {
      const maxDayIndex = this.events.reduce((max, e) => Math.max(max, e.day_index), 0);
      const newEvent: EventCreate = {
        title: '新事件',
        start_time: '00:00',
        end_time: '00:00',
        type: 'activity',
        budget: 0,
        details: null,
        day_index: maxDayIndex + 1,
        location_id: null
      };
      await this.addEvent(tripId, newEvent);
    },
    async removeDay(dayIndex: number) {
      const eventsToDelete = this.events.filter(e => e.day_index === dayIndex);
      for (const event of eventsToDelete) {
        await this.removeEvent(event.id);
      }
    },
  },
});
