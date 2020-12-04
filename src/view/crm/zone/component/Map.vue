<template>
  <div class="wrapper map">
    <div ref="map" id="map" class="container" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";
import _get from "lodash/get";

@Component
export default class Home extends Vue {
  qq: any = null;
  map: any = null;
  center: any = null;
  multiMarker: any = null;
  multiPolygon: any = null;
  infoWindow: any = null;

  markers: any = [];
  zones: any = [];

  isEditing: boolean = false;
  editor: any = null;
  editingZone = null;

  get zonesOnMap() {
    if (this.isEditing) {
      return filter(
        _get(this.zones, "list", []),
        (zone) => zone.id !== _get(this.editingZone, "id")
      );
    }
    return this.zones.list;
  }

  activated() {
    this.initMap();
  }

  created() {
    this.$bus.$on("map:location:current", () => {
      this.setupCurrentGPS();
    });

    this.$bus.$on("map:mode:editing", (v) => {
      this.isEditing = v;
      this.isEditing && this.resetEditingZoneOnEditor();
    });

    this.$bus.$on("map:zone:selected", (v) => {
      this.editingZone = v;
      this.setupCenterBySelectedZone();
    });

    this.$bus.$on("mongoMerchantZone", (v) => {
      this.zones = cloneDeep(v);
    });

    this.$bus.$on("mongoMerchant", (v) => {
      this.markers = cloneDeep(v);
    });
  }

  @Watch("zonesOnMap")
  onZonesOnMapChanged() {
    this.resetZonesOnMap();
  }

  @Watch("markers")
  onMarkersChanged() {
    this.resetMarkersOnMap();
  }

  @Watch("isEditing")
  onEditingChanged() {
    this.isEditing ? this.initEditor() : this.destroyEditor();
  }

  @Watch("editingZone")
  onEditingZoneChanged() {
    this.resetEditingZoneOnEditor();
  }

  @Watch("center")
  onCenterChanged() {
    this.setupCenterGPS();
    this.$bus.$emit("map:center", this.center);
  }

  initMap() {
    // this.$qqMap
    //   .loadScripts()
    //   .then((qq) => {
    //     this.qq = qq;
    //     this._initMap();
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    this.qq = window.TMap;
    this._initMap();
  }

  _initMap() {
    this.map = this.$qqMap.getMap(this.$refs.map);
    this.map.on("click", this.onMapClicked);
    this.map.on("dblclick", this.onMapDBClicked);

    this.multiMarker = new this.qq.MultiMarker({
      map: this.map,
      styles: {
        defaultMarker: new this.qq.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 16, y: 32 },
          src:
            "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",
        }),
      },
    });
    this.multiMarker.on("click", this.onMarkerClicked);

    this.multiPolygon = new this.qq.MultiPolygon({
      map: this.map,
    });

    this.infoWindow = new this.qq.InfoWindow({
      map: this.map,
      position: new this.qq.LatLng(0, 0),
      offset: { x: 0, y: -32 },
    });
    this.infoWindow.close();

    this.resetZonesOnMap();
    this.resetMarkersOnMap();

    this.setupCurrentGPS();
  }

  initEditor() {
    if (!this.editor) {
      this.editor = new this.qq.tools.GeometryEditor({
        map: this.map,
        snappable: true,
      });

      this.editor.on("draw_complete", this.onDrawFinished);
      this.editor.on("adjust_complete", this.onEvent);
      this.editor.on("split_complete", this.onEvent);
      this.editor.on("union_complete", this.onEvent);
      this.editor.on("delete_complete", this.onEvent);
      this.editor.on("select", this.onSelected);
    }

    this.cleanEditorOverlayList();
    this.editor.addOverlay({
      overlay: new this.qq.MultiPolygon({
        map: this.map,
        styles: {
          highlight: new this.qq.PolygonStyle({
            color: "rgba(255, 255, 0, 0.6)",
          }),
        },
      }),
      selectedStyleId: "highlight",
    });
    this.startDraw();
  }

  cleanEditorOverlayList() {
    if (!this.editor) return;

    this.editor.stop();
    const overlayList = this.editor.getOverlayList();
    overlayList.forEach((ol) => {
      ol.overlay.setMap(null);
      ol.overlay.destroy();

      this.editor.removeOverlay(ol.id);
    });
  }

  destroyEditor() {
    if (!this.editor) return;

    const overlayList = this.editor.getOverlayList();
    overlayList.forEach((el) => {
      el.overlay.setMap(null);
      el.overlay.destroy();
    });
    this.editor.setMap(null);
    this.editor.destroy();
    this.editor = null;
  }

  startAjustify() {
    this.editor.setActionMode(this.qq.tools.constants.EDITOR_ACTION.INTERACT);
    this.editor.setSelectable(true);
  }

  startDraw() {
    this.editor.setActionMode(this.qq.tools.constants.EDITOR_ACTION.DRAW);
    this.editor.setSelectable(false);
  }

  coordinates2Paths(coordinates) {
    // mongo与腾讯地图之间的坐标保存是相反的
    return map(coordinates, (ring) =>
      map(ring, (pos) => new this.qq.LatLng(pos[1], pos[0]))
    );
  }

  resetEditingZoneOnEditor() {
    if (!this.isEditing) return;

    this.initEditor();
    if (!this.editingZone) return;

    this.editor.addOverlay({
      id: this.editingZone.id,
      name: this.editingZone.title,
      overlay: new this.qq.MultiPolygon({
        map: this.map,
        styles: {
          highlight: new this.qq.PolygonStyle({
            color: "rgba(255, 255, 0, 0.6)",
          }),
        },
        geometries: [
          {
            paths: this.coordinates2Paths(
              this.editingZone.location.coordinates
            ),
          },
        ],
      }),
      selectedStyleId: "highlight",
    });
    this.startAjustify();
  }

  cleanZonesOnMap() {
    const geometries = this.multiPolygon.getGeometries();
    this.multiPolygon.remove(map(geometries, "id"));
  }

  resetZonesOnMap() {
    if (!this.map) return;
    this.cleanZonesOnMap();
    const geometries = map(this.zonesOnMap, (zone) => ({
      id: zone.id,
      paths: this.coordinates2Paths(zone.location.coordinates),
    }));
    this.multiPolygon.add(geometries);
  }

  cleanMarkersOnMap() {
    const geometries = this.multiMarker.getGeometries();
    this.multiMarker.remove(map(geometries, "id"));
  }

  buildInfoWindowContent(merchant) {
    const url = this.$tools.resolveURL(this.$router, {
      name: "crmMerchantEditing",
      params: {
        merchantId: merchant.id,
      },
    });
    const cover =
      _get(merchant, "cover") ||
      require("@/asset/image/default/cover-merchant.png");
    return `<div style="max-width:80px; text-align: center;">
    <a href="${url}">
    <img src="${cover}" style="width:100%;"/>
    </a>
      <p style="font-size: 10px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
      ${merchant.title} 
      </p>
      </div>
      `;
  }

  resetMarkersOnMap() {
    if (!this.map || !this.markers || isEmpty(this.markers.list)) return;

    this.cleanMarkersOnMap();
    const markers = map(this.markers.list, (marker) => ({
      id: marker.id,
      styleId: "defaultMarker",
      position: new this.qq.LatLng(marker.loc[1], marker.loc[0]),
      properties: {
        infoWindow: this.buildInfoWindowContent(marker),
      },
    }));
    this.multiMarker.updateGeometries(markers);
    this.setupCenterGPS();
  }

  onMarkerClicked(evt) {
    this.infoWindow.open();
    this.infoWindow.setPosition(evt.geometry.position);
    this.infoWindow.setContent(evt.geometry.properties.infoWindow);
  }

  onMapClicked() {
    this.infoWindow.close();
    this.editor && this.editor.select([]);
  }

  onMapDBClicked() {
    const geometry = this.editor && this.editor.getSelectedList()[0];
    if (geometry) {
      this.$bus.$emit(
        "map:zone:saving",
        merge(cloneDeep(this.editingZone || {}), {
          location: {
            type: "MultiPolygon",
            coordinates: [map(geometry.paths, (path) => [path.lng, path.lat])],
          },
        })
      );
    } else {
      this.$bus.$emit("map:dbclicked");
    }
  }

  onDrawFinished(geometry) {
    this.startAjustify();
  }

  onSelected() {}

  onEvent(evt) {}

  setupCurrentGPS() {
    this.$hui.loading.show("查询中...");
    this.$qqMap.getCurLocation({
      callback: (location) => {
        this.$hui.loading.hide();
        this.center = new this.qq.LatLng(location.lat, location.lng);
      },
    });
  }

  setupCenterBySelectedZone() {
    if (!this.editingZone) return;

    this.center = this.qq.geometry.computeCentroid(
      this.coordinates2Paths(this.editingZone.location.coordinates)[0]
    );
  }

  setupCenterGPS() {
    if (isEmpty(this.center)) return;

    this.map.setCenter(this.center);
    this.multiMarker.updateGeometries([
      {
        id: "center",
        styleId: "centerMarker",
        position: this.center,
        properties: {
          infoWindow: "您当前所在的位置",
        },
      },
    ]);
  }
}
</script>
<style lang="scss" scoped>
.map {
  .container {
    width: 100vw;
    height: 100vh;
  }
}
</style>
