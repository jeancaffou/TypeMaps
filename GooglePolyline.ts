/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapPolyline, MapPolylineOptions, MapPosition} from './MapInterface'
import {GoogleMap} from './GoogleMap'
import {GoogleObject} from './GoogleObject'

export class GooglePolyline extends GoogleObject<google.maps.Polyline> implements MapPolyline<google.maps.Polyline, google.maps.Map> {
  public map: GoogleMap;
  public instance: google.maps.Polyline;
  public animation: number

  public constructor(map: GoogleMap, options: MapPolylineOptions) {
    super(map)

    this.instance = new google.maps.Polyline({
      map: this.map.instance,
      geodesic: true,
      strokeColor: options.color || '#000000',
      strokeOpacity: options.opacity || 1,
      strokeWeight: options.weight || 1,
    })

    if(options.path) {
      this.setPath(options.path)
    }

    if(options.animated) {
      this.instance.set('icons', [{
        icon: {
          strokeColor: '#ffffff', // options.color || '#000000',
          fillColor: '#ffffff',
          scale: 1,
          fillOpacity: 1,
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        },
        repeat: '80px',
        counter: 0
      }])

      this.animation = setInterval(() => {
          let arrows = this.instance.get('icons')
          arrows[0].counter += 0.5
          arrows[0].offset = (arrows[0].counter) + 'px'
          this.instance.set('icons', arrows)
      }, 1000 / 60)
    }

    this.addInternalListeners(this.instance)
  }

  public setPath(path: MapPosition[]): void {
    let gPath = []
    for(let pos of path) {
      gPath.push(new google.maps.LatLng(pos.lat, pos.lon))
    }
    //console.info(this.instance, gPath)
    this.instance.setPath(gPath)
  }

  public onDestroy() {
    if(this.animation) {
      clearInterval(this.animation)
    }
  }

}
