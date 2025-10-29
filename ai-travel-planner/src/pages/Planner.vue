<template>
  <div class="planner-container">
    <div v-if="user">Welcome, {{ user.email }}</div>
    <h1>My Trips</h1>
    <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAddTrip">Add Trip</el-button>
    </div>
    <el-card v-for="trip in trips" :key="trip.id" class="trip-card" @click="handleTripClick(trip.id)">
      <template #header>
        <div class="card-header">
          <span>{{ trip.title }}</span>
          <el-button
            type="danger"
            :icon="Delete"
            @click.stop="handleDeleteTrip(trip)"
          >Delete</el-button>
        </div>
      </template>
      <div>
        <p>From: {{ trip.start_date }}</p>
        <p>To: {{ trip.end_date }}</p>
        <p>Budget: {{ trip.total_budget }} {{ trip.currency }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { useTripStore } from '../store/tripStore';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Trip } from '../api/trip';

const userStore = useUserStore();
const tripStore = useTripStore();
const router = useRouter();

const user = computed(() => userStore.user);
const trips = computed(() => tripStore.trips);

const handleAddTrip = () => {
  router.push('/add-trip');
};

const handleTripClick = (tripId: string) => {
  router.push(`/trips/${tripId}`);
};

const handleDeleteTrip = async (trip: Trip) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the trip "${trip.title}"?`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    await tripStore.deleteTrips([trip.id]);
    ElMessage.success('Trip deleted successfully.');
    await tripStore.fetchTrips(); // Refresh the list
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.detail || JSON.stringify(error));
    }
  }
};

onMounted(async () => {
  if (!user.value) {
    await userStore.getProfile();
  }
  await tripStore.fetchTrips();
});
</script>

<style scoped>
.planner-container {
  padding: 20px;
}

.toolbar {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.trip-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
}

.trip-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.trip-card :deep(.el-card__header) {
  background-color: #b3e5fc; /* 天蓝色 */
  padding: 12px 16px;       /* 与 Element Plus 默认保持一致 */
  border-bottom: 1px solid #90caf9; /* 可选：更细微的分割线 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
}

:deep(.el-message-box__message p) {
  white-space: pre-line; 
}


</style>
