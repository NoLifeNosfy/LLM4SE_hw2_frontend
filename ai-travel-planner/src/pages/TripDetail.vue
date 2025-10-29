<template>
  <div class="trip-detail-container" v-if="trip">
    <h1>{{ trip.title }}</h1>
    <p><strong>From:</strong> {{ trip.start_date }}</p>
    <p><strong>To:</strong> {{ trip.end_date }}</p>
    <p><strong>Budget:</strong> {{ trip.total_budget }} {{ trip.currency }}</p>

    <h2>Events</h2>
    <div class="toolbar">
        <el-button type="primary" :icon="Plus">Add Event</el-button>
    </div>
    <el-table :data="events" style="width: 100%">
      <el-table-column prop="title" label="Title"></el-table-column>
      <el-table-column prop="start_time" label="Start Time"></el-table-column>
      <el-table-column prop="end_time" label="End Time"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="budget" label="Budget"></el-table-column>
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button size="small" @click="() => {} /* handleEdit(scope.row) */">Edit</el-button>
          <el-button size="small" type="danger" @click="() => {} /* handleDelete(scope.row) */">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTripStore } from '../store/tripStore';
import { useEventStore } from '../store/eventStore';
import { Plus } from '@element-plus/icons-vue';

const route = useRoute();
const tripStore = useTripStore();
const eventStore = useEventStore();

const tripId = route.params.id as string;

const trip = computed(() => tripStore.trips.find(t => t.id === tripId));
const events = computed(() => eventStore.events);

onMounted(async () => {
  await tripStore.fetchTrip(tripId);
  await eventStore.fetchEvents(tripId);
});
</script>

<style scoped>
.trip-detail-container {
  padding: 20px;
}

.toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}
</style>
