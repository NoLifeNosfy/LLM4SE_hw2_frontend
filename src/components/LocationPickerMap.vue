<template>
  <baidu-map
    class="bm-view"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="mapReady"
  >
    <bm-marker
      v-for="location in locations"
      :key="location.id"
      :position="{ lng: location.lng, lat: location.lat }"
      @click="emit('select-location', location)"
    >
      <b-label :content="location.name" :offset="{ width: 20, height: -10 }"></b-label>
    </bm-marker>
  </baidu-map>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Location } from '../api/location';

const props = defineProps<{
  locations: Location[];
}>();

const emit = defineEmits(['select-location']);

const center = ref({ lng: 116.404, lat: 39.915 });
const zoom = ref(12);
const mapInstance = ref<any>(null);
const BMapRef = ref<any>(null);

const mapReady = ({ BMap, map }) => {
  mapInstance.value = map;
  BMapRef.value = BMap;
  updateMapViewport(props.locations);
};

const updateMapViewport = (locations: Location[]) => {
  if (locations.length > 0 && mapInstance.value) {
    const points = locations.map(loc => new BMapRef.value.Point(loc.lng, loc.lat));
    mapInstance.value.setViewport(points);
  }
};

const centerOnLocation = (location: Location) => {
  if (mapInstance.value) {
    mapInstance.value.panTo(new BMapRef.value.Point(location.lng, location.lat));
  }
};

defineExpose({
  centerOnLocation,
});

watch(() => props.locations, (newLocations) => {
  updateMapViewport(newLocations);
});
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 100%;
}
</style>
