/**
 * @project MyGPService v4
 * @author Žan Kafol on 7.1.2019
 */

export interface MapInterface<M> {
  API_KEY: string;
  instance: M;

  init (map: any, initialView: MapPosition): Promise<any>;

  setCenter(newCenter: MapPosition): void;
  panTo(position: MapPosition): void;
  setZoom(zoom: number): void;
  getZoom(): number;
  fitBounds(bounds: MapPosition[]): void;
  boundsContain(position: MapPosition): boolean;

  setMapType(mapType: string): void;

  addLayer(layer: any): any;

  removeLayer(layer: any): void;

  addTraffic(): any;
  addMarker(options: MarkerOptions): any;
  addInfoWindow(options: MarkerOptions, parent?: any): any;
  addMarkerOverlay(position: MarkerOptions, offset?: MapPoint): any;
  addPolyline(options: MapPolylineOptions): any;

  onDrag(callback: Function): void;

  geocode(pos: MapPosition): Promise<String>;
}

export interface MapPosition {
  lat: number;
  lon: number;
  zoom?: number;
}

export interface MapLayer<L, M> {
  map: MapInterface<M>;
  instance: L;

  listeners: {[key: string]: Function[]};

  addListener(event: string, callback: Function): void;
}

export interface MapTrafficLayer<L, M> {
  map: MapInterface<M>;
  instance: L;
}

export interface MapMarker<L, M> extends MapLayer<L, M> {
  setPosition(position: MapPosition): void;
  getPosition(): MapPosition;
  setIcon(icon: MarkerIcon): void;
  setLabel(label: string): void;
}

export interface MapInfoWindow<L, M> extends MapLayer<L, M> {
  setContent(content: string | HTMLElement);
  setPosition(position: MapPosition): void;
  setParent(parent: any): void;
  getPosition(): MapPosition;
  open(): void;
  close(): void;
  onClose(callback: Function): void;
}

export interface MapMarkerOverlay {
  div: HTMLElement;
  setPosition(position: MapPosition): void;
  getPosition(): MapPosition;
}

export interface MapPolyline<L, M> extends MapLayer<L, M> {
  setPath(path: MapPosition[]): void;
}

export interface MapPolylineOptions {
  path?: MapPosition[];
  color?: string;
  opacity?: number;
  weight?: number;
  animated?: boolean;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface MarkerIcon {
  url: string;
  anchor?: MapPoint;
}

export interface MarkerOptions extends MapPosition {
  icon?: MarkerIcon;
  label?: string;
  color?: string;
}
