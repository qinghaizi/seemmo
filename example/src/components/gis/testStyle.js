/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/11/02
 * Describe:
 * Log:
 *  ---- 2018/11/02 11:53 [lyuwei] 初次添加
 */
// let serverUrl = 'http://' + window.location.host + '/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seemmo:simplified_land_polygons&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL={x}&TILEROW={y}';
let serverUrl = 'http://' + window.location.host + '/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seemmo&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL={x}&TILEROW={y}'

export default {
  'version': 8,
  'name': 'Seemmo Streets',
  'sources': {
    'composite': {
      'tiles': [
        serverUrl
      ],
      'type': 'vector'
    },
    'seemmoWMTS': {
      // 数据源类型
      'type': 'raster',
      'tiles': [
        'http://10.10.4.47/map/tiledmap/{z}/{x}/{y}.png'
        // 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
        // 'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      'tileSize': 256
    }
  },
  'sprite': 'mapbox://sprites/mapbox/streets-v10',
  'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  'layers': [
    {
      'id': 'background',
      'type': 'background',
      'layout': {},
      'paint': {
        'background-color': {
          'base': 1,
          'stops': [
            [
              11,
              'hsl(35, 32%, 91%)'
            ],
            [
              13,
              'hsl(35, 12%, 89%)'
            ]
          ]
        }
      }
    },
    {
      'id': 'world',
      'type': 'fill',
      'source': 'composite',
      'source-layer': 'simplified_land_polygons',
      'layout': {},
      'maxzoom': 9,
      'paint': {
        'fill-color': '#000',
        // 'fill-color': '#ff030a',
        'fill-opacity': 0.4,
        'fill-antialias': false
      }
    },
    {
      'id': 'coast-poly',
      'type': 'fill',
      'source': 'composite',
      'source-layer': 'land_polygons',
      'layout': {},
      'minzoom': 9,
      'paint': {
        // 'fill-color': '#f2efe9',
        'fill-color': '#ff030a',
        'fill-antialias': false
      }
    }
    // {
    //     'id': 'simple-tiles',
    //     'type': 'raster',
    //     'source': 'seemmoWMTS',
    //     'paint': {
    //         'raster-opacity': 1
    //     }
    // }
  ],
  'owner': 'seemmo',
  'id': 'seemmo-lyuwei-v1'
}
