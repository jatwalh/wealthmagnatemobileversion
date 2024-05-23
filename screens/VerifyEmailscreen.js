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
  View, Alert,
  Image, Dimensions, TouchableOpacity, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/constants";

function Verifyscreen() {

  const route = useRoute();
  const userDetailData = route.params;

  const navigation = useNavigation();

  const [otp, setOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOTPError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [email, setEmail] = useState('');


  const toggleOTPVisibility = () => {
    setShowOTP(!showOTP);
  };

  const handleOTPChange = (text) => {
    setOTP(text);
  };


  const validateOTP = () => {
    if (otp.length !== 6) {
      setOTPError('OTP should be 6 digits');
      return false;
    } else if (!/^\d{6}$/.test(otp)) {
      setOTPError('Invalid OTP format');
      return false;
    }
    setOTPError('');
    return true;
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    let seconds = resendTimer;
    const timer = setInterval(() => {
      seconds--;
      setResendTimer(seconds);
      if (seconds === 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
  };

  // Function to retrieve user's email from AsyncStorage
  const getUserEmailFromStorage = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        const userEmail = userData.email;
        setEmail(userEmail);
      }
    } catch (error) {
      console.error('Error retrieving user data from AsyncStorage:', error);
    }
  };

  const hideEmailCharacters = (email) => {
    if (!email) return 'your email';

    const [username, domain] = email.split('@');
    const hiddenUsername = `${username.substring(0, 2)}${'*'.repeat(username.length - 2)}`;
    return `${hiddenUsername}@${domain}`;
  };

  useEffect(() => {
    const testtttt = async () => {
      const jsonString = await AsyncStorage.getItem('userData');
      const user = JSON.parse(jsonString);
      console.log(user, "user");
    }
    testtttt()
  }, [])


  const handleprofiledetailsbtn = async () => {
    if (validateOTP()) {
      // Save the OTP in AsyncStorage
      try {
        await AsyncStorage.setItem('userOTP', otp);
      } catch (error) {
        console.error('Error saving OTP:', error);
      }


      console.log('Valid OTP:', otp);
      const userId = await AsyncStorage.getItem('userData').then((jsonString) => {
        const user = JSON.parse(jsonString);
        return user._id;
      });

      // const apiUrl = `https://wealthmagnate.onrender.com/user/emailotpverify/${userId}`;
      const apiUrl = `${API_BASE_URL}/user/emailotpverify/${userId}`;
      const requestBody = {
        enterOTP: parseInt(otp), // Convert the OTP to an integer
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const responseJson = await response.json();
          if (responseJson.message === "Email OTP verified") {
            // Email OTP verification succeeded
            navigation.navigate('Profiledetails');
          } else {
            // Email OTP verification failed, handle the error
            console.error('Email OTP verification error:', responseJson);
            setOTPError('Incorrect OTP. Enter a valid OTP.');
          }
        } else {
          // Handle API request error
          console.error('API request error:', response);
          setOTPError('Failed to verify OTP. Please try again.');
        }
      } catch (error) {
        console.error('API request error:', error);
        setOTPError('Failed to verify OTP. Please try again.');
      }
    } else {
      setOTPError('Incorrect OTP. Enter Valid OTP.');
    }

  };

  useEffect(() => {

    AsyncStorage.getItem('userData')
      .then((jsonString) => {
        if (jsonString) {
          // Parse the JSON string back into a JavaScript object
          const user = JSON.parse(jsonString);

          // Access the "mobileOtp" property from the user object
          const emailOtp = user.emailOtp;

          Alert.alert(`Your Otp is: ${emailOtp.toString()}`);
          console.log('Your Otp is:', emailOtp);
          console.log('Retrieved user object:', user);
        } else {
          console.log('No JSON string found in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error retrieving JSON string:', error);
      });

  }, []);

  // Call the function to retrieve the user's email
  useEffect(() => {
    getUserEmailFromStorage();
  }, []);

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
      <StatusBar />

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

            <Text style={styles.verifyemailtext}>
              Verify your email address
            </Text>
          </View>
        </View>

        <View style={styles.textdiv}>

          <Text style={styles.welcomeText}>
            Enter the code we sent to {'\n'}
            {email ? hideEmailCharacters(email) : 'your email'}
          </Text>
          <Text style={styles.logintext}>
            We sent a 6-digit code to your email address.  {'\n'}
            Enter that code to reset your password.
          </Text>
        </View>


        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/images/lock.png')}
            style={styles.inputicon}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Enter 6 digit OTP"
            keyboardType="numeric"
            placeholderTextColor="#A4A4A4"
            value={otp.toString()}
            onChangeText={handleOTPChange} // Handle OTP change
            secureTextEntry={!showOTP} // Hide or show OTP
            autoCompleteType="off"
            autoCorrect={false} // Hide or show password
          />

          <TouchableOpacity onPress={toggleOTPVisibility}>
            <Image
              source={showOTP
                ? require('../assets/images/eye2.png')
                : require('../assets/images/eye.png')}
              style={styles.inputiconeye}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.errorText}>{otpError}</Text>

        <TouchableOpacity style={styles.lastcontain} onPress={handleResendOTP}>

          <Text style={[commonStyles.center, styles.fontstyle]}>
            {resendDisabled ? (
              `Resend OTP in ${resendTimer} seconds`
            ) : (
              <>
                <Text style={styles.textgolden}>Don't receive OTP?</Text>
                {' '}
                <Text style={styles.textwhite}>Resend OTP in 30s</Text>.
              </>
            )}
          </Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.marginTop}>
          <Text style={[commonStyles.center, styles.fontstyle2]}>
            <Text style={styles.textgolden}>EDIT</Text> {' '}
            <Text style={styles.textwhite}>email address</Text>.
          </Text>
        </TouchableOpacity>

        {/* </View> */}

        {/* Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.resetbtn1}
            activeOpacity={0.7}
            onPress={handleprofiledetailsbtn}>
            <LinearGradient
              colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextlinearbtn}>
              <Text style={commonStyles.continuebtntext}>Next</Text>
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
    flexDirection: 'row',
    alignItems: 'center',

  },


  middleforgottext: {
    flex: 1,
    alignItems: 'center',
  },

  verifyemailtext: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,

  },

  textdiv: {
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

export default Verifyscreen;
