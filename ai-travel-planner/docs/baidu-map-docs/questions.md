# 常见问题
- BaiduMap 组件容器本身是一个空的块级元素，如果容器不定义高度，百度地图将渲染在一个高度为 0 不可见的容器内。
- 没有设置 center 和 zoom 属性的地图组件是不进行地图渲染的。当center 属性为合法地名字符串时例外，因为百度地图会根据地名自动调整 zoom 的值。
- 由于百度地图 JS API 只有 JSONP 一种加载方式，因此 BaiduMap 组件及其所有子组件的渲染只能是异步的。因此，请使用在组件的 ready 事件来执行地图 API 加载完毕后才能执行的代码，不要试图在 vue 自身的生命周期中调用 BMap 类，更不要在这些时机修改 model 层。

## 错误用法
```
<template>
  <baidu-map :center="center" :zoom="zoom"></baidu-map>
</template>

<script setup>
import {ref,onMounted} from 'vue';

const center = ref({lng: 0, lat: 0});
const zoom = ref(3);

onMounted(()=>{
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 15;
});
</script>
```

## 正确用法
```
<template>
  <baidu-map :center="center" :zoom="zoom" @ready="handler"></baidu-map>
</template>

<script setup>
import {ref,onMounted} from 'vue';

const center = ref({lng: 0, lat: 0});
const zoom = ref(3);

const handler = ({BMap, map}) => {
  console.log(BMap, map);
  center.value.lng = 116.404;
  center.value.lat = 39.915;
  zoom.value = 15;
}
</script>
```