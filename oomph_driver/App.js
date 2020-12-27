/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {Alert, StyleSheet, View, Text, Slider, Button} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {State, TextInput} from 'react-native-gesture-handler';
import Main from './Main.js';
import axios from 'axios';

// Android has to use this url to access localhost on machine
// uncomment if using ios Simulator
axios.defaults.baseURL = 'http://localhost:3000';
// uncomment if using android simulator
// axios.defaults.baseURL = 'http://10.0.2.2:3000';

// eslint-disable-next-line no-mixed-requires
var Datastore = require('react-native-local-mongodb'), db = new Datastore({filename: 'accountStore', autoload: true});

// Experimenting
const AuthContext = React.createContext();

// Using react-navigation to navigate from the little form page to the main page.
// The overarching widget is the app which encompasses both pages.
const Stack = createStackNavigator();

function EntryPage({navigation}) {
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState(1);

  const onSubmit = () => {
    if (name !== '' && licensePlate !== '') {
      // Simple Async storage but with security options
      db.insert(
        [{name: name, licensePlate: licensePlate, capacity: capacity}],
        (err, docs) => {
          axios
            .post('/newdriver', {
              name: name,
              licensePlate: licensePlate,
              capacity: capacity,
            })
            .then((res) => {
              db.update(
                {
                  name: name,
                  licensePlate: licensePlate,
                  capacity: capacity,
                },
                {
                  $set: {
                    id: res.data.id,
                  },
                },
                {},
                () => {
                  navigation.navigate('Main');
                },
              );
            })
            .catch((err) => {
              console.log(err.message);
            });
        },
      );
    } else {
      Alert.alert(
        'Please fill in both fields!',
        '',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container} backgroundColor="green">
      <View>
        <View style={styles.container2} backgroundColor="green">
          <View style={styles.container2} backgroundColor="green">
            <Text style={styles.formLabel}> Driver Form </Text>
            <View style={styles.container2} backgroundColor="green">
              <TextInput
                onChangeText={(val) => {
                  setName(val);
                }}
                placeholder="name"
                style={styles.inputStyle}
              />
              <TextInput
                onChangeText={(val) => setLicensePlate(val)}
                secureTextEntry={true}
                placeholder="license plate"
                style={styles.inputStyle}
              />
            </View>
          </View>
          <Text style={styles.formText}> Driving Capacity </Text>
          <Slider
            step={1}
            minimumValue={1}
            maximumValue={6}
            value={capacity}
            onValueChange={(val) => setCapacity(val)}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
          />
          <Text style={{textAlign: 'center'}}>{capacity} passenger</Text>
        </View>
      </View>
      <Button
        onPress={onSubmit}
        title="Submit"
        color="blue"
        accessibilityLabel="Submit"
      />
    </View>
  );
}

function App() {
  const [prev, setPrev] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      db.find({}, async (err, docs) => {
        if (docs != undefined && docs.length >= 1 && !err) {
          setPrev(true);
        }
      });
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!prev ? <Stack.Screen name="Sign In" component={EntryPage} /> : null}
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Ugly styles but whatevs
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingBottom: 20,
  },
  container2: {
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 50,
    color: '#fff',
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#DCDCDC',
  },
  formText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});

export default App;
