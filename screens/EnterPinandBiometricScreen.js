import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet, Alert,
    Text, View,
    Image, Dimensions, TouchableOpacity,
} from 'react-native';
import { BackHandler } from 'react-native';

function EnterPinandBiometricScreen() {

    const navigation = useNavigation();

    // useEffect(() => {
    //     const handleBackButtonPress = () => {
    //         navigation.goBack();
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    //     return () => backHandler.remove();
    // }, [navigation]);


    useEffect(() => {
        const handleBackButtonPress = () => {
            Alert.alert(
                'Leaving Soon?',
                'Are you sure you want to leave the app?',
                [
                    {
                        text: 'No',
                        onPress: () => false, // Prevent default behavior (exit the app)
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            BackHandler.exitApp(); // Close the entire app
                            return true; // Prevent default behavior (exit the app)
                        },
                    },
                ],
                { cancelable: true }
            );

            return true; // Prevent default behavior (exit the app)
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

        return () => backHandler.remove();
    }, []);

    const navigatetoEnterpinpage = async () => {
        navigation.navigate('Enterpin');
    };


    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>
            <StatusBar />
            {/* <Header /> */}
            <View style={styles.container}>
                <View style={[commonStyles.container2]}>

                    <View style={[commonStyles.backbuttontopcontainer]}>

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
                                        source={require('../assets/images/biometric.png')} // Replace with your image source
                                        style={[commonStyles.usebiometricicon]}
                                    />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </View>

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
export default EnterPinandBiometricScreen;