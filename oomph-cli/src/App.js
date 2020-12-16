import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';

mapboxgl.accessToken = 'pk.eyJ1Ijoic21hY2tjYW0iLCJhIjoiY2p3NWx0Z3ZoMXVldjQ4cXF6MWZrMGZ5NyJ9.EgCkRVGAAUDmUVYR-JSfeg';
axios.defaults.baseURL = "http://localhost:3000"

const directionsCli = MapboxDirectionsFactory({accessToken: 'pk.eyJ1Ijoic21hY2tjYW0iLCJhIjoiY2p3NWx0Z3ZoMXVldjQ4cXF6MWZrMGZ5NyJ9.EgCkRVGAAUDmUVYR-JSfeg'})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      notifDriv: false,
      driverName: '',
      driverLicense: ''
    };
  }

  componentDidMount() {
    // get current location using javascript
    navigator.geolocation.getCurrentPosition(position => {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        // Bounds of gt campus
        bounds: [-84.419267,33.768374,-84.378433,33.785086],
        zoom: 10
      });

      // add marker to current location
      // var marker = new mapboxgl.Marker()
      //   .setLngLat([position.coords.longitude, position.coords.latitude])
      //   .addTo(map);

      var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
        bbox: [-84.419267,33.768374,-84.378433,33.785086],
        placeholder: 'Search places on campus'
      });
        // Add the geocoder to the map
        map.addControl(geocoder);

        map.on('load', function() {
          map.addSource('single-point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });
          map.getSource('single-point').setData({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [position.coords.longitude, position.coords.latitude]
            }
          });
        });
        geocoder.on('result', async (e) => {
          map.addLayer({
            id: 'point',
            source: 'single-point',
            type: 'circle',
            paint: {
              'circle-radius': 10,
              'circle-color': '#448ee4'
            }
          });
          map.getSource('single-point').setData(e.result.geometry);
          const dirReq = {
            waypoints: [
              {coordinates: [position.coords.longitude, position.coords.latitude]},
              {coordinates: e.result.geometry.coordinates},
            ],
            profile: 'driving',
            geometries: 'geojson'
          }
          const resp = await directionsCli.getDirections(dirReq).send()
          console.log(resp.body.routes[0].geometry.coordinates)
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': resp.body.routes[0].geometry.coordinates
              }
              }
            });
            map.addLayer({
              'id': 'route',
              'type': 'line',
              'source': 'route',
              'layout': {
              'line-join': 'round',
              'line-cap': 'round'
              },
              'paint': {
              'line-color': '#888',
              'line-width': 8
              }
              });
            this.setState({selected:true});
        });
      })
  }

  // This is meant to check if the user is within campus bounds and then if they are, request a driver.
  handleRideConf = () => {
    navigator.geolocation.getCurrentPosition(position => {
      var bb = [33.76,-84.41,33.78,-84.37]
      var p = position.coords
      if ( bb[0] <= p.latitude && p.latitude <= bb[2] && bb[1] <= p.longitude && p.longitude <= bb[3]) {
        axios.post('/getDriver', {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }).then(ret => {
          if (ret && ret.data != 'no') {
           ret = JSON.parse(ret.data)
            this.setState({driverName: ret.name, driverLicense: 'License Plate: ' + ret.licensePlate, notifDriv:true})
          } else {
           this.setState({driverName: 'No driver available', driverLicense: 'License Plate: None', notifDriv:true})
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        this.setState({driverName: 'Too Far', driverLicense: 'Sorry you are currently too far from campus', notifDriv:true})
      }
    })
  }

  onClose = () => {
    this.setState({notifDriv:false, driverName:'', driverLicense:''})
  }

  render() {
    return (
      <div className="App">
        {this.state.notifDriv ? 
          <div class="modal" id="modal">
          <h2>{this.state.driverName}</h2>
          <div class="content">{this.state.driverLicense}</div>
            <div class="actions">
              <button class="toggle-button" onClick={this.onClose}>
                close
              </button>
            </div>
          </div>
          : null}
        <Button id="confirm" variant="primary" size="lg" onClick={this.handleRideConf} disabled={!this.state.selected}>Confirm</Button>
        <div ref = {el => this.mapContainer = el} className="mapContainer"/>
      </div>
    );
  }
}

export default App;
