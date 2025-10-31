<template>
  <div class="map-container">
    <div class="map-wrapper">
      <baidu-map
        class="bm-view"
        :zoom="12"
        :center="{ lng: 116.404, lat: 39.915 }"
      />
    </div>
  </div>
</template>


<style scoped>
/* 外层容器：负责居中显示 */
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; /* 视口高度，可根据需要改为固定高度 */
  background-color: #f5f5f5;
}

/* 包裹层：保持 4:3 比例 */
.map-wrapper {
  position: relative;
  width: 80%; /* 地图宽度占页面 80%，可调整 */
  aspect-ratio: 4 / 3; /* ✅ CSS 原生保持4:3比例 */
  max-width: 800px; /* 限制最大宽度 */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 实际地图组件占满包裹层 */
.bm-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
