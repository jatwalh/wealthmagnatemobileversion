import React, { useState, useEffect } from 'react';
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
    Image, Dimensions, TouchableOpacity, TextInput,
} from 'react-native';


function Editemailmenu() {
    return (
        <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
            <StatusBar />
            {/* <Header /> */}
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.topcontain}>
                        <Image source={require('../assets/images/backarrow.png')}
                            style={[commonStyles.backarrow, styles.leftImage]} />
                        <View style={styles.middleforgottext}>

                            <Text style={[styles.title]}>
                                Edit email number menu
                            </Text>

                        </View>
                    </View>
                    <View style={[commonStyles.inputContainer, styles.mt]}>
                        <Image
                            source={require('../assets/images/email.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter Email Address"
                            keyboardType="email-address" placeholderTextColor="#A4A4A4"
                        />
                        <Image
                            source={require('../assets/images/eye2.png')}
                            style={styles.inputiconeye}
                        />
                    </View>
                    <View style={commonStyles.inputContainer}>
                        <Image
                            source={require('../assets/images/email.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter New Email Address"
                            keyboardType="email-address"
                            placeholderTextColor="#A4A4A4"
                        />
                        <Image
                            source={require('../assets/images/eye2.png')}
                            style={styles.inputiconeye}
                        />
                    </View>
                    {/* Buttons */}
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity style={styles.resetbtn1}
                            activeOpacity={0.7}
                            onPress={() => console.log('Button pressed')}>
                            <LinearGradient
                                colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.nextlinearbtn}>
                                <Text style={commonStyles.continuebtntext}>Continue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    mt: {
        marginTop: height * .05
    },

    scrollContent: {
        width: width,
        alignItems: 'center',
        backgroundColor: colors.bgblack,
        height: height,
    },
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






    title: {
        color: colors.lightgray,
        fontSize: 22,
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
        // color: colors.lightgray,
    },

    logintext: {
        marginTop: width * .05,
        fontSize: 16,
        fontWeight: '600',
        color: colors.gray,
        textAlign: 'left',
    },



    inputContainer: {



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
        marginTop: height * .025,
        fontSize: 16,
        width: width * 0.8,
        position: 'relative',
        left: 6

    },

    // fontstyle2: {
    //     marginTop: height * .05,
    //     fontSize: 18
    // },

    textwhite: {
        color: colors.white,
        fontWeight: 'bold',
    },
    textgray: {
        color: colors.gray,

    },


    textgolden: {
        color: colors.golden,
        fontWeight: 'bold',
    },


    buttonContainer: {
        alignItems: 'center',
        marginTop: height * .05,
    },



    buttonContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        left: width * - .025,
        marginTop: height * .03,

    },




    nextlinearbtn: {
        borderRadius: 16,
        width: width * .8,
        backgroundColor: colors.bglightblack,

    },


    btnbgcolor: {
        backgroundColor: colors.bglightblack,
        borderRadius: 16,
        width: width * .8,
        alignItems: 'center',
        // position:'absolute'


    },






});

export default Editemailmenu;
