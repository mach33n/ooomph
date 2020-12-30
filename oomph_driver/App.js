/* eslint-disable prettier/prettier */
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
//axios.defaults.baseURL = 'http://localhost:3000';
// uncomment if using android simulator
axios.defaults.baseURL = 'http://10.0.2.2:3000';

// eslint-disable-next-line no-mixed-requires
var Datastore = require('react-native-local-mongodb'),
  db = new Datastore({filename: 'accountStore', autoload: true});

const AuthContext = React.createContext();

// Using react-navigation to navigate from the little form page to the main page.
// The overarching widget is the app which encompasses both pages.
const Stack = createStackNavigator();

function EntryPage({navigation, route}) {
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState(1);

  const {signIn} = React.useContext(AuthContext);

  const onSubmit = () => {
    if (name !== '' && licensePlate !== '') {
      // Simple Async storage but with security options
      db.insert(
        [{name: name, licensePlate: licensePlate, capacity: capacity}],
        (err, docs) => {
          if (err) {
            console.log(err);
            return err;
          }
          axios
            .post('/newdriver', {
              name: name,
              licensePlate: licensePlate,
              capacity: capacity,
            })
            .then((res) => {
              console.log(res.data.id);
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
                  signIn({id: res.data.id, name: name})
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

function App({navigation}) {
  // const [prev, setPrev] = React.useState(false);
  // const [id, setId] = React.useState(false);
  // const [name, setName] = React.useState('');

  const [usrObj, authDispatch] = React.useReducer(
    (prevObj, action) => {
      switch (action.type) {
        case 'RESTORE_USER':
          return {
            ...prevObj,
            isLoading: false,
            userId: action.id,
            name: action.name,
          };
        case 'SIGN_IN':
          return {
            ...prevObj,
            isSignout: false,
            userId: action.id,
            name: action.name,
          };
        case 'SIGN_OUT':
          return {
            ...prevObj,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userId: null,
    },
  );

  React.useEffect(() => {
    // FUTURE_TODO: store user tokens off device
    // Fetch the user id from local db
    const init = async () => {
      var userId;

      try {
        db.find({}, (err, docs) => {
          if (err) {
            console.log('Cant seem to access device db.');
            console.log(err);
            return;
          }
          if (docs !== undefined && docs.length >= 1 && !err) {
            userId = docs[0].id;
            // further validate the id in the future
            authDispatch({type: 'RESTORE_USER', id: userId});
          }
          return;
        });
      } catch (e) {
        console.log(e);
        return;
      }
    };

    init();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // Comments directly from react native navigation documentation:

        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        console.log('Called HEre')

        authDispatch({type: 'SIGN_IN', id: data.id, name: data.name});
      },
      signOut: () => authDispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        authDispatch({type: 'SIGN_IN', id: data.id, name: data.name});
      },
    }),
    [],
  );

  // const checkAuth = () => {
  //   db.find({}, (err, docs) => {
  //     if (docs !== undefined && docs.length >= 1 && !err) {
  //       setId(docs[0].id);
  //       setName(docs[0].name);
  //       setPrev(true);
  //     }
  //   });
  //   //db.delete({}, (err, docs) => {})
  // };

  // React.useEffect(() => {
  //   checkAuth();
  // }, [id, name]);

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {usrObj.id != null ? (
            <Stack.Screen
              name="Sign In"
              component={EntryPage}
            />
          ) : (
            <Stack.Screen
              name="Main"
              component={Main}
              initialParams={{id: usrObj.id, name: usrObj.name}}
              options={({navigation, route}) => ({
                // Creates a "Logout" button that actually deletes user from db
                headerRight: () => (
                  <Button
                    disabled={!(usrObj.id == null)}
                    onPress={() => {
                      axios
                        .post('/removeDriver', {
                          id: usrObj.id,
                        })
                        .then(() => {
                          // Removes all stored information on driver device
                          db.remove({}, {multi: true}, (err, numRemoved) => {
                            if (err) {
                              console.log(err);
                              return;
                            }
                            console.log(numRemoved);
                            console.log('^^ number of drivers removed');
                          });
                        });
                      navigation.popToTop();
                    }}
                    title="Logout"
                    color="#0080ff"
                  />
                ),
              })}
            />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
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
