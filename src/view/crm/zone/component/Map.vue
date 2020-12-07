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
import debounce from "lodash/debounce";

@Component
export default class Home extends Vue {
  qq: any = null;
  map: any = null;
  multiMarker: any = null;
  multiPolygon: any = null;
  infoWindow: any = null;

  currentMarker: any = null;

  zones: any = [];

  isEditing: boolean = false;
  editor: any = null;
  editingZone: any = null;

  markersInView: any = null;
  markersInSelectedZone: any = [];
  centerMarker: any = null;
  selectedMarker: any = null;

  debBoundsChanged: any = null;

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
    this.$bus.$on("map:location:current:fetching", () => {
      this.fetchCurrentPosition();
    });

    this.$bus.$on("map:mode:editing", (v) => {
      this.isEditing = v;
    });

    this.$bus.$on("map:zone:selected", (v) => {
      this.editingZone = v;
    });

    this.$bus.$on("map:marker:selected", (v) => {
      this.selectedMarker = v;
    });

    this.$bus.$on("mongoMerchantZone", (v) => {
      this.zones = cloneDeep(v);
    });

    this.$bus.$on("map:markers:inSelectedZone", (v) => {
      this.markersInSelectedZone = cloneDeep(v);
    });

    this.$bus.$on("map:markers:inView", (v) => {
      this.markersInView = cloneDeep(v);
    });

    this.debBoundsChanged = debounce(() => {
      const bound = this.map.getBounds();
      this.$bus.$emit("map:bounds:changed", bound);
    }, 800);
  }

  @Watch("currentMarker")
  onCurPositionChanged() {
    this.showCurrentMarker();
  }

  @Watch("centerMarker")
  onCenterMarkerChanged() {
    this.showCenterMarker();
  }

  @Watch("zonesOnMap")
  onZonesOnMapChanged() {
    this.resetZonesOnMap();
  }

  @Watch("markersInView")
  onMarkersInViewChanged() {
    this.resetMarkersOnMap();
  }

  @Watch("markersInSelectedZone")
  onMarkersInSelectedZoneChanged() {
    this.resetMarkersOnMap();
  }

  @Watch("isEditing")
  onEditingChanged() {
    if (this.isEditing) {
      this.initEditor();
      this.resetEditingZoneOnEditor();
    } else {
      this.destroyEditor();
    }
  }

  @Watch("editingZone")
  onEditingZoneChanged() {
    this.resetEditingZoneOnEditor();
    this.showSelectedZone();
  }

  @Watch("selectedMarker")
  onSelectedMarkerChanged() {
    let geometry = null;
    if (this.selectedMarker) {
      const position = new this.qq.LatLng(
        this.selectedMarker.loc[1],
        this.selectedMarker.loc[0]
      );
      const infoWindow = this.buildInfoWindowContent(this.selectedMarker);

      this.centerMarker = {
        position: position,
        properties: {
          infoWindow: infoWindow,
        },
      };
    }
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
    this.map.on("bounds_changed", this.debBoundsChanged);
    this.debBoundsChanged();

    this.multiMarker = new this.qq.MultiMarker({
      map: this.map,
      styles: {
        defaultMarker: new this.qq.MarkerStyle({
          width: 15,
          height: 15,
          anchor: { x: 16, y: 32 },
          src:
            "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",
        }),
        curPositionMarker: new this.qq.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 16, y: 32 },
          src:
            "https://files.perlaedu.com/mobile/default/map-marker-current-position.png",
        }),
        inZoneMarker: new this.qq.MarkerStyle({
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

    this.fetchCurrentPosition();
  }

  initEditor() {
    if (!this.isEditing) return;

    if (!this.editor) {
      this.editor = new this.qq.tools.GeometryEditor({
        map: this.map,
        snappable: true,
      });

      this.editor.on("draw_complete", this.onEditorDrawFinished);
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

    this.cleanEditorOverlayList();
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

    if (this.editingZone) {
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

  cleanMarkersOnMap() {
    const geometries = this.multiMarker.getGeometries();
    this.multiMarker.remove(map(geometries, "id"));
    this.infoWindow.close();
  }

  resetMarkersOnMap() {
    if (!this.map) return;

    this.cleanMarkersOnMap();
    // 可视区域
    if (this.markersInView) {
      const markers = map(this.markersInView.list, (marker) => ({
        id: marker.id,
        styleId: "defaultMarker",
        position: new this.qq.LatLng(marker.loc[1], marker.loc[0]),
        properties: {
          infoWindow: this.buildInfoWindowContent(marker),
        },
      }));
      this.multiMarker.updateGeometries(markers);
    }

    // 选中区域
    if (this.markersInSelectedZone) {
      const markers = map(this.markersInSelectedZone.list, (marker) => ({
        id: marker.id,
        styleId: "inZoneMarker",
        position: new this.qq.LatLng(marker.loc[1], marker.loc[0]),
        properties: {
          infoWindow: this.buildInfoWindowContent(marker),
        },
      }));
      this.multiMarker.updateGeometries(markers);
    }

    this.showCurrentMarker(false);
    this.showCenterMarker(false);
  }

  onMarkerClicked(evt) {
    this.showInfoWindow(evt.geometry);
  }

  showInfoWindow(geometry) {
    if (geometry === "defaultMarker") return;

    this.infoWindow.open();
    this.infoWindow.setPosition(geometry.position);
    this.infoWindow.setContent(geometry.properties.infoWindow);
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

  onEditorDrawFinished(geometry) {
    this.startAjustify();
  }

  fetchCurrentPosition() {
    this.$hui.loading.show("查询中...");
    this.$qqMap.getCurLocation({
      callback: (location) => {
        this.$hui.loading.hide();
        this.selectedMarker = null;
        this.currentMarker = {
          position: new this.qq.LatLng(location.lat, location.lng),
          properties: {
            infoWindow: "您当前所在的位置",
          },
        };
        this.$bus.$emit("map:location:current:fetched", location);
      },
    });
  }

  showSelectedZone() {
    if (!this.editingZone) return;

    const center = this.qq.geometry.computeCentroid(
      this.coordinates2Paths(this.editingZone.location.coordinates)[0]
    );
    const title = this.editingZone.title;
    const follower = _get(this.editingZone, "follower.nickname", "-");
    const created_at = _get(this.editingZone, "_created_at", "-");

    this.centerMarker = {
      position: center,
      properties: {
        infoWindow: `<div><h3>${title}</h3><p style="font-size: 13px;">${created_at}</p><p style="font-size:13px;">${follower}</p></div>`,
      },
    };
  }

  showCurrentMarker(resetMap = true) {
    const id = "currentMarker";
    if (!this.currentMarker) {
      this.multiMarker.remove([id]);
      return;
    }

    const geometry = merge(
      {
        id: id,
        styleId: "curPositionMarker",
      },
      this.currentMarker
    );

    resetMap && this.map.setCenter(geometry.position);
    this.multiMarker.updateGeometries([geometry]);
    this.showInfoWindow(geometry);
  }

  showCenterMarker(resetMap = true) {
    const id = "center";
    if (!this.centerMarker) {
      this.multiMarker.remove([id]);
      return;
    }

    const geometry = merge(
      {
        id: id,
        styleId: "centerMarker",
      },
      this.centerMarker
    );

    resetMap && this.map.setCenter(geometry.position);
    this.multiMarker.updateGeometries([geometry]);
    this.showInfoWindow(geometry);
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
