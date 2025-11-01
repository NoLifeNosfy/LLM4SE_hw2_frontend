<template>
  <baidu-map
    class="bm-view"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="mapReady"
  >
  </baidu-map>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { Event } from '../../api/event';
import type { Location } from '../../api/location';

const props = defineProps<{
  events: Event[];
  locations: Location[];
}>();

const center = ref({ lng: 116.404, lat: 39.915 });
const zoom = ref(12);
const mapInstance = ref<any>(null);
const BMapRef = ref<any>(null); // 保存 BMap 构造器

const eventColorShades = [
  ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3'], // 蓝色系
  ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'], // 绿色系
  ['#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B'], // 黄色系
  ['#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0'], // 紫色系
  ['#FFCCBC', '#FFAB91', '#FF8A65', '#FF7043', '#FF5722'], // 橙色系
];

const mapReady = async ({ BMap, map }) => {
  mapInstance.value = map;
  BMapRef.value = BMap;

  //初始化中心点
  const firstLocation = findFirstLocation();
  if (firstLocation) {
    map.centerAndZoom(new BMap.Point(firstLocation.lng, firstLocation.lat), 15);
  }

  // 添加自定义 marker
  await nextTick();
  renderCustomMarkers(BMap, map);
};

const findFirstLocation = () => {
  for (const event of props.events) {
    if (event.location_id) {
      const location = props.locations.find(l => l.id === event.location_id);
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

// 渲染所有自定义圆形 marker
// 渲染所有自定义 marker
const renderCustomMarkers = () => {
  const map = mapInstance.value;
  const BMap = BMapRef.value;
  if (!map || !BMap) return;

  map.clearOverlays();

  const events = props.events || [];
  const locations = props.locations || [];

  // 按 day_index 分组
  const dayGroups: Record<number, Event[]> = {};
  for (const ev of events) {
    if (!dayGroups[ev.day_index]) dayGroups[ev.day_index] = [];
    dayGroups[ev.day_index].push(ev);
  }

  events.forEach(ev => {
    const location = locations.find(l => l.id === ev.location_id);
    if (!location?.lat || !location?.lng) return;

    const point = new BMap.Point(location.lng, location.lat);
    const indexInDay = dayGroups[ev.day_index].indexOf(ev);
    const labelText = `${ev.day_index}.${indexInDay + 1}`;

    const colorSet = eventColorShades[(ev.day_index - 1) % eventColorShades.length];
    const color = colorSet[Math.min(indexInDay, colorSet.length - 1)];

    const label = new BMap.Label(labelText, {
      position: point,
      offset: new BMap.Size(-12, -12),
    });

    label.setStyle({
      backgroundColor: color,
      color: '#fff',
      border: '2px solid #333',
      borderRadius: '50%',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '24px',
      width: '24px',
      height: '24px',
      fontSize: '12px',
      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
      cursor: 'pointer',
    });

    map.addOverlay(label);
  });
};

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

    if (mapInstance.value && BMapRef.value) {
      renderCustomMarkers();
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
