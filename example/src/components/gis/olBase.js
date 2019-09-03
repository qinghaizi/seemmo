/**
 * Created by lyuwei
 * User: lvwei@seemmo.com
 * Date: 2018/09/12
 * Describe:
 * Log:
 *  ---- 2018/09/12 09:48 [lyuwei] 初次添加
 */

import { SeeMap } from '#/index'

export function initMap (div) {
  let _map = new SeeMap(
      div,
      'http://localhost:8000',
      {
        defaultBaseLayer: 'http://10.10.4.92/map/tiledmap/black/{z}/{x}/{y}.png'
      }
    )
  // todo debuguser
  // let debugLayer = new TileLayer({
  //   source: new TileDebug({
  //     projection: 'EPSG:3857',
  //     tileGrid: _map.getBusinessLayerGroup().getLayers()[0].getSource().getTileGrid()
  //   })
  // })
  //
  // _map.getBusinessLayerGroup().addLayer(debugLayer)
  //
  // // todo interaction
  // let dragAndDropInteraction = new DragAndDrop({
  //   formatConstructors: [
  //     geojson
  //   ]
  // })
  //
  // dragAndDropInteraction.on('addfeatures', function (event) {
  //   let vectorsource = new VectorSource({
  //     features: event.features
  //   })
  //
  //   _map.addLayer(new VectorLayer({
  //     source: vectorsource
  //   }))
  //   _map.getView().fit(vectorsource.getExtent())
  // })
  // _map.addInteraction(dragAndDropInteraction)

  return _map
}
