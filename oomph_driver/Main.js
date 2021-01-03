/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Popup } from 'react-native-map-link';

// Initialize some Mapbox credentials
// See https://github.com/react-native-mapbox-gl/maps
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic21hY2tjYW0iLCJhIjoiY2p3NWx0Z3ZoMXVldjQ4cXF6MWZrMGZ5NyJ9.EgCkRVGAAUDmUVYR-JSfeg',
);
// Uncomment for android
//MapboxGL.setConnected(true);

// Initialize an internal store for Authentication
// See
var Datastore = require('react-native-local-mongodb'),
  db = new Datastore({filename: 'accountStore', autoload: true});

// This is the main screen for driver map and navigation.
function Main({navigation, route}) {
  const [rideAlert, setRideAlert] = useState(false);
  const [isGranted, setIsGranted] = useState(true);
  const [rideObj, setRideObj] = useState({});
  const [userId, setId] = useState('');
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Uncomment for android
  //const socket = new WebSocket('ws://10.0.2.2:3000');
  // Uncomment for ios
  const socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('connected to socket');
    console.log(route.params);
    // This will send the driver ID so the server can match up
    // the driver and their websocket connection. See server.js line 37
    // Some bug where initial driver login crashes on first go
    // Gonna report in trello but issue goes away if you just refresh app
    var msg = {
      type: 'intro',
      id: route.params.userId,
    };
    socket.send(JSON.stringify(msg));
  };

    socket.onmessage = (res) => {
      setRideObj(JSON.parse(res.data))
      // Want to recieve a distance value to go in notification.
      setRideAlert(true);
    };

  useEffect(() => {
    const init = async () => {
      //const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      setIsGranted(isGranted);

      if (isGranted) {
        MapboxGL.locationManager.start();
      }

      setName(route.params.name);
      setId(route.params.userId);
    };
    init();
  }, []);

  var onUpdate = (location) => {
    console.log('Update')
    if (socket.readyState === WebSocket.OPEN) {
      try {
        var msg = {
          type: 'locUpdate',
          name: name,
          lat: location["coords"].latitude,
          long: location["coords"].longitude,
          active: true,
        };
      }
      catch {
        var msg = {
          type: 'locUpdate',
          name: name,
          lat: 0,
          long: 0,
          active: true,
        };
      }
      socket.send(JSON.stringify(msg));
      console.log('Complete')
    }
  };

  NoMap = () => {
    return <Modal animationType="slide" transparent={true} visible={!isGranted}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Unable to load map, please enable location permissions in phone.
                </Text>
              </View>
            </View>
          </Modal>
  }

  RideNotif = () => {
    return <Modal
              animationType="slide"
              transparent={true}
              visible={rideAlert}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Rider within X distance. Want to pickup?
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight
                      style={{
                        ...styles.openButton,
                        backgroundColor: '#2196F3',
                        margin: 10,
                      }}
                      onPress={() => {
                        setRideAlert(!rideAlert);
                        setIsVisible(true);
                      }}>
                      <Text style={styles.textStyle}>Yes I do</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{
                        ...styles.openButton,
                        backgroundColor: '#2196F3',
                        margin: 10,
                      }}
                      onPress={() => {
                        setRideAlert(!rideAlert);
                      }}>
                      <Text style={styles.textStyle}>No Thanks</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
  }

  return (
    <SafeAreaView
      style={[{flex: 1}, {backgroundColor: 'blue'}]}
      forceInset={{top: 'always'}}>
      <NoMap/>
      <Popup
              isVisible={isVisible}
              onCancelPressed={() => setIsVisible(false)}
              onAppPressed={() => setIsVisible(false)}
              onBackButtonPressed={() => setIsVisible(false)}
              modalProps={{ // you can put all react-native-modal props inside.
                  animationIn: 'slideInUp'
              }}
              appsWhiteList={[ /* Array of apps (apple-maps, google-maps, etc...) that you want
              to show in the popup, if is undefined or an empty array it will show all supported apps installed on device.*/ ]}
              appTitles={{ /* Optional: you can override app titles. */ }}
              options={{
                  latitude: rideObj["flat"],
                  longitude: rideObj["flon"],
                  sourceLatitude: rideObj["lat"],  // optionally specify starting location for directions
                  sourceLongitude: rideObj["long"],  // not optional if sourceLatitude is specified
                  // title: 'The White House',  // optional
                  // googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                  // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                  alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                  dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                  dialogMessage: 'Please select an app for navigation.', // optional (default: 'What app would you like to use?')
                  cancelText: 'Never Mind', // optional (default: 'Cancel')
                  // appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
                  // naverCallerName: 'com.example.myapp' // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
                  // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                  // app: 'uber'  // optionally specify specific app to use
              }}
              style={{ /* Optional: you can override default style by passing your values. */ }}
            />
      <RideNotif/>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Dark.styleURL}
        style={{flex: 1}}>
        <MapboxGL.Camera followZoomLevel={12} followUserLocation />
        <MapboxGL.UserLocation minDisplacement={30} onUpdate={onUpdate} />
      </MapboxGL.MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Main;
