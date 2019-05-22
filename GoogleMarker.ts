/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapMarker, MapPosition, MarkerIcon, MarkerOptions} from './MapInterface'
import {GoogleMap} from './GoogleMap'
import {GoogleObject} from './GoogleObject'

export class GoogleMarker extends GoogleObject<google.maps.Marker> implements MapMarker<google.maps.Marker, google.maps.Map> {
  public map: GoogleMap;
  public instance: google.maps.Marker;

  public constructor(map: GoogleMap, options: MarkerOptions) {
    super(map)

    this.instance = new google.maps.Marker({
      map: this.map.instance,
      position: {lat: options.lat, lng: options.lon},
    })

    if(options.icon) this.setIcon(options.icon)
    if(options.label) this.setLabel(options.label)
    /*
    if(options.color) {
      this.instance.setIcon({
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: options.color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
      })
    }
    */

    this.addInternalListeners(this.instance)
  }

  public setLabel(label: string) {
    this.instance.setLabel({
      text: label ? label+'' : '',
      color: '#000'
    })
  }

  public setIcon(icon: MarkerIcon) {
    this.instance.setIcon({
      url: icon.url,
      anchor: new google.maps.Point(icon.anchor.x, icon.anchor.y)
    })
  }

  public setPosition(position: MapPosition): void {
    this.instance.setPosition({lat: position.lat, lng: position.lon})
  }

  public getPosition(): MapPosition {
    return {lat: this.instance.getPosition().lat(), lon: this.instance.getPosition().lng()}
  }

}
