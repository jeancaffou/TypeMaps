import {GoogleMap} from './GoogleMap'
import {MapTrafficLayer} from './MapInterface'
import {GoogleObject} from './GoogleObject'

export class GoogleTraffic extends GoogleObject<google.maps.TrafficLayer> implements MapTrafficLayer<google.maps.TrafficLayer, google.maps.Map> {
  public map: GoogleMap;
  public instance: google.maps.TrafficLayer;

  public constructor(map: GoogleMap) {
    super(map)

    this.instance = new google.maps.TrafficLayer({
      map: this.map.instance
    })
  }
}
