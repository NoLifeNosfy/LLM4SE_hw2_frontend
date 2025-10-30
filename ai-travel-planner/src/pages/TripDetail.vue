<template>
  <div class="trip-detail-container" v-if="trip">
    <div class="trip-header">
      <h1>{{ trip.title }}</h1>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Add Day</el-dropdown-item>
            <el-dropdown-item>Delete Day</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <p><strong>From:</strong> {{ trip.start_date }}</p>
    <p><strong>To:</strong> {{ trip.end_date }}</p>
    <p><strong>Budget:</strong> {{ trip.total_budget }} {{ trip.currency }}</p>

    <h2>Events</h2>
    <div class="toolbar">
      <el-button type="primary" :icon="Plus">Add Event</el-button>
    </div>
    <div class="days-container">
      <DayCard v-for="day in days" :key="day.dayIndex" :day="day" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTripStore } from '../store/tripStore';
import { useEventStore } from '../store/eventStore';
import { useRouteStore } from '../store/routeStore';
import { useLocationStore } from '../store/locationStore';
import { Plus, ArrowDown } from '@element-plus/icons-vue';
import DayCard from '../components/DayCard.vue';
import type { Event } from '../api/event';
import type { Route } from '../api/route';

const route = useRoute();
const tripStore = useTripStore();
const eventStore = useEventStore();
const routeStore = useRouteStore();
const locationStore = useLocationStore();

const tripId = route.params.id as string;

const trip = computed(() => tripStore.trips.find(t => t.id === tripId));
const events = computed(() => eventStore.events);
const routes = computed(() => routeStore.routes);

const days = computed(() => {
  const grouped = events.value.reduce((acc, event) => {
    const dayIndex = event.day_index;
    if (!acc[dayIndex]) {
      acc[dayIndex] = {
        dayIndex,
        events: [],
        routes: [],
      };
    }
    acc[dayIndex].events.push(event);
    return acc;
  }, {} as Record<number, { dayIndex: number; events: Event[]; routes: Route[] }>);

  routes.value.forEach(route => {
    const fromEvent = events.value.find(e => e.id === route.from_event_id);
    if (fromEvent) {
      const dayIndex = fromEvent.day_index;
      if (grouped[dayIndex]) {
        grouped[dayIndex].routes.push(route);
      }
    }
  });

  return Object.values(grouped).sort((a, b) => a.dayIndex - b.dayIndex);
});

onMounted(async () => {
  await tripStore.fetchTrip(tripId);
  await eventStore.fetchEvents(tripId);
  await routeStore.fetchRoutes(tripId);
  await locationStore.fetchLocations();
});
</script>

<style scoped>
.trip-detail-container {
  padding: 20px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.days-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
