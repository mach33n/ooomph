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
MapboxGL.setConnected(true);

// Initialize an internal store for Authentication
// See
var Datastore = require('react-native-local-mongodb'),
  db = new Datastore({filename: 'accountStore', autoload: true});

// This is the main screen for driver map and navigation.
function Main({navigation, route}) {
  const [rideAlert, setRideAlert] = useState(false);
  const [rideAcc, setRideAcc] = useState(false);
  const [isGranted, setIsGranted] = useState(true);
  const [rideObj, setRideObj] = useState({});

  const [userId, setId] = useState('');
  const [name, setName] = useState('');

  // Uncomment for android
  const socket = new WebSocket('ws://10.0.2.2:3000');
  // Uncomment for ios
  //const socket = new WebSocket('ws://localhost:3000');

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
    console.log(res.data);
    console.log('Here');
    setRideObj({
      lat: res.data.lat,
      lon: res.data.lon,
      flat: res.data.flat,
      flon: res.data.flon,
    });
    // Want to recieve a distance value to go in notification.
    setRideAlert(true);
  };

  useEffect(() => {
    const init = async () => {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
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
    if (socket.readyState === WebSocket.OPEN) {
      var msg = {
        type: 'locUpdate',
        name: name,
        lat: location.coords.latitude,
        long: location.coords.longitude,
        active: true,
      };
      socket.send(JSON.stringify(msg));
    }
  };

  var NavPopUp = () => {
    return <Popup
      isVisible={rideAcc}
      onCancelPressed={() => {setRideAcc(false);}}
      onAppPressed={() => {setRideAcc(false);}}
      onBackButtonPressed={() => {setRideAcc(false);}}
      modalProps={{ // you can put all react-native-modal props inside.
          animationIn: 'slideInUp',
      }}
      options={{
        latitude: rideObj.flat,
        longitude: rideObj.flon,
        sourceLatitude: rideObj.lat,
        sourceLongitude: rideObj.lon,
        alwaysIncludeGoogle: true,
      }}
  />;
  };

  return (
    <SafeAreaView
      style={[{flex: 1}, {backgroundColor: 'blue'}]}
      forceInset={{top: 'always'}}>
      <Modal animationType="slide" transparent={true} visible={!isGranted}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Unable to load map, please enable location permissions in phone.
            </Text>
          </View>
        </View>
      </Modal>
      <NavPopUp/>
      <Modal
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
                  setRideAcc(true);
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
