const turfCircle = require('@turf/circle').default;
import turfLength from '@turf/length';


const doubleClickZoom = {
  enable: (ctx: any) => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (
        !ctx.map ||
        !ctx.map.doubleClickZoom ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      )
        return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx: any) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.doubleClickZoom.disable();
    }, 0);
  }
};

const DrawCircle = {
  // When the mode starts this function will be called.
  onSetup: function () {
    const circle = this.newFeature({
      type: "Feature",
      properties: {
        isCircle: true,
        center: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [[]]
      }
    });
    this.addFeature(circle);
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: "add" });
    this.setActionableState({
      trash: true
    });
    return {
      circle
    };
  },
  // support mobile taps
  onTap: function (state: any, e: any) {
    // emulate 'move mouse' to update feature coords
    if (state.circle.properties.center) this.onMouseMove(state, e);
    // emulate onClick
    this.onClick(state, e);
  },
  // Whenever a user clicks on the map, Draw will call `onClick`
  onClick: function (state: any, e: any) {
    if (state.circle.properties.center.length === 0) {
      const center = [e.lngLat.lng, e.lngLat.lat];
      state.circle.properties.center = center;
    } else {
      return this.changeMode("simple_select", { featureIds: [state.circle.id] });
    }
  },
  onMouseMove: function (state: any, e: any) {
    let center = state.circle.properties.center
    if (center.length != 0) {
      let line = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [center, [e.lngLat.lng, e.lngLat.lat]]
        }
      })
      let len = turfLength(line, { units: 'kilometers' })
      const circleFeature = turfCircle(center, len);
      state.circle.incomingCoords(circleFeature.geometry.coordinates);
      state.circle.properties.radiusInKm = len;
    }
  },
  // Whenever a user clicks on a key while focused on the map, it will be sent here
  onKeyUp: function (state: any, e: any) {
    state
    if (e.keyCode === 27) return this.changeMode("simple_select");
  },
  onStop: function (state: any) {
    doubleClickZoom.enable(this);
    this.updateUIClasses({ mouse: "none" });
    this.activateUIButton();

    // check to see if we've deleted this feature
    if (this.getFeature(state.circle.id) === undefined) return;
  },
  toDisplayFeatures: function (state: any, geojson: any, display: any) {
    const isActivePolygon = geojson.properties.id === state.circle.id;
    geojson.properties.active = isActivePolygon ? "true" : "false";
    if (!isActivePolygon) return display(geojson);

    // Only render the circle if it has the center
    if (state.circle.properties.center.length ===0 ) return;
    return display(geojson);
  },
  onTrash: function (state: any) {
    this.deleteFeature([state.circle.id], { silent: true });
    this.changeMode("simple_select");
  }
};

export default DrawCircle;