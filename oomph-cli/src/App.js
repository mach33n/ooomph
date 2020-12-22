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

var map = null;
var gtBounds = [-84.419267,33.768374,-84.378433,33.785086];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      notifDriv: false,
      driverName: '',
      driverLicense: '',
      locM: null,
      destM: null
    };
  }

  componentDidMount() {
      // initialize map
      map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        // Bounds of gt campus
        bounds: gtBounds,
        zoom: 10
      });
      var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
        bbox: gtBounds,
        placeholder: 'Search places on campus'
      });
      // Add the geocoder to the map
      map.addControl(geocoder);
      this.onLocUpdate();
      geocoder.on('result', async (dest) => {
        this.rideReq(dest);
      });
  }

  componentDidUpdate() {
    this.onLocUpdate();
  }

  // This function updates the marker for the user position
  onLocUpdate = () => {
    navigator.geolocation.getCurrentPosition(position => {
      var user = document.createElement('user');
      user.className = 'user';

      var location = new mapboxgl.Marker(user);
      location.setLngLat([position.coords.longitude, position.coords.latitude]);
      location.addTo(map);
      try {
        this.state.locM.remove();
      }
      catch {
        console.log('A');  
      }
      this.setState({
        locM: location
      });
      if (this.state.selected) {
        var coord = this.state.destM.getLngLat()
        this.rideReq({result:{geometry:{coordinates:[coord.lng,coord.lat]}}})
      }
    });
  }

  withinBounds(bb, coord) {
    return bb[0] <= coord[0] && coord[0] <= bb[2] && bb[1] <= coord[1] && coord[1] <= bb[3]
  }

  // This function displays a given destination and its route.
  rideReq = async (dest) => {
    // put destination marker first
    try {
      this.state.destM.remove();
    }
    catch {
      console.log('B');  
    }

    var loc = this.state.locM.getLngLat();
    var dst = dest.result.geometry.coordinates
    
    if (!this.withinBounds(gtBounds,dst) || !this.withinBounds(gtBounds,[loc.lng,loc.lat])) {
      try {
        map.removeLayer('route');
        map.removeSource('route');
      }
      catch {
        console.log('C');  
      }
      return
    }

    var destM = new mapboxgl.Marker();
    destM.setLngLat(dest.result.geometry.coordinates);
    destM.addTo(map);
    this.setState({
      destM: destM
    });

    // assemble rough route outline
    const dirReq = {
      waypoints: [
        {coordinates: [loc.lng,loc.lat]},
        {coordinates: dest.result.geometry.coordinates},
      ],
      // could offer bike and walking options too
      profile: 'driving',
      geometries: 'geojson'
    }
    const resp = await directionsCli.getDirections(dirReq).send()

    try {
      map.removeLayer('route');
      map.removeSource('route');
    }
    catch {
      console.log('D');  
    }

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
      'line-color': '#5dde12',
      'line-width': 8
      }
    });
    this.setState({selected:true});
  }

  // This is meant to check if the user is within campus bounds and then if they are, request a driver.
  handleRideConf = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('Working Geolocator')
      var loc = this.state.locM.getLngLat();

      if (this.withinBounds(gtBounds, [loc.lng,loc.lat])) {
        console.log('Hey')
        axios.post('/getDriver', {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }).then(ret => {
          if (ret && ret.data != 'no') {
            console.log(ret.data)
            this.setState({driverName: ret.name, driverLicense: 'License Plate: ' + ret.data.licensePlate, notifDriv:true})
          } else {
           this.setState({driverName: 'No driver available', driverLicense: 'License Plate: None', notifDriv:true})
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        this.setState({driverName: 'Too Far', driverLicense: 'Sorry you are currently too far from campus', notifDriv:true})
      }
    }, (err) => {console.log(err)},{maximumAge:60000, timeout:5000, enableHighAccuracy:true})
  }

  onClose = () => {
    this.setState({notifDriv:false, driverName:'', driverLicense:''})
  }

  render() {
    return (
      <div className="App">
        {this.state.notifDriv ? 
          <div className="modal" id="modal">
          <h2>{this.state.driverName}</h2>
          <div className="content">{this.state.driverLicense}</div>
            <div className="actions">
              <button className="toggle-button" onClick={this.onClose}>
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
