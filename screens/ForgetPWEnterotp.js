import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View, Alert,
  Image, Dimensions, TouchableOpacity, TextInput
} from 'react-native';

function EnterMobileOtp() {

  const navigation = useNavigation();

  
  const [pwOtp, setPwOtp] = useState('');
  const [showPwOtp, setShowpwOtp] = useState(false);
  const [pwOtpError, setPwOtpError] = useState('');

  const togglepwOtpVisibility = () => {
    setShowpwOtp(!showPwOtp);
  };

  const handlepwOtpChange = (text) => {
    setPwOtp(text);
  };

  const  ResetPasswordBtn = () => {
    navigation.navigate('ResetPassword');
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
            <View style={[,{ leftContainer: {flex: 1,}}]}>
              <TouchableOpacity 
              onPress={handleBackButtonPress}>
                <Image source={require('../assets/images/backarrow.png')}
                style={[commonStyles.backarrow, styles.leftImage]} />
              </TouchableOpacity>
            </View>
          
          <View style={styles.middleforgottext}>

            <Text style={styles.forgottext}>
              Forgot Password
            </Text>
          </View>
        </View>

        <View  style={styles.textdiv}>

          <Text style={styles.logintext}>
          Enter the 4-digit code that you received on your mobile number.
          
          </Text>
        </View>


        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/images/phone.png')}
            style={styles.inputicon}
          />
            <TextInput
              style={styles.textinput}
              placeholder="Enter Otp"
              keyboardType="numeric" 
              placeholderTextColor="#A4A4A4"
              value={pwOtp.toString()}
              onChangeText={handlepwOtpChange}
              secureTextEntry={!showPwOtp} 
              autoCompleteType="off"
              autoCorrect={false}
              />   

          <TouchableOpacity onPress={togglepwOtpVisibility}>
              <Image
              source={
                showPwOtp
                  ? require('../assets/images/eye2.png')
                  : require('../assets/images/eye.png')
              }
          style={styles.inputiconeye}
          />
          </TouchableOpacity>
        </View>

        <Text style={styles.errorText}>{pwOtpError}</Text>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>

          <TouchableOpacity 
          style={styles.resetbtn1} 
          activeOpacity={0.7} 
          onPress={ResetPasswordBtn}>
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
    flexDirection: 'row', 
    alignItems: 'center', 

  },


  middleforgottext: {
    flex: 1,
    alignItems: 'center',
  },

  forgottext: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,

  },

  textdiv:{
    marginTop: width * .07, 
    paddingLeft:  width * .07,
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
    marginTop:width * .05,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.gray,
  },



  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
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
    flex: 1, 
    paddingVertical: 10,
    color: colors.gray,
  },
  inputiconeye: {
    width: 16,
    height: 16,
    resizeMode: 'contain',    

  },

  lastcontain: {
    flexDirection: 'row', 
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

export default EnterMobileOtp;
