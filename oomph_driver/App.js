/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Slider
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';

class EntryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      licensePlate: '',
      capacity: 1
    }
  }

  render() {
    return (
      <View style={styles.container} backgroundColor='green'>
         <Text style={styles.formLabel}> Driver Form </Text>
          <View>
            <TextInput 
              placeholder="name" 
              style={styles.inputStyle}/>
            <TextInput
              secureTextEntry={true}
              placeholder="license plate"
              style={styles.inputStyle}
            />
            <Text style={styles.formText}> Driving Capacity </Text>
            <Slider
              step={1}
              minimumValue={1}
              maximumValue={6}
              value={this.state.capacity}
              onValueChange={val => this.setState({ capacity: val })}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
            <Text style={{textAlign: 'center'}}>{this.state.capacity} passenger</Text>
          </View>
      </View>
    )
  }
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
