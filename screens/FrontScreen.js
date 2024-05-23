import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { commonStyles } from '../assets/colors/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';


function FrontScreen() {

  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);


  useEffect(() => {
    // Checking if the user is logged in
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      if (userData) {
        const user = JSON.parse(userData);
        
        if (user.appPin) {
          // User has created a pin, it will be navigated to EnterPin
          setUserLoggedIn(true);
          setLoading(false);
          navigation.navigate('EnterPinandBiometricScreen');
        } else {
          // No pin created, it will be navigated to Dashboard
          setUserLoggedIn(true);
          setLoading(false);
          navigation.navigate('Dashboard');
        }
      } else {
        // If User is not logged in, it will show the FrontScreen
        setLoading(false);
        navigation.navigate('Welcome');
      }
    } catch (error) {
      console.error('Error checking user login status:', error);
      setLoading(false);
    }
  };

  
  return (
    <SafeAreaView style={[commonStyles.maincontainer]}>
      <StatusBar />
      <ScrollView >
        <View style={styles.container}>
        {userLoggedIn ? null : (
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerText}
        />
        )}
      </View>
     </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
 
      textttt: {
        fontWeight: 'bold', // Add other text styles as needed
      },
      video: {
        width: width * 1,
        height: height * 0.28,
        },

      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor:'black'
      },
      image: {
        width: width * 1,
        height: height * 0.28,
        alignSelf: 'center',
      },
      image2: {
        width: width * .5,
        height: height * 0.14,
        alignSelf: 'center',
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
      imagecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: height * .35,
      },
      container2: {
        flex: 1,
        justifyContent: 'flex-end',
    
      },
      bgwhite: {
        backgroundColor: 'white',
        width: width,
        paddingTop: height * .06,
        paddingBottom:height * .06,
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
      },
      welcometext1: {
        color: '#131313',
        fontSize: 40,
        fontFamily:'poppins',
        fontWeight:'bold',
      },
      text2: {
        color: '#131313',
        fontSize: 16,
        marginTop: height * .02
      },
      button: {
        color: '#131313',
      },
      signintext: {
        color: '#FFFFFF',
    
      },
      spinnerContainer: {
        position: 'absolute',
        top: height * 0.14, // Adjust the position as needed
        left: width * 0.25, // Adjust the position as needed
      },
      spinnerText:{
        color: '#FFFFFF',
      }
    

});

export default FrontScreen;
