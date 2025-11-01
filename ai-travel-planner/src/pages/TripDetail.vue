<template>
  <div class="trip-detail-container" v-if="trip">
    <div class="trip-content-wrapper">
      <div class="left-panel">
        <div class="trip-header">
          <h1>{{ trip.title }}</h1>
        </div>
        <p><strong>From:</strong> {{ trip.start_date }}</p>
        <p><strong>To:</strong> {{ trip.end_date }}</p>
        <p><strong>Budget:</strong> {{ trip.total_budget }} {{ trip.currency }}</p>

        <h2>Events</h2>
        <div class="toolbar">
          <el-button type="primary" :icon="Plus" @click="handleAddDay">Add Day</el-button>
        </div>
        <div class="days-container">
          <DayCard 
            v-for="day in days" 
            :key="day.dayIndex" 
            :day="day" 
            @add-event="openAddEventDialog"
            @edit-event="openEditEventDialog"
            @add-route="openAddRouteDialog"
            @edit-route="openEditRouteDialog"
            @event-click="handleEventClick"
            @route-click="handleRouteClick"
          />
        </div>
      </div>
      <div class="right-panel">
        <MapContainer 
          ref="mapContainerRef" 
          v-if="isDataLoaded" 
          :events="events" 
          :locations="locations" 
          :routes="routes" 
        />
        <div v-else class="map-placeholder">Loading Map...</div>
      </div>
    </div>
    <AddEventForm 
      v-model="isDialogVisible" 
      :event="editingEvent" 
      :day-index="currentDayIndex" 
      @save="handleSaveEvent" 
    />
    <AddRouteForm
      v-model="isRouteDialogVisible"
      :route="editingRoute"
      :from-event-id="fromEventId"
      :to-event-id="toEventId"
      @save="handleSaveRoute"
    />
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
import AddEventForm from '../components/AddEventForm.vue';
import AddRouteForm from '../components/AddRouteForm.vue';
import type { Event, EventCreate } from '../api/event';
import type { Route, RouteCreate } from '../api/route';
import MapContainer from '../components/Map/MapContainer.vue';

const route = useRoute();
const tripStore = useTripStore();
const eventStore = useEventStore();
const routeStore = useRouteStore();
const locationStore = useLocationStore();

const tripId = route.params.id as string;

const isDialogVisible = ref(false);
const editingEvent = ref<Event | undefined>(undefined);
const currentDayIndex = ref<number | undefined>(undefined);

const isRouteDialogVisible = ref(false);
const editingRoute = ref<Route | undefined>(undefined);
const fromEventId = ref<string | undefined>(undefined);
const toEventId = ref<string | undefined>(undefined);

const mapContainerRef = ref<InstanceType<typeof MapContainer> | null>(null);

const trip = computed(() => tripStore.trips.find(t => t.id === tripId));
const events = computed(() => eventStore.events);
const routes = computed(() => routeStore.routes);
const locations = computed(() => locationStore.locations);

const isDataLoaded = computed(() => events.value.length > 0 && locations.value.length > 0 && routes.value.length > 0);

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

  if (routes.value) {
    routes.value.forEach(route => {
      const fromEvent = events.value.find(e => e.id === route.from_event_id);
      if (fromEvent) {
        const dayIndex = fromEvent.day_index;
        if (grouped[dayIndex]) {
          grouped[dayIndex].routes.push(route);
        }
      }
    });
  }

  return Object.values(grouped).sort((a, b) => a.dayIndex - b.dayIndex);
});

const handleAddDay = () => {
  eventStore.addDay(tripId);
};

const openAddEventDialog = (dayIndex: number) => {
  editingEvent.value = undefined;
  currentDayIndex.value = dayIndex;
  isDialogVisible.value = true;
};

const openEditEventDialog = (event: Event) => {
  editingEvent.value = event;
  currentDayIndex.value = event.day_index;
  isDialogVisible.value = true;
};

const handleSaveEvent = async (eventData: EventCreate) => {
  if (editingEvent.value) {
    await eventStore.editEvent(editingEvent.value.id, eventData);
  } else {
    await eventStore.addEvent(tripId, eventData);
  }
};

const openAddRouteDialog = (data: { fromEventId: string; toEventId: string }) => {
  editingRoute.value = undefined;
  fromEventId.value = data.fromEventId;
  toEventId.value = data.toEventId;
  isRouteDialogVisible.value = true;
};

const openEditRouteDialog = (route: Route) => {
  editingRoute.value = route;
  fromEventId.value = route.from_event_id;
  toEventId.value = route.to_event_id;
  isRouteDialogVisible.value = true;
};

const handleSaveRoute = async (routeData: RouteCreate) => {
  if (editingRoute.value) {
    await routeStore.editRoute(editingRoute.value.id, routeData);
  } else {
    await routeStore.addRoute(tripId, routeData);
  }
};

const handleEventClick = (event: Event) => {
  if (mapContainerRef.value) {
    mapContainerRef.value.centerOnEvent(event);
  }
};

const handleRouteClick = (route: Route) => {
  if (mapContainerRef.value) {
    mapContainerRef.value.centerOnRoute(route);
  }
};

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
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

.trip-content-wrapper {
  display: flex;
  flex: 1; /* Take remaining space */
  gap: 20px; /* Space between columns */
  overflow: hidden; /* Hide overflow if content is too large */
}

.left-panel {
  flex: 1; /* Takes 1 part of the available space */
  overflow-y: auto; /* Scroll for content if it overflows */
  padding-right: 10px; /* Some padding for scrollbar */
}

.right-panel {
  flex: 2; /* Takes 2 parts of the available space, making it wider */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #606266;
  font-size: 1.5rem;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
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
