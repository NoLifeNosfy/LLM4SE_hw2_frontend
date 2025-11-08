<template>
  <div class="add-trip-container">
    <h1>Add a New Trip</h1>
    <el-card class="add-trip-card">
      <el-form @submit.prevent="handleSave">
        <el-form-item label="Title">
          <el-input v-model="trip.title" placeholder="Enter trip title"></el-input>
        </el-form-item>
        <el-form-item label="Start Date">
          <el-date-picker v-model="trip.start_date" type="date" placeholder="Pick a date"></el-date-picker>
        </el-form-item>
        <el-form-item label="End Date">
          <el-date-picker v-model="trip.end_date" type="date" placeholder="Pick a date
          "></el-date-picker>
        </el-form-item>
        <el-form-item label="Total Budget">
          <el-input v-model.number="trip.total_budget" type="number" placeholder="Enter total budget"></el-input>
        </el-form-item>
        <el-form-item label="Currency">
          <el-input v-model="trip.currency" placeholder="Enter currency (e.g., USD)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">Save</el-button>
          <el-button @click="handleCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTripStore } from '../store/tripStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const tripStore = useTripStore();
const router = useRouter();

const trip = ref({
  title: '',
  start_date: '',
  end_date: '',
  total_budget: 0,
  currency: 'CNY',
});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleSave = async () => {
  try {
    const tripData = {
      title: trip.value.title,
      start_date: trip.value.start_date ? formatDate(new Date(trip.value.start_date)) : '',
      end_date: trip.value.end_date ? formatDate(new Date(trip.value.end_date)) : '',
      total_budget: trip.value.total_budget,
      currency: trip.value.currency,
    };
    await tripStore.addTrip(tripData);
    ElMessage.success('Trip added successfully');
    router.push('/planner');
  } catch (error: any) {
    ElMessage.error(JSON.stringify(error));
  }
};

const handleCancel = () => {
  router.push('/planner');
};
</script>

<style scoped>
.add-trip-container {
  padding: 20px;
}

.add-trip-card {
  max-width: 600px;
  margin: auto;
}
</style>
