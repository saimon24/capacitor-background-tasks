import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BackgroundRunner } from '@capacitor/background-runner';
import { GoogleMap, Marker } from '@capacitor/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;
  checkins: any[] = [];

  constructor() {}

  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: 'YOURKEY',
      config: {
        center: {
          lat: 51.88,
          lng: 7.6,
        },
        zoom: 8,
      },
    });
  }

  loadCheckins = async () => {
    const result = (await BackgroundRunner.dispatchEvent({
      label: 'com.capacitor.background.check',
      event: 'loadCheckins',
      details: {},
    })) as any;
    console.log('my result', result);
    if (result) {
      this.checkins = [];
      Object.keys(result).forEach((key) => {
        this.checkins.push(result[key]);
      });
      console.log('checkins', this.checkins);
      this.addMarkers();
    }
  };

  async addMarkers() {
    if (this.checkins.length === 0) {
      return;
    }
    const markers: Marker[] = this.checkins.map((item) => {
      return {
        coordinate: {
          lat: item.location.latitude,
          lng: item.location.longitude,
        },
        title: item.time,
      };
    });
    console.log('markers', markers);

    await this.map.addMarkers(markers);
  }
}
