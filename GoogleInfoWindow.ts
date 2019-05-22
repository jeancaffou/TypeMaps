/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapInfoWindow, MapPosition, MarkerOptions} from './MapInterface'
import {GoogleMap} from './GoogleMap'
import {GoogleObject} from './GoogleObject'

export class GoogleInfoWindow extends GoogleObject<google.maps.InfoWindow> implements MapInfoWindow<google.maps.InfoWindow, google.maps.Map> {
  private closeCallback: Function;
  private parent: google.maps.MVCObject;

  public map: GoogleMap;
  public instance: google.maps.InfoWindow;

  public constructor(map: GoogleMap, position: MarkerOptions, parent?: any) {
    super(map)

    this.instance = new google.maps.InfoWindow()

    if(position) {
      this.setPosition(position)
    }

    if(parent) {
      this.parent = parent.instance
    }

    this.addInternalListeners(this.instance)
    this.instance.addListener('closeclick', this.close.bind(this))
    this.open()
  }

  public setPosition(position: MapPosition): void {
    this.instance.setPosition({lat: position.lat, lng: position.lon})
  }

  public getPosition(): MapPosition {
    return {lat: this.instance.getPosition().lat(), lon: this.instance.getPosition().lng()}
  }

  public setParent(parent: any) {
    this.parent = parent.instance
  }

  public setContent(content: string | HTMLElement) {
    this.instance.setContent(content)
  }

  public onClose(callback: Function): void {
    this.closeCallback = callback
  }

  public open(): void {
    this.instance.open(this.map.instance, this.parent)
  }

  public close(): void {
    this.instance.close()
    if(this.closeCallback) {
      this.closeCallback()
    }
  }
}
