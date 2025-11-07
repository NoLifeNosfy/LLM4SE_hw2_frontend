<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add/Edit Event"
    width="80%"
    :before-close="handleClose"
    fullscreen
  >
    <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 20px;">
      <el-step title="Event Details"></el-step>
      <el-step title="Select Location"></el-step>
    </el-steps>

    <div v-if="activeStep === 0">
      <el-form :model="form" label-width="120px">
        <el-form-item label="Title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="Start Time">
          <el-time-picker v-model="form.start_time" format="HH:mm" value-format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="End Time">
          <el-time-picker v-model="form.end_time" format="HH:mm" value-format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="Budget">
          <el-input-number v-model="form.budget" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.details.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="nextStep">Next</el-button>
      </div>
    </div>

    <div v-if="activeStep === 1">
      <LocationSearch @select-location="handleSelectLocation" />
      <div class="dialog-footer">
        <el-button @click="prevStep">Previous</el-button>
        <el-button type="primary" @click="saveEvent" :disabled="!form.location_id">Save</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Event, EventCreate } from '../api/event';
import type { Location } from '../api/location';
import LocationSearch from './LocationSearch.vue';

const props = defineProps<{
  modelValue: boolean;
  event?: Event;
  dayIndex: number;
}>();

const emit = defineEmits(['update:modelValue', 'save']);

const dialogVisible = ref(props.modelValue);
const activeStep = ref(0);

const initialForm: EventCreate & { location?: Location } = {
  title: '',
  type: '',
  start_time: '',
  end_time: '',
  budget: 0,
  details: { description: '' },
  day_index: props.dayIndex,
  location_id: '',
  location: undefined,
};

const form = reactive<EventCreate & { location?: Location }>({ ...initialForm });

watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    activeStep.value = 0;
    if (props.event) {
      Object.assign(form, props.event);
      form.details = props.event.details || { description: '' };
    } else {
      Object.assign(form, initialForm);
      form.day_index = props.dayIndex;
    }
  }
});

const handleClose = () => {
  dialogVisible.value = false;
  emit('update:modelValue', false);
};

const nextStep = () => {
  if (activeStep.value < 1) {
    activeStep.value++;
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

const handleSelectLocation = (location: Location) => {
  form.location_id = location.id;
  form.location = location;
};

const saveEvent = () => {
  emit('save', form);
  handleClose();
};
</script>

<style scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style>
