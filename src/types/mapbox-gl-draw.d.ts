
/// <reference types="mapbox-gl" />
/// <reference types="geojson" />

declare module "@mapbox/mapbox-gl-draw" {

    interface drawOptions {
        keybindings?: boolean
        touchEnabled?: boolean
        boxSelect?: boolean
        clickBuffer?: number
        touchBuffer?: number
        controls?: {
            point?: boolean
            line_string?: boolean
            polygon?: boolean
            trash?: boolean
            combine_features?: boolean
            uncombine_features?: boolean
        }
        displayControlsDefault?: boolean
        styles?: mapboxgl.Style
        modes?: object
        defaultMode?: string
    }

    interface test {
        modes: object
    }

    export default MapboxDraw

    class MapboxDraw {
        constructor(options?: drawOptions)

        static modes: object

        add(geojson: GeoJSON.GeoJSON): string[]
        get(featureId: string): GeoJSON.Feature | void

        getFeatureIdsAt(point: { x: number, y: number }): string[]
        getSelectedIds(): Array<string>
        getSelected(): GeoJSON.FeatureCollection
        getSelectedPoints(): GeoJSON.FeatureCollection
        getAll(): GeoJSON.FeatureCollection

        delete(ids: string | Array<string>): this
        deleteAll(): this

        set(featureCollection: GeoJSON.FeatureCollection): Array<string>

        trash(): this
        combineFeatures(): this
        uncombineFeatures(): this

        getMode(): string

        changeMode(mode: string, options?: Object): this
        setFeatureProperty(featureId: string, property: string, value: any): this

        // default IControl
        onAdd(map: mapboxgl.Map): any
        onRemove(): any
    }

    type drawKey = 'simple_select' | 'direct_select' | 'draw_line_string' | 'draw_polygon' | 'draw_point'
    enum drawMode {
        SIMPLE_SELECT = 'simple_select',
        DIRECT_SELECT = 'direct_select',
        DRAW_LINE_STRING = 'draw_line_string',
        DRAW_POLYGON = 'draw_polygon',
        DRAW_POINT = 'draw_point',
    }
}