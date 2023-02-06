<script setup lang="ts">
import type { CoordinateItem, PolylineStyleOptions } from '../models';

type Props = {
  path: CoordinateItem[];
  styleOptions?: Partial<PolylineStyleOptions>;

};

withDefaults(defineProps<Props>(), {
  styleOptions: {},
});

</script>

<template>
  <GMapPolyline
      ref="polyline"
      :path="path"
      :options="styleOptions"
  />
</template>
