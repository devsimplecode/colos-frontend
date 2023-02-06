<script setup lang="ts">
import type { CoordinateItem, MarkerIcon } from '../models';

type Props = {
  position: CoordinateItem;
  clickable?: boolean;
  draggable?: boolean;
  animationLevel?: number;
  icon: MarkerIcon;

};

withDefaults(defineProps<Props>(), {
  animationLevel: 4,
  clickable: false,
  draggable: false,
});

</script>

<template>
  <GMapMarker
      :position="position"
      :clickable="clickable"
      :draggable="draggable"
      :animation="animationLevel"
      :icon="icon"
  />
</template>
