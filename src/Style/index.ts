
export interface Style {
    /** 样式唯一id，注意保持全局唯一！如果不设置将会自动创建唯一id */
    id?: string
    type?: 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion' | 'raster' | 'background' | 'heatmap' | 'hillshade'
    
    metadata?: any
    ref?: string

    /** < 的时候隐藏 */
    minzoom?: number
    /** >= 的时候隐藏 */
    maxzoom?: number

    interactive?: boolean

    filter?: any[]
    layout?: mapboxgl.BackgroundLayout | mapboxgl.FillLayout | mapboxgl.FillExtrusionLayout | mapboxgl.LineLayout |
    mapboxgl.SymbolLayout | mapboxgl.RasterLayout | mapboxgl.CircleLayout | mapboxgl.HeatmapLayout | mapboxgl.HillshadeLayout;
    paint?: mapboxgl.BackgroundPaint | mapboxgl.FillPaint | mapboxgl.FillExtrusionPaint | mapboxgl.LinePaint |
    mapboxgl.SymbolPaint | mapboxgl.RasterPaint | mapboxgl.CirclePaint | mapboxgl.HeatmapPaint | mapboxgl.HillshadePaint;
}