import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image, Dimensions, TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import { commonStyles } from '../assets/colors/style';

// added by deepak
import { LinearTextGradient } from "react-native-text-gradient";

// import LinearGradient from 'react-native-linear-gradient';
// ends here

function Welcome() {

  const navigation = useNavigation();
  const welocmetextgradient = ['#FBBC05', 'rgba(255, 0, 0, 0.50)'];

  const signinbtnpress = () => {
    navigation.navigate('Login');
  };
  const signupbtnpress = () => {
    navigation.navigate('Signup');
  };

  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    // After 1 minute (60000 milliseconds), hide the image
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 1500); // 10 seconds in milliseconds
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={[commonStyles.maincontainer]}>
      <StatusBar />
      <ScrollView >
        {/* <Header /> */}
        <View style={styles.container}>
          {showVideo ? (
            <Video
              source={require('../assets/videos/NewLogovedio.mp4')}
              style={styles.video}
              muted
              repeat
              resizeMode="cover"
              shouldPlay
              useNativeControls // This will use the platform-specific video controls
            />
          ) : (
            <View style={styles.imagecontainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.image2}
              />
              <View style={styles.container2}>
                <View style={styles.bgwhite}>
                  {/* <LinearTextGradient colors={['#FBBC05', 'rgba(255, 0, 0, 0.50)']}
                  locations={[0, 0.9552]}> */}




                  <LinearTextGradient style={[styles.welcometext2]}
                    colors={welocmetextgradient}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{}}>
                      Welcome
                    </Text>
                  </LinearTextGradient>


                  {/* <Text style={styles.welcometext1}>
                Welcome
                </Text> */}
                  {/* </LinearTextGradient>  */}

                  <View style={styles.container}>
                    {/* <GradientText
                  style={styles.text}
                  text="Gradient Text"
                  fontSize={24}
                  locations={[0, 1]}
                  colors={['#FF5733', '#F5D020']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                /> */}
                  </View>


                  <Text style={styles.text2}>
                    Get Started with account
                  </Text>
                  <TouchableOpacity
                    style={[commonStyles.signup]}
                    onPress={signinbtnpress} >
                    <Text
                      style={[styles.signintext, commonStyles.fontsize20]}>Sign in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.signup]}
                    onPress={signupbtnpress} >
                    <Text style={[styles.signintext, commonStyles.fontsize20]}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  gradient: {
    padding: 10,
    borderRadius: 5,
  },
  textttt: {
    fontWeight: 'bold',
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
    backgroundColor: 'black'
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
    paddingBottom: height * .06,
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  // welcometext1: {
  //   color: '#131313',
  //   fontSize: 40,
  //   fontFamily:'poppins',
  //   fontWeight:'bold',
  // },
  welcometext2: {
    // color: '#131313',
    fontSize: 40,
    fontFamily: 'poppins',
    fontWeight: 'bold',
  },
  text2: {
    color: '#131313',
    fontSize: 16,
    fontWeight: '500',
    marginTop: height * .02
  },
  button: {
    color: '#131313',
  },
  signintext: {
    color: '#FFFFFF',
    fontFamily: 'poppins',
    fontWeight: 'bold',
  },

});
export default Welcome;