import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/constants"

function ResetPasswordbylink() {

  const navigation = useNavigation();


  const [password, setPassword] = useState('');
  const [reenterpassword, setReenterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showreenterPassword, setReEnterShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [reenterpasswordError, setReenterPasswordError] = useState('');


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setReEnterShowPassword(!showreenterPassword);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  }

  // Fetch the user ID from AsyncStorage
  const getUserIdFromStorage = async () => {
    try {
      const jsonString = await AsyncStorage.getItem('userData');
      const user = JSON.parse(jsonString);
      return user._id;
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
      return null;
    }
  };

  const handleResetPassword = async () => {
    // Handling password reset logic 
    if (!password || !reenterpassword) {
      // Handling error case when either field is empty
      setPasswordError('Password is required');
      setReenterPasswordError('Re-enter password is required');
      return;
    }

    if (password !== reenterpassword) {
      // Handling error case when passwords don't match
      setPasswordError('Passwords do not match');
      setReenterPasswordError('Passwords do not match');
      return;
    }

    // Fetch the user's ID from AsyncStorage
    const userId = await getUserIdFromStorage();

    if (!userId) {
      // Handling the case when user data is not found in AsyncStorage
      console.error('User data not found in AsyncStorage.');
      return;
    }

    // Construct your API endpoint and make an HTTP request to reset the password
    try {
      const response = await axios.post(
        // `https://wealthmagnate.onrender.com/password/passwordreset/${userId}`,
        `${API_BASE_URL}/password/passwordreset/${userId}`,
        {
          newPassword: password,
        }
      );

      if (response.status === 200) {
        // Password reset successful
        // You can navigate to the login screen or display a success message
        navigation.navigate('Login');
      } else {
        // Handle other response statuses or errors
        console.error('Password reset failed.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // Handle the error case, show an error message or log the error
    }
  };


  const BacktoLoginPagebtn = () => {
    navigation.navigate('Login');
  };

  const handleBackButtonPress = () => {
    navigation.goBack();
  };


  return (
    <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
      <StatusBar />

      {/* <Header /> */}

      <View style={styles.container}>

        <View style={[commonStyles.backbuttontopcontainer]}>
          <View style={[, { leftContainer: { flex: 1, } }]}>
            <TouchableOpacity
              onPress={handleBackButtonPress}>
              <Image source={require('../assets/images/backarrow.png')}
                style={[commonStyles.backarrow, styles.leftImage]} />
            </TouchableOpacity>
          </View>

          <View style={styles.middleforgottext}>

            <Text style={styles.forgottext}>
              Reset Password
            </Text>
          </View>
        </View>

        <View style={styles.textdiv}>

          <Text style={styles.logintext}>
            Set the new password for your account .

          </Text>
        </View>


        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/images/mobile.png')} // Replace with your email inputicon
            style={styles.inputicon}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Enter Password"
            keyboardType="numeric"
            placeholderTextColor="#A4A4A4"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={
                showPassword ?
                  require('../assets/images/eye2.png')
                  : require('../assets/images/eye.png')
              }
              style={styles.inputiconeye}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.errorText}>{passwordError}</Text>


        <View style={[styles.inputContainer, styles.inputContainer2]}>
          <Image
            source={require('../assets/images/mobile.png')} // Replace with your email inputicon
            style={styles.inputicon}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Re-enter Password"
            keyboardType="numeric"
            placeholderTextColor="#A4A4A4"
            value={reenterpassword}
            onChangeText={text => setReenterPassword(text)}
            secureTextEntry={!showreenterPassword} // Hide or show password
          />

          <TouchableOpacity onPress={togglePasswordVisibility2}>
            <Image
              source={showreenterPassword
                ? require('../assets/images/eye2.png')
                : require('../assets/images/eye.png')}
              style={styles.inputiconeye}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.errorText}>{reenterpasswordError}</Text>


        {/* Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.resetbtn1}
            activeOpacity={0.7}
            onPress={handleResetPassword}>
            <LinearGradient
              colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextlinearbtn}>
              <Text style={commonStyles.continuebtntext}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
}


const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.bgblack,
    height: height,
    alignItems: 'center',
    position: 'relative',
    top: height * .06
  },

  topcontain: {
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Vertically center items

  },


  middleforgottext: {
    flex: 1, // Allow the container to take remaining space
    alignItems: 'center', // Center items horizontally
  },







  forgottext: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,

  },

  textdiv: {
    marginTop: width * .07,
    paddingLeft: width * .07,
    paddingRight: width * .07,
  },

  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: height * .1,
    textAlign: 'center',
    color: colors.lightgray,
  },

  logintext: {
    marginTop: width * .05,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.gray,
  },



  inputContainer: {
    // position: 'relative',
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Vertically align children in the middle
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: height * .06,
    width: width * .8,
    color: 'red'

  },




  inputContainer2: {
    marginTop: height * .04,
  },
  inputicon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 10,
  },
  textinput: {
    flex: 1, // Take up remaining horizontal space
    paddingVertical: 10,
    color: colors.gray,
  },
  inputiconeye: {
    width: 16,
    height: 16,
    resizeMode: 'contain',


  },


  lastcontain: {
    flexDirection: 'row', // Arrange items horizontally
    marginTop: 50,
  },
  marginTop: {
    marginTop: height * .01,
  },

  fontstyle: {
    marginTop: height * .01,
    fontSize: 16
  },
  fontstyle2: {
    marginTop: height * .01,
    fontSize: 18
  },

  textwhite: {
    color: colors.white,
    fontWeight: 'bold',
  },

  textgolden: {
    color: colors.golden,
    fontWeight: 'bold',
  },


  buttonContainer: {
    alignItems: 'center',
    marginTop: height * .05,
  },


  nextlinearbtn: {
    borderRadius: 16,
    width: width * .7,
  },

});

export default ResetPasswordbylink;
