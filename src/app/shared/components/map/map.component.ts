import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

interface MarkerData {
  position: google.maps.LatLngLiteral;
  title: string;
  address: string;
  placeId: string;
  rating?: number;
  reviews?: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  imports: [GoogleMapsModule, CommonModule],
  styleUrl: './map.component.scss'
})
export class MapComponent  {
    @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;

  markers: MarkerData[] = [
    {
      position: { lat: 41.6561, lng: -0.8577 },
      title: 'Training Zone Centro de entrenamiento personal',
      address: 'C. de Balbino Orensanz, 41, 50014 Zaragoza',
      placeId: 'ChIJiztVKN0VWQ0RuhgVIWPWOPw'
    },
    {
      position: { lat: 41.6508179, lng: -0.8886748 },
      title: 'Training Zone Centro de entrenamiento personal',
      address: 'Av. de César Augusto, 16, Casco Antiguo, 50004 Zaragoza',
      placeId: 'ChIJB70R7r0VWQ0RTN1Eh8gjLNE'
    }
  ];

  center: google.maps.LatLngLiteral = { lat: 41.653459, lng: -0.873187 };
  zoom = 13;
  mapOptions: google.maps.MapOptions = {};
  selectedMarker?: MarkerData;

  
  ngAfterViewInit(): void {
    if (this.map.googleMap) {
      const placesService = new google.maps.places.PlacesService(this.map.googleMap);

      this.markers.forEach((markerData, index) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: markerData.placeId,
          fields: ['rating', 'user_ratings_total']
        };

        placesService.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            this.markers[index] = {
              ...markerData,
              rating: place.rating,
              reviews: place.user_ratings_total
            };
          } else {
            console.error(`Error al obtener detalles de Places para ${markerData.title}: ${status}`);
          }
        });
      });
    }
  }

  openInfo(marker: MapMarker, markerData: MarkerData) {
    this.selectedMarker = markerData;
    this.infoWindow.open(marker);
  }
}