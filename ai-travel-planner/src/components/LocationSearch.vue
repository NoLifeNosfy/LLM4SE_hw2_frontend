<template>
  <div class="location-search-container">
    <el-input
      v-model="searchQuery"
      placeholder="Search for a location"
      clearable
      @input="handleSearchInput"
    >
      <template #append>
        <el-button :icon="Search" @click="search"></el-button>
      </template>
    </el-input>

    <div class="region-selects">
      <el-select v-model="selectedProvince" placeholder="请选择省份" style="width: 100%;" @change="handleProvinceChange">
        <el-option v-for="province in provinces" :key="province.code" :label="province.name" :value="province.code"></el-option>
      </el-select>
      <el-select v-model="selectedCity" placeholder="请选择城市" style="width: 100%;">
        <el-option v-for="city in cities" :key="city.code" :label="city.name" :value="city.name"></el-option>
      </el-select>
    </div>

    <div class="search-results" v-loading="loading">
      <el-card
        v-for="location in locationStore.searchResults"
        :key="location.id"
        class="location-card"
        :class="{ 'is-selected': selectedLocation && selectedLocation.id === location.id }"
        shadow="hover"
        @click="selectLocation(location)"
      >
        <div class="location-info">
          <div class="location-name">{{ location.name }}</div>
          <div class="location-address">{{ location.address }}</div>
        </div>
      </el-card>
      <p v-if="!loading && locationStore.searchResults.length === 0 && searchQuery">No results found.</p>
    </div>

    <div class="map-preview">
      <LocationPickerMap ref="mapPicker" :locations="locationStore.searchResults" @select-location="selectLocation" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useLocationStore } from '../store/locationStore';
import { Search } from '@element-plus/icons-vue';
import type { Location } from '../api/location';
import LocationPickerMap from './LocationPickerMap.vue';
import { provinces as provinceData, cities as cityData } from '../data/china-divisions';

const emit = defineEmits(['select-location']);

const locationStore = useLocationStore();
const searchQuery = ref('');
const loading = ref(false);
const selectedLocation = ref<Location | null>(null);
const mapPicker = ref<InstanceType<typeof LocationPickerMap> | null>(null);

const provinces = ref<any[]>(provinceData);
const cities = ref<any[]>([]);
const selectedProvince = ref('');
const selectedCity = ref('');

let searchTimer: number | undefined;

const handleProvinceChange = (provinceCode: string) => {
  cities.value = cityData[provinceCode] || [];
  selectedCity.value = ''
};

const handleSearchInput = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    search();
  }, 500);
};

const search = async () => {
  if (searchQuery.value && selectedCity.value) {
    loading.value = true;
    await locationStore.searchLocations(searchQuery.value, selectedCity.value);
    loading.value = false;
  }
};

const selectLocation = (location: Location) => {
  selectedLocation.value = location;
  emit('select-location', location);
  if (mapPicker.value) {
    mapPicker.value.centerOnLocation(location);
  }
};

watch(selectedCity, () => {
  search();
});
</script>

<style scoped>
.location-search-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.region-selects {
  display: flex;
  gap: 10px;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.location-card {
  margin-bottom: 10px;
  cursor: pointer;
}

.location-card.is-selected {
  border: 2px solid #409eff;
}

.location-info {
  display: flex;
  flex-direction: column;
}

.location-name {
  font-weight: bold;
}

.location-address {
  font-size: 0.9em;
  color: #606266;
}

.map-preview {
  height: 400px;
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
