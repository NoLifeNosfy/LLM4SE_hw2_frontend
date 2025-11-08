<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Route' : 'Add Route'" width="500px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="Mode">
        <el-input v-model="form.mode"></el-input>
      </el-form-item>
      <el-form-item label="Duration (sec)">
        <el-input-number v-model="form.duration"></el-input-number>
      </el-form-item>
      <el-form-item label="Distance (meters)">
        <el-input-number v-model="form.distance"></el-input-number>
      </el-form-item>
      <el-form-item label="Budget">
        <el-input-number v-model="form.budget"></el-input-number>
      </el-form-item>
      <el-form-item label="Details">
        <el-input type="textarea" v-model="form.details"></el-input>
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
import type { Route, RouteCreate } from '../api/route';

const props = defineProps<{ 
  modelValue: boolean;
  route?: Route;
  fromEventId?: string;
  toEventId?: string;
}>();

const emit = defineEmits(['update:modelValue', 'save']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const isEdit = computed(() => !!props.route);

const form = ref<RouteCreate>({ ...getInitialForm() });

function getInitialForm(): RouteCreate {
    return {
        from_event_id: props.fromEventId || '',
        to_event_id: props.toEventId || '',
        mode: 'driving',
        distance: 0,
        duration: 0,
        budget: 0,
        geometry: null,
        details: '',
    };
}

watch(() => props.modelValue, (isVisible) => {
  if (isVisible) {
    if (props.route) {
      form.value = { ...props.route };
    } else {
      form.value = { ...getInitialForm() };
    }
  }
});

const handleSave = () => {
  emit('save', form.value);
  dialogVisible.value = false;
};

</script>
