import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  const [screen, setScreen] = useState('login');  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Registration validation
  const handleRegistration = async () => {
    // Username validation: Alphabets only
    const usernameRegex = /^[A-Za-z]+$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Error', 'Username should contain alphabets only.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    // Confirm password check
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userData = { username, email, password, phone };
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      Alert.alert('Success', 'Registration successful!');
      setScreen('login'); // Switch to login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  // Phone number validation
  const handlePhoneChange = (input) => {
  // Ensure the phone number always starts with +923
  const fixedPrefix = "+923";
  const remainingDigits = input.replace(fixedPrefix, ""); // Strip the prefix if present

  // Allow only digits for the remaining part
  const sanitizedInput = remainingDigits.replace(/\D/g, ""); // Remove non-digit characters

  // Combine the fixed prefix with the sanitized digits
  const fullPhoneNumber = fixedPrefix + sanitizedInput;

  // Limit the length to the required format: +923XXXXXXXXX (13 characters total)
  if (fullPhoneNumber.length <= 13) {
    setPhone(fullPhoneNumber); // Update state
  }
};


  // Login validation
  const handleLogin = async () => {
    try {
      const storedData = await SecureStore.getItemAsync('user');
      const user = storedData ? JSON.parse(storedData) : null;

      if (user && user.email === email && user.password === password) {
        Alert.alert('Success', 'Login successful!');
        setScreen('welcome'); // Navigate to the welcome screen after login
      } else {
        Alert.alert('Error', 'Incorrect email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/d73e9c4575032bd5743a7c01f121cf9f' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          {screen === 'register' && (
            <>
              <Image
                source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/f18b9f3c12cf2ee33674402c466ff3ea' }} 
                style={styles.roundedImage}
              />
              <Text style={styles.titleText}>Register</Text>
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity onPress={handleRegistration} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScreen('login')} style={styles.switchButton}>
                <Text style={styles.switchButtonText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </>
          )}

          {screen === 'login' && (
            <>
              <Image
                source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/f18b9f3c12cf2ee33674402c466ff3ea' }} 
                style={styles.roundedImage}
              />
              <Text style={styles.titleText}>Login</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScreen('register')} style={styles.switchButton}>
                <Text style={styles.switchButtonText}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </>
          )}

          {screen === 'welcome' && (
            <ImageBackground
              source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/4e1cad4730346f62fb8e4ac423ed8c92' }}
              style={styles.container}
            >
              <Text style={styles.text1}>My Profile</Text>
              <View style={styles.pictureContainer}>
                <Image
                  source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/f18b9f3c12cf2ee33674402c466ff3ea' }}
                  style={styles.picture}
                />
                <Text style={styles.description}>Hello! I Am Iram Sajjad</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert('Profile Action', 'This could navigate elsewhere')}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </ImageBackground>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255,0.3)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5, 
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
   fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 10,  },
  switchButtonText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 14,  },
  roundedImage: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    marginBottom: 20, 
    alignSelf: 'center', 
  }, 
  text1: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  pictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  picture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
     color: 'white',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  
   });   export default App;
