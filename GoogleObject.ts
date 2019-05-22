/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapInterface, MapLayer} from './MapInterface'
import {GoogleMap} from './GoogleMap'

export class GoogleObject<I> implements MapLayer<I, google.maps.Map> {
  public instance: I;
  public map: MapInterface<google.maps.Map>;
  public listeners: {[key: string]: Function[]};

  public constructor(map: GoogleMap) {
    this.map = map
    this.listeners = {
      click: [],
      dblclick: [],
      mouseover: [],
      mouseout: [],
    }
  }

  public addInternalListeners(instance: google.maps.MVCObject) {
    instance.addListener('click', (e) => this.emit.call(this, 'click', e))
    instance.addListener('mouseover', (e) => this.emit.call(this, 'mouseover', e))
    instance.addListener('mouseout', (e) => this.emit.call(this, 'mouseout', e))
  }

  public addListener(event: string, callback: Function): void {
    this.listeners[event].push(callback)
  }

  public emit(e: string, d: any) {
    for (let c of this.listeners[e]) {
      c.call(this.instance,{
        pos: {
          lat: d.latLng.lat(),
          lon: d.latLng.lng()
        }
      }, d)
    }
  }

}
