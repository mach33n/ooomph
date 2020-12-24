import React, { useEffect, useState, useRef } from 'react';
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

//test test

function App() {

  var [selected, setSelected] = useState(false)
  var [driverObj, changeDriverObj] = useState({driverName: '', driverLicense: '', notifDriv:false})
  var [locM, setLocM] = useState({})
  var [destM, setDestM] = useState({})
  
  var mapContainer = useRef(null)

  var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    bbox: gtBounds,
    placeholder: 'Search places on campus'
  })
  
  useEffect(() => init(),[])
  useEffect(() => onLocUpdate())

  var init = () => {
    // initialize map
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      // Bounds of gt campus
      bounds: gtBounds,
      zoom: 10
    })

    // Add the geocoder to the map
    map.addControl(geocoder)
    geocoder.on('result', (dest) => {
      var loc = locM.getLngLat()
      if (loc && withinBounds(gtBounds, [loc.lng,loc.lat])) {
        rideReq(dest)
      } else {
        changeDriverObj({driverName: 'Too Far', driverLicense: 'Sorry you are currently too far from campus', notifDriv:true})
      }
    })
  }
  
  // This function updates the marker for the user position
  var onLocUpdate = async () => {
    navigator.geolocation.getCurrentPosition(position => {
      // try {
      //   var loc = locM.getLngLat()
      //   if ([position.coords.longitude, position.coords.latitude] == [loc.lng,loc.lat]) {
      //     return 
      //   }
      // }
      // catch {
      //   console.log('No Loc Object')
      // }
      var user = document.createElement('user')
      user.className = 'user'
      var location = new mapboxgl.Marker(user)
      location.setLngLat([position.coords.longitude, position.coords.latitude])
      location.addTo(map)
      try {
        locM.remove()
      }
      catch {
        console.log('A');  
      }
      setLocM(location)
      if (selected) {
        var coord = destM.getLngLat()
        rideReq({result:{geometry:{coordinates:[coord.lng,coord.lat]}}})
      }
    })
  }

  const withinBounds = (bb, coord) => {
    return bb[0] <= coord[0] && coord[0] <= bb[2] && bb[1] <= coord[1] && coord[1] <= bb[3]
  }

  // This function displays a given destination and its route.
  var rideReq = async (dest) => {
    // put destination marker first
    try {
      destM.remove()
    }
    catch {
      console.log('B')
    }

    var loc = locM.getLngLat()
    var dst = dest.result.geometry.coordinates
    
    if (!withinBounds(gtBounds,dst) || !withinBounds(gtBounds,[loc.lng,loc.lat])) {
      try {
        map.removeLayer('route')
        map.removeSource('route')
      }
      catch {
        console.log('C')
      }
      return
    }

    var newDestM = new mapboxgl.Marker()
    newDestM.setLngLat(dest.result.geometry.coordinates)
    newDestM.addTo(map)
    setDestM(newDestM)

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
      map.removeLayer('route')
      map.removeSource('route')
    }
    catch {
      console.log('D')
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
    })
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
    })
    setSelected(true)
  }

  // This is meant to check if the user is within campus bounds and then if they are, request a driver.
  var handleRideConf = () => {
    navigator.geolocation.getCurrentPosition(position => {
      var loc = locM.getLngLat()
      if (withinBounds(gtBounds, [loc.lng,loc.lat])) {
        axios.post('/getDriver', {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }).then(ret => {
          if (ret && ret.data != 'no') {
            changeDriverObj({driverName: ret.name, driverLicense: 'License Plate: ' + ret.data.licensePlate, notifDriv:true})
          } else {
            changeDriverObj({driverName: 'No driver available', driverLicense: 'License Plate: None', notifDriv:true})
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        changeDriverObj({driverName: 'Too Far', driverLicense: 'Sorry you are currently too far from campus', notifDriv:true})
      }
    }, (err) => {console.log(err)}, {maximumAge:60000, timeout:5000, enableHighAccuracy:true})
  }

  var onClose = () => {
    changeDriverObj({notifDriv:false, driverName:'', driverLicense:''})
  }
  
  return (
    <div className="App">
      {driverObj.notifDriv ? 
        <div className="modal" id="modal">
        <h2>{driverObj.driverName}</h2>
        <div className="content">{driverObj.driverLicense}</div>
          <div className="actions">
            <button className="toggle-button" onClick={onClose}>
              close
            </button>
          </div>
        </div> : null}
      <Button id="confirm" variant="primary" size="lg" onClick={handleRideConf} disabled={!selected}>Confirm</Button>
      <div ref={el => mapContainer = el} className="mapContainer"/>
    </div>
  )
}

export default App;
