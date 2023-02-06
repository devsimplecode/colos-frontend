<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ShipmentRouteItem } from '@/services/api/shipments';

const { t } = useI18n({ useScope: 'global' });

defineProps({
  shipmentPointOfDeparture: {
    type: String,
    default: '',
  },
  shipmentPointOfDestination: {
    type: String,
    default: '',
  },
  shipmentLocation: {
    type: String,
    default: '',
  },
  shipmentRouteList: {
    type: Array as PropType<ShipmentRouteItem[]>,
    default: () => [],
  },
});

const isShowMoreInfoAboutTracking = ref<boolean>(false);
</script>

<template>
  <div class="card-container">
    <section
      class="card-item"
      :class="{
        'card-front-rotate': isShowMoreInfoAboutTracking,
      }"
    >
      <div>
        <div class="mb-[12px] flex items-center justify-between">
          <h2 class="text-accent-light text-h3">
            {{ t('titles.info') }}
          </h2>
          <button
            v-if="shipmentRouteList.length > 0"
            type="button"
            class="btn-with-bottom-line"
            @click="isShowMoreInfoAboutTracking = !isShowMoreInfoAboutTracking"
          >
            {{ t('buttons.show_more') }}
          </button>
        </div>
        <dl class="flex items-center flex-wrap gap-y-[12px]">
          <dt
            class="basis-1/2 min-h-[18px] leading-[18px] pl-[25px] text-accent-light uppercase text-h4 bg-no-repeat bg-left-center bg-[length:16px_16px] bg-record"
          >
            {{ t('titles.departure') }}
          </dt>
          <dd class="basis-1/2 text-xs text-white font-normal text-right">
            {{ shipmentPointOfDeparture }}
          </dd>
          <dt
            class="basis-1/2 min-h-[18px] leading-[18px] pl-[25px] text-accent-light uppercase text-h4 bg-no-repeat bg-left-center bg-[length:16px_16px] bg-ellipse"
          >
            {{ t('titles.destination') }}
          </dt>
          <dd class="basis-1/2 text-xs text-white font-normal text-right">
            {{ shipmentPointOfDestination }}
          </dd>
          <dt
            class="basis-1/2 min-h-[18px] leading-[18px] pl-[25px] text-accent-light uppercase text-h4 bg-no-repeat bg-left-center bg-[length:16px_16px] bg-location-current-green"
          >
            {{ t('titles.current_location') }}
          </dt>
          <dd class="basis-1/2 text-xs text-white font-normal text-right">
            {{ shipmentLocation }}
          </dd>
        </dl>
      </div>
    </section>
    <section
      class="card-item card-back"
      :class="{
        'card-back-rotate': isShowMoreInfoAboutTracking,
      }"
    >
      <div>
        <div class="flex w-full justify-end">
          <button
            type="button"
            class="btn-with-bottom-line"
            @click="isShowMoreInfoAboutTracking = !isShowMoreInfoAboutTracking"
          >
            {{ t('buttons.close') }}
          </button>
        </div>
        <div
          v-for="route of shipmentRouteList"
          :key="route.GUID"
          class="flex items-center justify-between before:order-2 before:w-6 before:h-2 before:bg-no-repeat before:absolute before:left-[50%]"
          :class="{
            'before:bg-arrow-right-long':
              route.PointOfDeparture && route.PointOfArrival,
          }"
        >
          <p class="order-1">{{ route.PointOfDeparture }}</p>
          <p class="order-3">{{ route.PointOfArrival }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.card-container {
  transform-style: preserve-3d;
  perspective: 1000px;
  @apply absolute bottom-[20px] left-0 right-0 mx-auto block  max-w-[500px]  h-[150px];
}

.card-item {
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
  backface-visibility: hidden;

  @apply p-[16px] rounded-[4px] bg-primary h-full overflow-y-auto;
}

.card-item::-webkit-scrollbar {
  width: 8px;
}

.card-item::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 4px;
}

.card-item::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 7px rgba(93, 182, 178, 0.9);
  border-radius: 4px;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: rotateX(180deg);
  transform-style: preserve-3d;
}

.card-back-rotate {
  transform: rotateX(0deg);
}

.card-front-rotate {
  transform: rotateX(-180deg);
}
</style>
