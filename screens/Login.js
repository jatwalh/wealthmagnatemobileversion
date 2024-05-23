import React, { useState, useEffect } from 'react';
import { useNavigation, useroute } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, View, Alert, Image, Dimensions,
  TouchableOpacity, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../assets/colors/style';
import { API_BASE_URL } from "../constants/constants";

const googleicon = () => {
  Alert.alert('Google icon', 'Google icon  pressed!', [
    {
      text: 'OK',
      onPress: () => console.log('OK Pressed'),
    },
  ]);
};

const fbicon = () => {
  Alert.alert('fcebook icon', 'fcebook icon  pressed!', [
    {
      text: 'OK',
      onPress: () => console.log('OK Pressed'),
    },
  ]);
};

const appleicon = () => {
  Alert.alert('Apple icon', 'Apple icon  pressed!', [
    {
      text: 'OK',
      onPress: () => console.log('OK Pressed'),
    },
  ]);
};

// validateEmail and validatePassword functions
const validateEmail = (email) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return 'Incorrect Password';
  }
  return '';
};

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const navigation = useNavigation();

  const validateFields = () => {
    let valid = true;

    // Validation for email
    if (!validateEmail(email)) {
      setEmailErrorMessage('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailErrorMessage(''); // Clear the error message if email is valid
    }

    // Validation for password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordErrorMessage(passwordError);
      valid = false;
    } else {
      setPasswordErrorMessage('');
    }
    return valid;
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // useEffect(() => {
  //   // Cleanup the disabled state after 1 minute
  //   const timeoutId = setTimeout(() => {
  //     setIsButtonDisabled(false);
  //   }, 60000); // 1 minute in milliseconds

  //   return () => clearTimeout(timeoutId);
  // }, [isButtonDisabled]);

  const handleLogin = async () => {
    if (isButtonDisabled) {
      return;
    }

    if (!validateFields()) {
      return;
    }
    const lowercaseEmail = email.toLowerCase();
    setIsButtonDisabled(true);
    try {
      // const response = await fetch('https://wealthmagnate.onrender.com/user/userlogin', {
      const response = await fetch(`${API_BASE_URL}/user/userlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: lowercaseEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const userData = data.userData;
        try {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          // console.log('User data stored successfully:', userData);
        } catch (error) {
          console.error('Error storing user data:', error);
        }

        navigation.navigate('VerifyEmailAuthentication');
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred while logging in.');
    }
  };


  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const Forgetpasswordbtn = async () => {
    navigation.navigate('Forgot');
  }

  const signupbtnpress = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ backgroundColor: '#151413', flexGrow: 1, justifyContent: 'center' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
      <SafeAreaView>
        <StatusBar />

        <View style={styles.container}>

          <View style={[commonStyles.backbuttontopcontainer]}>
            <View style={[, { leftContainer: { flex: 1, } }]}>
              <TouchableOpacity
                onPress={handleBackButtonPress}>
                <Image source={require('../assets/images/backarrow.png')}
                  style={[styles.backarrow, styles.leftImage]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.middleImageContainer]}>
              <Image source={require('../assets/images/logo.png')}
                style={[styles.logo, styles.middleImage]} />
            </View>

          </View>

          {/* Welcome text */}
          <Text style={styles.welcomeText}>
            Welcome Back!
          </Text>
          <Text style={styles.logintext}>
            Login now
          </Text>

          {/* Email and password input fields */}
          <View style={styles.inputContainer}>
            <Image
              source={require('../assets/images/email.png')}
              style={styles.inputicon}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Enter Email Address"
              keyboardType="email-address"
              placeholderTextColor="#A4A4A4"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {emailErrorMessage !== '' && (
            <Text style={styles.errorMessage}>{emailErrorMessage}</Text>
          )}

          <View style={[styles.inputContainer, styles.inputContainer2]}>
            <Image
              source={require('../assets/images/mobile.png')}
              style={styles.inputicon}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Enter Password"
              keyboardType="default"
              placeholderTextColor="#A4A4A4"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}

            />

            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image
                source={
                  showPassword
                    ? require('../assets/images/eye2.png')
                    : require('../assets/images/eye.png')
                }
                style={styles.inputiconeye}
              />
            </TouchableOpacity>
          </View>

          {passwordErrorMessage !== '' && (
            <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
          )}
          {/* Ends here */}

          {/* Forgot Password link */}
          <TouchableOpacity style={styles.forgotPassword}
            onPress={Forgetpasswordbtn}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleLogin}>
              <LinearGradient
                colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continuelinearbtn}
              >
                <Text
                  style={styles.continuebtntext}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>

          <View style={styles.linecontainer}>
            <LinearGradient
              colors={['#F9C809', 'rgba(255, 255, 255, 0.00)']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient}
            />

            <Text style={styles.loginwithtext}>or Login with</Text>

            <LinearGradient
              colors={['#F9C809', 'rgba(255, 255, 255, 0.00)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />

          </View>

          <View style={styles.bottomicons}>
            <TouchableOpacity onPress={googleicon} >
              <Image source={require('../assets/images/icongoogle.png')} style={styles.bottominputicon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={fbicon} >
              <Image source={require('../assets/images/iconfacebook.png')} style={styles.bottominputicon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={appleicon} >
              <Image source={require('../assets/images/iconapple.png')} style={styles.bottominputicon} />
            </TouchableOpacity>
          </View>

          <View style={styles.lastcontain}>
            <TouchableOpacity>
              <Text>
                <Text style={styles.lastcontaintext}>Don’t have any account?</Text> {' '}
                <Text style={styles.lastcontaintext2}
                  onPress={signupbtnpress}
                >Create Account
                </Text>.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.bgblack,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // top: height * .06
  },

  topcontain: { flex: 1 },
  middleImageContainer: { flex: 1, alignItems: 'center', },

  backarrow: {
    position: 'relative',
    left: width * 0.07,
    width: width * .08,
    height: height * .075,
    resizeMode: 'contain',
  },

  middleImage: {
    width: width * 0.5,
    height: height * 0.1,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',

  },

  logo: {
    marginTop: height * .02,
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },


  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: height * .1,
    textAlign: 'center',
    color: colors.lightgray,
  },

  logintext: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.gray,
  },

  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: height * .06,
    width: width * .8,
  },

  inputContainer2: {
    marginTop: height * .04,
  },
  inputicon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputiconeye: {
    width: 20,
    marginRight: 10,
  },
  textinput: {
    flex: 1,
    paddingVertical: 10,
    color: colors.gray,
  },


  forgotPassword: {
    position: 'relative ',
    top: 20,
    right: 40,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: colors.white,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 15
  },

  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,

  },

  continuelinearbtn: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * .8,
  },

  continuebtntext: {
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    marginVertical: 8,
    fontSize: 20,
    minWidth: 200,
    textAlign: 'center',
  },

  linecontainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 30,
  },
  gradient: {
    width: '25%',
    height: 3
  },
  loginwithtext: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.gray,
    margin: 20
  },

  bottomicons: {
    marginVertical: 0,
    flexDirection: 'row',
  },

  bottominputicon: {
    width: width * .096,
    height: height * .046,
    marginRight: 20,

  },
  lastcontain: {
    flexDirection: 'row',
    marginVertical: 40,
  },

  lastcontaintext: {
    color: colors.white
  },

  lastcontaintext2: {
    color: colors.golden
  },

  errorMessage: {
    color: "red",
  }

});

export default Login;
