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
import { Route } from '../../api/route';

const props = defineProps<{
  events: Event[];
  locations: Location[];
  routes: Route[];
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
  renderCustomMarkers();
  renderRoutes();
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
const renderCustomMarkers = () => {
  const map = mapInstance.value;
  const BMap = BMapRef.value;
  if (!map || !BMap) return;

  const events = props.events || [];
  const locations = props.locations || [];

  // 按 day_index 分组
  const dayGroups: Record<number, Event[]> = {};
  for (const ev of events) {
    if (!dayGroups[ev.day_index]) dayGroups[ev.day_index] = [];
    dayGroups[ev.day_index].push(ev);
  }

  // 为每个 day_index 找到第一个和最后一个事件
  const firstAndLastEvents: Record<number, { first: Event; last: Event }> = {};
  for (const dayIndex in dayGroups) {
    const dayEvents = dayGroups[dayIndex];
    if (dayEvents.length > 0) {
      firstAndLastEvents[dayIndex] = {
        first: dayEvents[0],
        last: dayEvents[dayEvents.length - 1],
      };
    }
  }

  events.forEach(ev => {
    const location = locations.find(l => l.id === ev.location_id);
    if (!location?.lat || !location?.lng) return;

    const point = new BMap.Point(location.lng, location.lat);
    const indexInDay = dayGroups[ev.day_index].indexOf(ev);
    const labelText = `${ev.day_index}.${indexInDay + 1}`;

    const colorSet = eventColorShades[(ev.day_index - 1) % eventColorShades.length];
    const color = colorSet[Math.min(indexInDay, colorSet.length - 1)];

    const isFirst = firstAndLastEvents[ev.day_index]?.first.id === ev.id;
    const isLast = firstAndLastEvents[ev.day_index]?.last.id === ev.id;

    const label = new BMap.Label(labelText, {
      position: point,
      offset: new BMap.Size(-12, -12),
    });

    const style: any = {
      backgroundColor: color,
      color: '#fff',
      borderRadius: '50%',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '24px',
      width: '24px',
      height: '24px',
      fontSize: '12px',
      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
      cursor: 'pointer',
    };

    if (isFirst || isLast) {
      style.border = '3px solid #666'; // Dark gray border for highlight
      style.width = '28px';
      style.height = '28px';
      style.lineHeight = '28px';
      style.offset = new BMap.Size(-14, -14);
    } else {
      style.border = '3px solid #CCC';
    }

    label.setStyle(style);

    map.addOverlay(label);
  });
};

const renderRoutes = () => {
  const map = mapInstance.value;
  const BMap = BMapRef.value;
  if (!map || !BMap) return;

  const routes = props.routes || [];
  const events = props.events || [];
  const locations = props.locations || [];

  routes.forEach(route => {
    let points: any[] = [];

    if (route.geometry && route.geometry.length > 1) {
      // 有完整路径：用 geometry 画折线
      points = route.geometry.map(p => new BMap.Point(p.lng, p.lat));
    } else {
      // 无 geometry：回退为起点终点虚线
      const fromEvent = events.find(e => e.id === route.from_event_id);
      const toEvent = events.find(e => e.id === route.to_event_id);
      if (!fromEvent || !toEvent) return;

      const fromLocation = locations.find(l => l.id === fromEvent.location_id);
      const toLocation = locations.find(l => l.id === toEvent.location_id);
      if (!fromLocation || !toLocation) return;

      points = [
        new BMap.Point(fromLocation.lng, fromLocation.lat),
        new BMap.Point(toLocation.lng, toLocation.lat),
      ];
    }

    // 箭头样式
    const arrow = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
      scale: 0.6,
      strokeColor: '#fff',
      strokeWeight: 2,
    });
    const icons = [new BMap.IconSequence(arrow, '10', '30')];

    //  选中状态样式
    const isSelected = selectedRouteId.value === route.id;
    const hasGeometry = !!(route.geometry && route.geometry.length > 1);

    // ✅ 基础样式：绿色路线
    const strokeColor = isSelected ? '#FF5722' : '#008B45';
    const strokeOpacity = hasGeometry ? 0.9 : 0.4; // 无 geometry 更淡
    const strokeStyle = hasGeometry ? 'solid' : 'dashed'; // 无 geometry 虚线
    const strokeWeight = isSelected ? 10 : 6;

    const polyline = new BMap.Polyline(points, {
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle,
      icons: hasGeometry ? icons : [], // 没 geometry 的不加箭头
    });

    map.addOverlay(polyline);
  });
};


const selectedEventId = ref<string | null>(null);

const centerOnEvent = (event: Event) => {
  const location = props.locations.find(l => l.id === event.location_id);
  if (location && mapInstance.value) {
    selectedEventId.value = event.id;
    selectedRouteId.value = null; // Clear selected route
    selectedRouteEventIds.value = null;
    mapInstance.value.centerAndZoom(new BMapRef.value.Point(location.lng, location.lat), 15);
    reRenderMap();
  }
};

const selectedRouteId = ref<string | null>(null);
const selectedRouteEventIds = ref<{ from: string; to: string } | null>(null);

const centerOnRoute = (route: Route) => {
  const fromEvent = props.events.find(e => e.id === route.from_event_id);
  const toEvent = props.events.find(e => e.id === route.to_event_id);

  if (!fromEvent || !toEvent) return;

  const fromLocation = props.locations.find(l => l.id === fromEvent.location_id);
  const toLocation = props.locations.find(l => l.id === toEvent.location_id);

  if (fromLocation && toLocation && mapInstance.value) {
    selectedRouteId.value = route.id;
    selectedRouteEventIds.value = { from: route.from_event_id, to: route.to_event_id };
    selectedEventId.value = null; // Clear selected event
    const points = [
      new BMapRef.value.Point(fromLocation.lng, fromLocation.lat),
      new BMapRef.value.Point(toLocation.lng, toLocation.lat),
    ];
    mapInstance.value.setViewport(points);
    reRenderMap();
  }
};

const reRenderMap = () => {
  if (mapInstance.value && BMapRef.value) {
    mapInstance.value.clearOverlays();
    renderCustomMarkers();
    renderRoutes();
  }
};

defineExpose({
  centerOnEvent,
  centerOnRoute,
});

// 如果 events/locations/routes 后来才有数据，自动更新地图中心
watch(
  () => [props.events, props.locations, props.routes],
  () => {
    const firstLocation = findFirstLocation();
    if (firstLocation && mapInstance.value) {
      mapInstance.value.centerAndZoom(
        new BMapRef.value.Point(firstLocation.lng, firstLocation.lat),
        15
      );
    }

    reRenderMap();
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
