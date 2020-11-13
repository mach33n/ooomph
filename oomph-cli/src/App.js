import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import socketIO from 'socket.io-client';

mapboxgl.accessToken = 'pk.eyJ1Ijoic21hY2tjYW0iLCJhIjoiY2p3NWx0Z3ZoMXVldjQ4cXF6MWZrMGZ5NyJ9.EgCkRVGAAUDmUVYR-JSfeg';
axios.defaults.baseURL = "http://localhost:3000"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      notifDriv: false
    };
  }

  componentDidMount() {
    // get current location using javascript
    navigator.geolocation.getCurrentPosition(position => {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 10
      });

      // add marker to current location
      var marker = new mapboxgl.Marker()
        .setLngLat([position.coords.longitude, position.coords.latitude])
        .addTo(map);

      var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
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
        
          map.addLayer({
            id: 'point',
            source: 'single-point',
            type: 'circle',
            paint: {
              'circle-radius': 10,
              'circle-color': '#448ee4'
            }
          });
        
          // Listen for the `result` event from the Geocoder
          // `result` event is triggered when a user makes a selection
          //  Add a marker at the result's coordinates
          geocoder.on('result', (e) => {
            map.getSource('single-point').setData(e.result.geometry);
          });
        });
        geocoder.on('result', () => {
          this.setState({selected:true});
        });
      })
  }

  handleRideConf = () => {
    navigator.geolocation.getCurrentPosition(position => {
       axios.post('/getDriver', {
         lat: position.coords.latitude,
         long: position.coords.longitude
       }).then(ret => {
         console.log(ret)
       }).catch(err => {
         console.log(err);
       })
    })
  }

  render() {
    return (
      <div className="App">
        <Button id="confirm" variant="primary" size="lg" onClick={this.handleRideConf} disabled={!this.state.selected}>Confirm</Button>{' '}
        <div ref = {el => this.mapContainer = el} className="mapContainer"/>
      </div>
    );
  }
}

export default App;
