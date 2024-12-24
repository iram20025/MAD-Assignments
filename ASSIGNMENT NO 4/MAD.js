import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps'; // Expo-compatible import
import { Provider } from 'react-redux'; 

const { width, height } = Dimensions.get('window');

// Redux Action Types
const SET_SCREEN = 'SET_SCREEN';
const SET_USERNAME = 'SET_USERNAME';
const SET_EMAIL = 'SET_EMAIL';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_CONFIRM_PASSWORD = 'SET_CONFIRM_PASSWORD';
const SET_PHONE = 'SET_PHONE';
const SET_LOCATION = 'SET_LOCATION';

// Redux Actions
const setScreen = (screen) => ({ type: SET_SCREEN, payload: screen });
const setUsername = (username) => ({ type: SET_USERNAME, payload: username });
const setEmail = (email) => ({ type: SET_EMAIL, payload: email });
const setPassword = (password) => ({ type: SET_PASSWORD, payload: password });
const setConfirmPassword = (confirmPassword) => ({ type: SET_CONFIRM_PASSWORD, payload: confirmPassword });
const setPhone = (phone) => ({ type: SET_PHONE, payload: phone });
const setLocation = (location) => ({ type: SET_LOCATION, payload: location });

// Initial Redux State
const initialState = {
  screen: 'login',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  location: null,
};

// Redux Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SCREEN:
      return { ...state, screen: action.payload };
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case SET_CONFIRM_PASSWORD:
      return { ...state, confirmPassword: action.payload };
    case SET_PHONE:
      return { ...state, phone: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    default:
      return state;
  }
};

// Redux Store
import { createStore } from 'redux';
const store = createStore(reducer);

const databaseUrl = "https://lab-terminal-ffda2-default-rtdb.firebaseio.com/";

const App = () => {
  const dispatch = useDispatch();
  const { screen, username, email, password, confirmPassword, phone, location } = useSelector((state) => state);

  const fetchAndStoreLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to access location was denied.');
      return;
    }
    const userLocation = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
    dispatch(setLocation(coords));
    await AsyncStorage.setItem('userLocation', JSON.stringify(coords));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${databaseUrl}/users.json`);
      const data = await response.json();

      const users = Object.values(data || {});
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        Alert.alert('Success', 'Login successful!');
        await fetchAndStoreLocation();
        dispatch(setScreen('welcome'));
      } else {
        Alert.alert('Error', 'Incorrect email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while connecting to the database.');
    }
  };

  const handleRegistration = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
      const newUser = {
        username,
        email,
        phone,
        password,
      };

      const response = await fetch(`${databaseUrl}/users.json`, {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        dispatch(setScreen('login'));
      } else {
        Alert.alert('Error', 'Registration failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'register' && (
        <>
          <Text style={styles.titleText}>Register</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => dispatch(setUsername(text))}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => dispatch(setEmail(text))}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={(text) => dispatch(setPhone(text))}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => dispatch(setPassword(text))}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => dispatch(setConfirmPassword(text))}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={handleRegistration} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(setScreen('login'))} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      )}

      {screen === 'login' && (
        <>
          <Text style={styles.titleText}>Login</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => dispatch(setEmail(text))}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => dispatch(setPassword(text))}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}

      {screen === 'welcome' && (
        <>
          <Text style={styles.titleText}>Welcome!</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.78825,
              longitude: location?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {location && (
              <Marker coordinate={location} title="Your Location" description="This is your current location" />
            )}
          </MapView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  titleText: {
    fontSize: width > 400 ? 26 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: width > 400 ? 18 : 16,
  },
  button: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  map: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    height: height * 0.5,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  switchButtonText: {
    color: 'purple',
  },
});

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default ReduxApp;
