<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Event' : 'Add Event'" width="500px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="Title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="Start Time">
        <el-time-picker v-model="form.start_time" format="HH:mm" value-format="HH:mm"></el-time-picker>
      </el-form-item>
      <el-form-item label="End Time">
        <el-time-picker v-model="form.end_time" format="HH:mm" value-format="HH:mm"></el-time-picker>
      </el-form-item>
      <el-form-item label="Type">
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="Budget">
        <el-input-number v-model="form.budget"></el-input-number>
      </el-form-item>
      <el-form-item label="Location">
        <el-select v-model="form.location_id" placeholder="Select a location">
          <el-option v-for="location in locations" :key="location.id" :label="location.name" :value="location.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Description">
        <el-input type="textarea" v-model="form.details.description"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useLocationStore } from '../store/locationStore';
import type { Event, EventCreate } from '../api/event';

const props = defineProps<{ 
  modelValue: boolean;
  event?: Event;
  dayIndex?: number;
}>();

const emit = defineEmits(['update:modelValue', 'save']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const locationStore = useLocationStore();
const locations = computed(() => locationStore.locations);

const isEdit = computed(() => !!props.event);

const form = ref<EventCreate>({ ...getInitialForm() });

function getInitialForm(): EventCreate {
    return {
        title: '',
        start_time: '',
        end_time: '',
        type: 'activity',
        budget: 0,
        details: {},
        day_index: props.dayIndex || 1,
        location_id: null,
    };
}

watch(() => props.event, (newEvent) => {
  if (newEvent) {
    form.value = { ...newEvent };
    if (!form.value.details) {
      form.value.details = {};
    }
  } else {
    form.value = { ...getInitialForm() };
  }
});

const handleSave = () => {
  const eventToSave = { ...form.value };
  emit('save', eventToSave);
  dialogVisible.value = false;
};

</script>
