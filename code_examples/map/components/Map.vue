<script setup lang="ts">
import type { CoordinateItem } from '../models';

type Props = {
  mapId: string,
  center: CoordinateItem
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  fullscreenControl?: boolean;
  maxZoom?: number,
  minZoom?: number,
  zoom?: number;

};

withDefaults(defineProps<Props>(), {
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  maxZoom: 15,
  minZoom: 2,
  zoom: 2,
});

</script>

<template>
  <GMapMap
      :zoom="zoom"
      :center="center"
      class="w-full h-full"
      :options="{
        zoomControl,
        mapTypeControl,
        scaleControl,
        streetViewControl,
        rotateControl,
        fullscreenControl,
        mapId,
        maxZoom,
        minZoom,
      }"
  >
    <slot />
  </GMapMap>
</template>
