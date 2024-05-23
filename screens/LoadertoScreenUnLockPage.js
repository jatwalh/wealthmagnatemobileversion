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
    View,
    Image, Dimensions, TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoadertoScreenUnLock() {
    
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [showSecondContainer, setShowSecondContainer] = useState(false);
    const [showThirdContainer, setShowThirdContainer] = useState(false);
    const [userHasPIN, setUserHasPIN] = useState(false); 


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
                setShowSecondContainer(true);
                setTimeout(() => {
                    setShowSecondContainer(false);
                    setShowThirdContainer(true);
                }, 2000); // Showing the 3rd container after 1 minute
            }, 1); // Showing the 2nd container after 30 seconds
        }, 5000); // Showing the loader for 1 milisec
    }, []);



    const navigatetoEnterpinpage = async () => {
      navigation.navigate('Enterpin'); 
    };

    const navigateToCreatePin = () => {
        navigation.navigate('Createpin');
      };

    const Dashboardpage = async () => {
        navigation.navigate('Dashboard'); 
      };

    const handleBackButtonPress = () => {
    navigation.goBack();
    };  

    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>
            <StatusBar />
            {/* <Header /> */}
            <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    
                    <Video
                        source={require('../assets/videos/1115.mp4')} 
                        style={styles.video}
                        muted
                        repeat
                        resizeMode="cover"
                        shouldPlay
                        useNativeControls 
                    />
                    <Text style={commonStyles.textwhite}>
                        Please wait, while your account logs in.
                    </Text>
                </View>
                ) : showSecondContainer ? (
                    <View style={styles.newContainer}>
                        <View style={styles.circle}>
                            <View style={styles.innerCircle}>
                                <Text style={styles.tick}>✓</Text>
                            </View>
                        </View>
                        <Text style={[commonStyles.textgreen, styles.circleticktext]}>
                            You have Logged in Successfully
                        </Text>
                    </View>
                )
                    : showThirdContainer ? (
                        <View style={[commonStyles.container2]}>
                            <ScrollView contentContainerStyle={[commonStyles.scrollContent]}>
                                <View style={[commonStyles.backbuttontopcontainer]}>
                                    <View style={[,{ leftContainer: {flex: 1,}}]}>
                                        <TouchableOpacity 
                                            onPress={handleBackButtonPress}>
                                            <Image source={require('../assets/images/backarrow.png')}
                                            style={[commonStyles.backarrow, styles.leftImage]} />
                                        </TouchableOpacity>

                                    </View>
                                   
                                    <View style={[commonStyles.middleforgottext]}>
                                        <Text style={[commonStyles.title2, commonStyles.poppinsfontsb, commonStyles.poppinsfontsb]}>
                                            Unlock Screen
                                        </Text>
                                    </View>
                                </View>
                                <View style={[commonStyles.h2text, commonStyles.poppinsfontm]}>
                                    <Text style={[commonStyles.createaccounttext, commonStyles.center]}>
                                        Enter pin for login
                                    </Text>
                                </View>

                                {/* Buttons */}
                                <View style={[commonStyles.buttonContainer]}>
                                    <TouchableOpacity style={styles.resetbtn1}
                                     activeOpacity={0.7}
                                      onPress={navigatetoEnterpinpage}>
                                        <LinearGradient
                                            colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[commonStyles.subnmitlinearbtn]}>
                                            <Text style={commonStyles.submitbtntext}>
                                                Enter pin
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <View style={[commonStyles.buttonContainer]}>
                                    <TouchableOpacity style={styles.resetbtn1} 
                                    activeOpacity={0.7} 
                                    onPress={() => console.log('Button pressed')}>
                                        <LinearGradient
                                            colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[commonStyles.subnmitlinearbtn]}>
                                            <View style={[commonStyles.rowcenter]}>
                                                <Text style={commonStyles.usebiometrictext}>
                                                    Use Biometric
                                                </Text>
                                                <Image
                                                    source={require('../assets/images/biometric.png')} 
                                                    style={[commonStyles.usebiometricicon]}
                                                />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                
                            </ScrollView>
                        </View>
                    ) : null}
            </View>
           
        </SafeAreaView>
    );
}


const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    video: {
        flex: 1, 
        width: '100%', 
        height: '100%', 
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        width: 200,
        height: 200,
        overflow: 'hidden', 
    },

    loaderImage: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain', 
    },

    loadertext: {
        position: 'relative',
        marginTop: 20, 
        fontSize: 16,
        fontWeight: 'bold',
    },
    newContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tick: {
        fontSize: 30,
        color: colors.bgblack,
        fontWeight: 'bold'
    },
    circleticktext: {
        marginTop: width * .058,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        //    width: width * .8
    },
 
});
export default LoadertoScreenUnLock;