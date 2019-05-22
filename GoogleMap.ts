/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

import {MapInterface, MapPoint, MapPolylineOptions, MapPosition, MarkerOptions} from './MapInterface'
import {GoogleMarker} from './GoogleMarker'
import {GoogleMarkerOverlay} from './GoogleMarkerOverlay'
import {GooglePolyline} from './GooglePolyline'
import {GoogleInfoWindow} from './GoogleInfoWindow'
import {GoogleTraffic} from './GoogleTraffic'

export class GoogleMap implements MapInterface<google.maps.Map> {
  private CALLBACK_NAME = 'googleCallback'
  private callbacks = {drag: null}
  public readonly API_KEY: string;
  public instance: google.maps.Map;

  public constructor (apiKey: string) {
    this.API_KEY = apiKey
  }

  public init (map: any, initialView: MapPosition): Promise<any> {
    let onApiLoaded = (): void => {
      this.instance = new google.maps.Map(map, {
        center: {lat: initialView.lat, lng: initialView.lon},
        zoom: initialView.zoom,
        gestureHandling: 'greedy',
        scaleControl: true,
        zoomControl: false,
        fullscreenControl: false,
        mapTypeControl: false
      })
      this.instance.addListener('dragend', (e) => {
        if (this.callbacks && this.callbacks.drag) {
          this.callbacks.drag()
        }
      })
    }

    if (this.checkIfGoogleLibraryIsLoaded()) {
      return Promise.resolve().then(onApiLoaded)
    } else {
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places&callback=${this.CALLBACK_NAME}`
      document.querySelector('head').appendChild(script)

      return new Promise((resolve, reject) => {
        try {
          window[this.CALLBACK_NAME] = resolve
        } catch(err) {
          reject(err)
        }
      }).then(onApiLoaded)
    }
  }

  public setCenter(newCenter: MapPosition) {
    this.instance.setCenter({lat: newCenter.lat, lng: newCenter.lon})
    if(newCenter.zoom) {
      this.instance.setZoom(newCenter.zoom)
    }
  }

  public setMapType(layer: string): void {
    this.instance.setMapTypeId(layer)
  }

   public addLayer(layer: any): any {
    layer.instance.setMap(this.instance)
  }

  public removeLayer(layer: any): void {
    layer.instance.setMap(null)
  }

  public addMarker(options: MarkerOptions): GoogleMarker {
    return new GoogleMarker(this, options)
  }

  public addMarkerOverlay(position: MarkerOptions, offset?: MapPoint): any {
    return new GoogleMarkerOverlay(this, position, offset)
  }

  public addInfoWindow(options: MarkerOptions, parent?: any): GoogleInfoWindow {
    return new GoogleInfoWindow(this, options, parent)
  }

  public addPolyline(options: MapPolylineOptions): any {
    return new GooglePolyline(this, options)
  }

  public addTraffic(): any {
    return new GoogleTraffic(this)
  }

  public panTo(position: MapPosition): void {
    this.instance.panTo({lat: position.lat, lng: position.lon})
  }

  public setZoom(zoom: number): void {
    this.instance.setZoom(zoom)
  }

  public getZoom(): number {
    return this.instance.getZoom()
  }

  public fitBounds(bounds: MapPosition[]): void {
    if(bounds && bounds.length) {
      let gBounds = new google.maps.LatLngBounds()
      bounds.map(pos => gBounds.extend({lat: pos.lat, lng: pos.lon}))
      this.instance.fitBounds(gBounds)
    }
  }

  public boundsContain(pos: MapPosition): boolean {
    let bounds = this.instance.getBounds()
    if(bounds) {
      return bounds.contains({lat: pos.lat, lng: pos.lon})
    }
    return false
  }

  public geocode(pos: MapPosition): Promise<String> {
    let geocoder = new google.maps.Geocoder
    return new Promise((resolve, reject) => {
      geocoder.geocode({'location': {lat: pos.lat, lng: pos.lon}}, results => {
          if (results[0]) {
            resolve(results[0].formatted_address)
          } else {
            reject()
          }
      })
    })
  }

  public onDrag(callback: Function): void {
    this.callbacks.drag = callback
  }

  private checkIfGoogleLibraryIsLoaded (): boolean {
    return !!this.getGoogleObject()
  }

  private getGoogleObject (): any {
    // @ts-ignore
    return window.google
  }

}
