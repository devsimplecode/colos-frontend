<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import {CardShipmentItem, Map, MapMarker, MapPolyline} from "./components";
import MainLayout from '@/layout/MainLayout.vue';
import { ShipmentRouteItem, ShipmentLocation } from '@/services/api/shipments';
import { useShipmentStore, useModalStore } from '@/stores/rootStore';
import { AppUrls, styleMapId, getMiddlePoint, ModalIds } from '@/utils';

const { t } = useI18n();
const currentRoute = useRoute();
const shipmentStore = useShipmentStore();
const modalStore = useModalStore();
const GUID = currentRoute.params.guid as string;
const ID = currentRoute.params.id as string;
const type = currentRoute.params.type as string;

onMounted(async () => {
  const { shipmentRouteList, location, pointOfDeparture, pointOfDestination } =
    await shipmentStore.getShipmentRouteList({
      GUID,
    });
  currentShipmentRouteList.value = shipmentRouteList;
  currentShipmentLocation.value = location;
  currentShipmentPointOfDeparture.value = pointOfDeparture;
  currentShipmentPointOfDestination.value = pointOfDestination;

  if (
    (!currentShipmentRouteList.value ||
      currentShipmentRouteList.value.length < 1) &&
    !currentShipmentLocation.value
  ) {
    modalStore.setModal(ModalIds.ERROR);
    modalStore.setModalText('No shipment coordinates');
  }
});

const currentShipmentRouteList = ref<ShipmentRouteItem[] | null>(null);
const currentShipmentLocation = ref<ShipmentLocation | null>(null);
const currentShipmentPointOfDeparture = ref<string | null>(null);
const currentShipmentPointOfDestination = ref<string | null>(null);

const markerCoordinateList = computed(() => {
  return currentShipmentRouteList.value
    ?.slice(1, -1)
    ?.filter((r, i, currentArr) => {
      if (i === currentArr.length - 1) return true;
      const slicingCurrentArr: ShipmentRouteItem[] = currentArr.slice(i + 1);
      return !slicingCurrentArr.some(
        (slicingRoute) =>
          (slicingRoute.ArrivalLat === r.ArrivalLat &&
            slicingRoute.ArrivalLon === r.ArrivalLon &&
            slicingRoute.DepartureLat === r.DepartureLat &&
            slicingRoute.DepartureLon === r.DepartureLon) ||
          (slicingRoute.ArrivalLat === r.DepartureLat &&
            slicingRoute.ArrivalLon === r.DepartureLon &&
            slicingRoute.DepartureLat === r.ArrivalLat &&
            slicingRoute.DepartureLon === r.ArrivalLon),
      );
    })
    .flatMap((route) => {
      return [
        { lat: route.DepartureLat, lng: route.DepartureLon },
        { lat: route.ArrivalLat, lng: route.ArrivalLon },
      ];
    });
});

const markerPointDepartureCoordinate = computed(() => {
  if (
    !currentShipmentRouteList.value ||
    currentShipmentRouteList.value.length < 1
  ) {
    return null;
  }
  const firstRoute = currentShipmentRouteList.value[0];
  return {
    lat: firstRoute && firstRoute.DepartureLat,
    lng: firstRoute && firstRoute.DepartureLon,
  };
});

const markerPointArrivalCoordinate = computed(() => {
  if (
    !currentShipmentRouteList.value ||
    currentShipmentRouteList.value.length < 1
  ) {
    return null;
  }
  const lastRoute: ShipmentRouteItem =
    currentShipmentRouteList.value[currentShipmentRouteList.value.length - 1];
  return {
    lat: lastRoute && lastRoute.ArrivalLat,
    lng: lastRoute && lastRoute.ArrivalLon,
  };
});

const passedRouteList = computed(() => {
  return currentShipmentRouteList.value
    ?.filter((r) => r.Colored)
    .flatMap((route) => {
      return [
        { lat: route.DepartureLat, lng: route.DepartureLon },
        { lat: route.ArrivalLat, lng: route.ArrivalLon },
      ];
    });
});

const comingRouteList = computed(() => {
  return currentShipmentRouteList.value
    ?.filter((r) => !r.Colored)
    .flatMap((route) => {
      return [
        { lat: route.DepartureLat, lng: route.DepartureLon },
        { lat: route.ArrivalLat, lng: route.ArrivalLon },
      ];
    });
});

const lineSymbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  scale: 1,
};

const stylePassedRoute = {
  strokeColor: '#5DB6B2',
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

const styleComingRoute = {
  strokeOpacity: 0,
  icons: [
    {
      icon: lineSymbol,
      offset: '0',
      repeat: '8px',
    },
  ],
};

const mapCenter = computed(() => {
  if (
    !currentShipmentLocation.value &&
    (!currentShipmentRouteList.value ||
      currentShipmentRouteList.value?.length < 1)
  ) {
    return null;
  }
  if (!currentShipmentRouteList.value) {
    return null;
  }
  const lastRoute =
    currentShipmentRouteList.value[currentShipmentRouteList.value.length - 1];
  const [firstRoute] = currentShipmentRouteList.value;
  const firstPoint = {
    x: +firstRoute.DepartureLon,
    y: +firstRoute.DepartureLat,
  };
  const secondPoint = {
    x: +lastRoute.ArrivalLon,
    y: +lastRoute.ArrivalLat,
  };

  const { x, y } = getMiddlePoint({ firstPoint, secondPoint });

  return {
    lat: y,
    lng: x,
  };
});

const currentLocationMarkerPoints = computed(() => {
  if (
    !currentShipmentLocation.value &&
    (!currentShipmentRouteList.value ||
      currentShipmentRouteList.value?.length < 1)
  ) {
    return null;
  }

  const locationLat = currentShipmentLocation.value
    ? currentShipmentLocation.value.DestonationLat
    : '';
  const locationLon = currentShipmentLocation.value
    ? currentShipmentLocation.value.DestonationLon
    : '';

  if (
    !currentShipmentRouteList.value ||
    currentShipmentRouteList.value.length < 1 ||
    currentShipmentRouteList.value.every((r) => !r.Colored) ||
    currentShipmentRouteList.value.some((r) => {
      return (
        (r.ArrivalLat === +locationLat && r.ArrivalLon === +locationLon) ||
        (r.DepartureLat === +locationLat && r.DepartureLon === +locationLat)
      );
    })
  ) {
    return {
      lat: +locationLat,
      lng: +locationLon,
    };
  }

  const lastRoute =
    currentShipmentRouteList.value[currentShipmentRouteList.value.length - 1];
  if (lastRoute.Colored) {
    return {
      lat: +lastRoute.ArrivalLat,
      lng: +lastRoute.ArrivalLon,
    };
  }

  const copiedRouteList = [...currentShipmentRouteList.value];
  const lastPassedRouteIndex = copiedRouteList
    .reverse()
    .findIndex((r) => r.Colored);
  const firstCommingRouteAfterLastPassedRoute =
    copiedRouteList[lastPassedRouteIndex - 1];

  const firstPoint = {
    x: +firstCommingRouteAfterLastPassedRoute.DepartureLon,
    y: +firstCommingRouteAfterLastPassedRoute.DepartureLat,
  };
  const secondPoint = {
    x: +firstCommingRouteAfterLastPassedRoute.ArrivalLon,
    y: +firstCommingRouteAfterLastPassedRoute.ArrivalLat,
  };
  const { x, y } = getMiddlePoint({ firstPoint, secondPoint });

  return {
    lat: y,
    lng: x,
  };
});

</script>

<template>
  <template v-if="currentLocationMarkerPoints && mapCenter">
    <div class="w-full grow relative h-[730px] bg-gray-light">
      <Map
          :center="mapCenter"
          :mapId="styleMapId"
      >
        <template v-if="comingRouteList && passedRouteList">
          <MapPolyline
              :path="comingRouteList"
              :options="styleComingRoute"
          />
          <MapPolyline
              :path="passedRouteList"
              :options="stylePassedRoute"
          />
        </template>
        <MapMarker
            :position="currentLocationMarkerPoints"
            :animation="2"
            :z-index="1000"
            :icon="{
              url: '/../../images/current-location-marker.svg',
              anchor: {
                x: 55,
                y: 55,
              },
            }"
        />
        <template v-if="markerCoordinateList">
          <MapMarker
              v-for="(markerCoordinateItem, index) of markerCoordinateList"
              :key="index"
              :position="markerCoordinateItem"
              :icon="{
                url: '/../../images/small-ellipse.svg',
                anchor: {
                  x: 4,
                  y: 7,
                },
              }"
          />
        </template>
        <template v-if="markerPointDepartureCoordinate">
          <MapMarker
              :position="markerPointDepartureCoordinate"
              :icon="{
                url: '/../../images/record-icon.svg',
                anchor: {
                  x: 10,
                  y: 10,
                },
              }"
              />
        </template>
        <template v-if="markerPointArrivalCoordinate">
          <MapMarker
              :position="markerPointArrivalCoordinate"
              :icon="{
                url: '/../../images/small-ellipse.svg',
                scaledSize: { width: 25, height: 25 },
                anchor: {
                  x: 11,
                  y: 12,
                 },
              }"
          />
        </template>
      </Map>
      <div class="absolute top-7 left-0 right-0 mx-auto block max-w-max p-3 bg-primary rounded-xl">
        {{ ID }}
      </div>
      <CardShipmentItem
          :shipment-point-of-departure="currentShipmentPointOfDeparture ?? ''"
          :shipment-point-of-destination="currentShipmentPointOfDestination ?? ''"
          :shipment-location="currentShipmentLocation?.Location ?? ''"
          :shipment-route-list="currentShipmentRouteList ?? []"
      />
    </div>
  </template>
  <template v-else>
    <div class="w-full grow min-h-[700px] bg-gray-light">{{t('messages.empty_route')}}</div>
  </template>
</template>
