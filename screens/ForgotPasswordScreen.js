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
  useColorScheme,
  View, Alert,
  Image, Dimensions, TouchableOpacity, TextInput
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function Forgot() {

  const navigation = useNavigation();

  const resetbylinkbtn = () => {
    navigation.navigate('Resetbylink');
  };

  const resetbyotpbtn = () => {
    navigation.navigate('Entermobilenumberforotp');
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

        {/* Buttons */}
        <View style={styles.buttonContainer}>


          <TouchableOpacity  style={styles.resetbtn1} 
          activeOpacity={0.7} 
          onPress={resetbyotpbtn}>
            <LinearGradient
              colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continuelinearbtn}>
              <Text style={commonStyles.continuebtntext}>Rest by otp</Text>
            </LinearGradient>
          </TouchableOpacity>


          <TouchableOpacity style={styles.resetbtn2} 
          activeOpacity={0.7} 
          onPress={resetbylinkbtn}>
            <LinearGradient
              colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continuelinearbtn}
              >
              <Text style={commonStyles.continuebtntext}>Reset by link</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,

  },







  buttonContainer: {
    alignItems: 'center',
    marginTop: height * .1,
  },

  
  resetbtn2: {   
    marginTop: height * .06,
  },

  continuelinearbtn: {
    borderRadius: 16,
    width: width * .8,
  },

  // continuebtntext: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   padding: 8,
  //   marginVertical: 8,
  //   fontSize: 20,
  //   minWidth: 200,
  //   textAlign: 'center',
  // },

















});

export default Forgot;
