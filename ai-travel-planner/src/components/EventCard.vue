<template>
  <div class="event-card" :style="{ backgroundColor: eventColor }">
    <div class="event-header" @click="toggleFold">
      <div class="event-time">
        <span>{{ formatTime(event.start_time) }}</span>
        <span>{{ formatTime(event.end_time) }}</span>
      </div>
      <div class="event-indicator">
        <span>{{ event.title.charAt(0) }}</span>
      </div>
      <div class="event-location">{{ locationName }}</div>
      <el-dropdown>
        <span class="el-dropdown-link" @click.stop>
          <el-icon class="el-icon--right"><more-filled /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Edit Event</el-dropdown-item>
            <el-dropdown-item>Delete Event</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div v-if="!isFolded" class="event-body">
      <p><strong>Title:</strong> {{ event.title }}</p>
      <p><strong>Type:</strong> {{ event.type }}</p>
      <p><strong>Budget:</strong> {{ event.budget }}</p>
      <p><strong>Details:</strong> {{ event.details?.description || 'No details provided.' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Event } from '../api/event';
import { useLocationStore } from '../store/locationStore';
import { MoreFilled } from '@element-plus/icons-vue';

const props = defineProps<{ 
  event: Event;
  eventColor: string;
}>();

const isFolded = ref(true);
const locationStore = useLocationStore();

const locationName = computed(() => {
  const location = locationStore.getLocationById(props.event.location_id);
  return location ? location.name : 'N/A';
});

const toggleFold = () => {
  isFolded.value = !isFolded.value;
};

const formatTime = (time: string) => {
  if (!time) return '';
  // Prepend a dummy date to the time string to create a valid Date object
  const date = new Date(`1970-01-01T${time}`);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

</script>

<style scoped>
.event-card {
  border-radius: 10px;
  padding: 10px;
  transition: all 0.3s ease;
}

.event-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  font-size: 0.9em;
}

.event-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
}

.event-location {
  flex-grow: 1;
  font-weight: 500;
}

.event-body {
  margin-top: 10px;
  padding-left: 50px; /* Align with location */
}
</style>
