<template>
  <div class="route-card">
    <div v-if="route" class="route-details">
      <div class="route-arrow">↓</div>
      <div class="route-info">
        <span>{{ route.mode }}</span>
        <span>{{ formatDuration(route.duration) }}</span>
        <span>{{ formatDistance(route.distance) }}</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right"><more-filled /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Edit Route</el-dropdown-item>
            <el-dropdown-item>Delete Route</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div v-else class="add-route">
      <el-button type="dashed" :icon="Plus" @click="handleAddRoute">Add Route</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Route } from '../api/route';
import { MoreFilled, Plus } from '@element-plus/icons-vue';

const props = defineProps<{ 
  route?: Route;
}>();

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatDistance = (distance: number) => {
  return `${(distance / 1000).toFixed(1)} km`;
};

const handleAddRoute = () => {
  // TODO: Implement add route functionality
};

</script>

<style scoped>
.route-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
}

.route-details {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.route-arrow {
  font-size: 1.5em;
  color: #909399;
}

.route-info {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #606266;
  flex-grow: 1;
}

.add-route {
  width: 100%;
}

.el-button--dashed {
    width: 100%;
}
</style>
