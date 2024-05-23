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
import AsyncStorage from '@react-native-async-storage/async-storage';


function Signup() {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');

    const handleSignupForm = async () => {
        await AsyncStorage.setItem('userEmail', email);
        if (validateEmail(email)) {
            navigation.navigate('Signupform');
        } else {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailPattern.test(email);
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
                            Sign up
                        </Text>
                    </View>
                </View>

                <View style={[styles.textdiv,{ alignSelf: 'flex-start',marginLeft: width * .04 }]}>
                    <Text style={[styles.logintext]}>
                        ENTER YOUR EMAIL ADDRESS
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../assets/images/email.png')} // Replace with your email inputicon
                        style={styles.inputicon}
                    />
                    <TextInput
                        style={styles.textinput}
                        placeholder="Enter Email Addrress"
                        keyboardType="email-address"
                        placeholderTextColor="#A4A4A4"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.resetbtn1}
                        activeOpacity={0.7}
                        onPress={handleSignupForm}>
                        <LinearGradient
                            colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextlinearbtn}>
                            <Text style={commonStyles.continuebtntext}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.fontstyle]}>
                    <Text style={styles.textwhite}>By proceeding, I agree to the </Text>
                    <Text style={styles.textgolden}>Wealth Magnet  statement</Text> {' '}
                    <Text style={styles.textwhite}>and </Text> {' '}
                    <Text style={styles.textgolden}>Wealth Magnet  statement</Text>
                </Text>
                <Text style={[styles.fontstyle]}>
                    <Text style={styles.textgray}>OR SELECT YOUR SIGN UP METHOD</Text>
                </Text>
                <View style={styles.buttonContainer2}>
                    <Image source={require('../assets/images/iconapple.png')} style={[commonStyles.icon, styles.zindex]} />
                    <TouchableOpacity style={styles.btnbgcolor} activeOpacity={0.7} onPress={() => console.log('Button pressed')}>
                        <Text style={commonStyles.continuebtntext}>Continue with apple</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer2}>
                    <Image source={require('../assets/images/icongoogle.png')} style={[commonStyles.icon, styles.zindex]} />
                    <TouchableOpacity style={styles.btnbgcolor} activeOpacity={0.7} onPress={() => console.log('Button pressed')}>
                        <Text style={commonStyles.continuebtntext}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer2}>
                    <Image source={require('../assets/images/iconfacebook.png')} style={[commonStyles.icon, styles.zindex]} />
                    <TouchableOpacity style={styles.btnbgcolor} activeOpacity={0.7} onPress={() => console.log('Button pressed')}>
                        <Text style={commonStyles.continuebtntext}>Continue with Facebook</Text>
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
        top: height * .04,
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
        color: colors.gray,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        // position: 'relative',
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Vertically align children in the middle
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        // marginTop: height * .06,
        marginTop: height * .02,
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
        marginTop: height * .025,
        fontSize: 16,
        width: width * 0.8,
        position: 'relative',
        left: 6
    },

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
export default Signup;
