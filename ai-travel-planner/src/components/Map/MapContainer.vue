<template>
  <baidu-map
    class="bm-view"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="mapReady"
  >
    <bm-marker
      v-for="event in eventsWithLocation"
      :key="event.id"
      :position="event.location"
    />
  </baidu-map>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Event } from '../../api/event';
import type { Location } from '../../api/location';

const props = defineProps<{
  events: Event[];
  locations: Location[];
}>();

const center = ref({ lng: 116.404, lat: 39.915 });
const zoom = ref(12);
const mapInstance = ref<any>(null);

const mapReady = ({ BMap, map }) => {
  mapInstance.value = map;
  const firstLocation = findFirstLocation();
  if (firstLocation) {
    center.value = firstLocation;
    zoom.value = 15;
    map.centerAndZoom(new BMap.Point(firstLocation.lng, firstLocation.lat), 15);
  }
};

const findFirstLocation = () => {
  for (const event of props.events) {
    if (event.location_id) {
      const location = props.locations.find(l => l.id === event.location_id);
      console.log('Finding location for event:', event, location);
      if (location?.lat && location?.lng) {
        return {
          lng: location.lng,
          lat: location.lat,
        };
      }
    }
  }
  return null;
};

const eventsWithLocation = computed(() => {
  return props.events
    .map(event => {
      if (!event.location_id) return null;
      const location = props.locations.find(l => l.id === event.location_id);
      if (!location?.lat || !location?.lng) return null;
      return {
        ...event,
        location: {
          lng: location.lng,
          lat: location.lat,
        },
      };
    })
    .filter(Boolean);
});

// 如果 events/locations 后来才有数据，自动更新地图中心
watch(
  () => [props.events, props.locations],
  () => {
    const firstLocation = findFirstLocation();
    if (firstLocation && mapInstance.value) {
      mapInstance.value.centerAndZoom(
        new BMap.Point(firstLocation.lng, firstLocation.lat),
        15
      );
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 100%;
}
</style>
