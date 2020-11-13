import React from 'react';
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
import axios from 'axios';

// Initialize some Mapbox credentials
// See https://github.com/react-native-mapbox-gl/maps
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic21hY2tjYW0iLCJhIjoiY2p3NWx0Z3ZoMXVldjQ4cXF6MWZrMGZ5NyJ9.EgCkRVGAAUDmUVYR-JSfeg',
);
MapboxGL.setConnected(true);

// Todo: Add CSS file and input styles
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

// Fuckkkkkkk Socket.io we usin this shit
const socket = new WebSocket('ws://10.0.2.2:3000');
socket.onopen = () => {
  console.log('connected to socket')
}

// This is the main screen for driver map and navigation.
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rideAlert: false,
      isGranted: false
    };
  }

  async componentDidMount() {
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    this.setState({isGranted: isGranted});
    if (isGranted) {
      MapboxGL.locationManager.start();
    }
  }

  onUpdate = (location) => {
    var msg = {
      type: 'locUpdate',
      name: this.props.route.params.name,
      lat: location.coords.latitude,
      long: location.coords.longitude,
      active: true
    };
    socket.send(JSON.stringify(msg));
  };

  render() {
    return (
      <SafeAreaView
        style={[{flex: 1}, {backgroundColor: 'blue'}]}
        forceInset={{top: 'always'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={!this.state.isGranted}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Unable to load map, please enable location permissions in phone.
              </Text>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.rideAlert}
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
                    this.setState({rideAlert: !this.state.rideAlert});
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
                    this.setState({rideAlert: !this.state.rideAlert});
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
          <MapboxGL.UserLocation
            minDisplacement={30}
            onUpdate={this.onUpdate}
          />
        </MapboxGL.MapView>
      </SafeAreaView>
    );
  }
}

export default Main;
