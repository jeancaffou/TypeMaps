/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapMarkerOverlay, MapPoint, MapPosition, MarkerOptions} from './MapInterface'
import {GoogleMap} from './GoogleMap'
import {GoogleObject} from './GoogleObject'

export class GoogleMarkerOverlay extends GoogleObject<google.maps.OverlayView> implements MapMarkerOverlay {
  public map: GoogleMap;
  public instance: google.maps.OverlayView;
  public div: HTMLElement;
  public pos: MapPosition;
  public offset: MapPoint;

  public constructor(map: GoogleMap, position: MarkerOptions, offset: MapPoint) {
    super(map)

    this.pos = position
    this.offset = offset

    this.div = document.createElement('div')

    this.instance = new google.maps.OverlayView()
    this.instance.onAdd = this.onAdd.bind(this)
    this.instance.onRemove = this.onRemove.bind(this)
    this.instance.draw = this.onDraw.bind(this)
    this.instance.setMap(map.instance)

    this.addInternalListeners(this.instance)
  }

  public onAdd() {
    let panes = this.instance.getPanes()
    panes.overlayShadow.appendChild(this.div)
  }

  public onRemove() {
    this.div.parentNode.removeChild(this.div)
  }

  public onDraw() {
    if(this.instance) {
      let overlayProjection = this.instance.getProjection()
      if (overlayProjection) {
        let position = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.pos.lat, this.pos.lon))
        if (position != null) {
          this.div.style.left = (position.x - this.div.clientWidth / 2 + this.offset.x) + 'px'
          this.div.style.top = this.offset.y + position.y + 'px'
        }
      }
    }
  }

  public getPosition(): MapPosition {
    return this.pos
  }

  public setPosition(position: MapPosition): void {
    this.pos = position
    this.onDraw()
  }

}
