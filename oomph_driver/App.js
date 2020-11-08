/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Slider,
  Button,
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';
import Main from './Main.js';
import axios from 'axios';

// Android has to use this url to access localhost on machine
axios.defaults.baseURL='http://10.0.2.2:3000'
 
function EntryPage({ navigation }) {
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState(1);

  const onSubmit = async () => {
    if (name != '' && licensePlate != '') {
      await axios.post('/newdriver', {
        name: name,
        licensePlate: licensePlate,
        capacity: capacity
      }).then(res => {
        navigation.navigate('Main', {
          name: name
        })
      }).catch(err => {
        console.log(err.message);
      })
    } else {
      Alert.alert(
        "Please fill in both fields!",
        "",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <View style={styles.container} backgroundColor='green'>
        <Text style={styles.formLabel}> Driver Form </Text>
        <View>
          <TextInput 
            onChangeText={(val) => {setName(val)}}
            placeholder="name" 
            style={styles.inputStyle}/>
          <TextInput
            onChangeText={(val) => setLicensePlate(val)}
            secureTextEntry={true}
            placeholder="license plate"
            style={styles.inputStyle}
          />
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
        <Button
          onPress={onSubmit}
          title="Submit"
          color="blue"
          accessibilityLabel="Submit"
        />
    </View>
  )
}

const Stack = createStackNavigator();
class App extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen name="Entry" component={EntryPage} />
          <Stack.Screen name="Main" component={Main} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },

  formLabel: {
    fontSize: 20,
    color: '#fff',
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
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
