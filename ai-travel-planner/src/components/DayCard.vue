<template>
  <div class="day-card" :style="{ backgroundColor: dayColor }">
    <div class="day-header" @click="toggleFold">
      <div class="day-indicator">
        <span class="day-number">Day {{ day.dayIndex }}</span>
      </div>
      <div v-if="isFolded" class="folded-summary">{{ foldedSummary }}</div>
      <div class="day-actions">
        <el-dropdown>
          <span class="el-dropdown-link" @click.stop>
            <el-icon class="el-icon--right"><more-filled /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Add Event</el-dropdown-item>
              <el-dropdown-item @click="handleDeleteDay">Delete This Day</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div v-if="!isFolded" class="events-container">
      <template v-for="(event, index) in day.events" :key="event.id">
        <EventCard :event="event" :event-color="getEventColor(index)" />
        <RouteCard v-if="index < day.events.length - 1" :route="findRouteBetween(event, day.events[index + 1])" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EventCard from './EventCard.vue';
import RouteCard from './RouteCard.vue';
import type { Event } from '../api/event';
import type { Route } from '../api/route';
import { MoreFilled } from '@element-plus/icons-vue';
import { useEventStore } from '../store/eventStore';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{ 
  day: { dayIndex: number; events: Event[]; routes: Route[] };
}>();

const isFolded = ref(false);
const eventStore = useEventStore();

const dayColors = ['#E3F2FD', '#E8F5E9', '#FFFDE7', '#F3E5F5', '#FBE9E7'];
const eventColorShades = [
  ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3'],
  ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'],
  ['#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B'],
  ['#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0'],
  ['#FFCCBC', '#FFAB91', '#FF8A65', '#FF7043', '#FF5722'],
];

const dayColor = computed(() => dayColors[(props.day.dayIndex - 1) % dayColors.length]);

const getEventColor = (eventIndex: number) => {
  const colorPalette = eventColorShades[(props.day.dayIndex - 1) % eventColorShades.length];
  return colorPalette[eventIndex % colorPalette.length];
};

const toggleFold = () => {
  isFolded.value = !isFolded.value;
};

const foldedSummary = computed(() => {
  return props.day.events.map(e => e.title).join(' → ');
});

const findRouteBetween = (fromEvent: Event, toEvent: Event) => {
  return props.day.routes.find(r => r.from_event_id === fromEvent.id && r.to_event_id === toEvent.id);
};

const handleDeleteDay = async () => {
  try {
    await ElMessageBox.confirm('This will permanently delete the day and all its events. Continue?', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    });
    await eventStore.removeDay(props.day.dayIndex);
  } catch (error) {
    // catch cancellation
  }
};

</script>

<style scoped>
.day-card {
  border-radius: 15px;
  padding: 15px;
  transition: all 0.3s ease;
}

.day-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.day-indicator {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.day-number {
  font-weight: bold;
  font-size: 1.2em;
}

.folded-summary {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.day-actions {
  margin-left: auto;
}

.events-container {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
