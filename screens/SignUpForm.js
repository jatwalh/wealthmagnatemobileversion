import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import PasswordValidationTooltip from '../Components/PasswordValidationTooltip';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View, Alert,
    Image, Dimensions, TouchableOpacity, TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/constants";

function Signupform() {

    const route = useRoute();

    const navigation = useNavigation();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [reenterpassword, setReenterPassword] = useState('');
    const [mobilenumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');

    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [reenterpasswordError, setReenterPasswordError] = useState('');
    const [mobilenumberError, setMobileNumberError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showreenterPassword, setReEnterShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // Use the useEffect to retrieve the email from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('userEmail')
            .then((storedEmail) => {
                if (storedEmail) {
                    setEmail(storedEmail);
                    console.log('Stored Email:--', storedEmail)
                }
            })
            .catch((error) => {
                console.error('Error retrieving email from AsyncStorage:', error);
            });
    }, []);


    const validatePassword = (password) => {
        if (password.length < 8
            || !/[a-z]/.test(password)
            || !/[A-Z]/.test(password)
            || !/\d/.test(password)) {
            return 'Incorrect Password';
        }
        return '';
    };

    const handlePasswordChange = (text) => {
        setPassword(text);

        // Check if the password meets all the requirements
        const passwordValidationResult = validatePassword(text);

        if (passwordValidationResult) {
            setPasswordError(passwordValidationResult);
            setTooltipVisible(true); // Show the tooltip
        } else {
            setPasswordError('');
            setTooltipVisible(false); // Hide the tooltip
        }
    };

    const handleReenterPasswordChange = (text) => {
        setReenterPassword(text);
        if (text !== password) {
            setReenterPasswordError('Passwords do not match');
        } else {
            setReenterPasswordError('');
        }
    };

    const validateFields = () => {
        let valid = true;

        // Validation for firstname
        if (!firstname) {
            setFirstnameError('Last name is required');
            valid = false;
        } else {
            setFirstnameError('');
        }

        // Validation for lastname
        if (!lastname) {
            setLastnameError('Last name is required');
            valid = false;
        } else {
            setLastnameError('');
        }

        // Validation for password
        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult) {
            setPasswordError(passwordValidationResult);
            valid = false;
        } else {
            setPasswordError('');
        }

        // Validation for reenterpassword
        if (reenterpassword !== password) {
            setReenterPasswordError('Passwords do not match');
            valid = false;
        } else {
            setReenterPasswordError('');
        }

        // Validation for mobilenumber
        if (mobilenumber.length !== 10) {
            setMobileNumberError('Enter Valid Mobile number. Required 10 digits number');
            valid = false;
        } else {
            setMobileNumberError('');
        }

        return valid;
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        // console.log('Password visibility toggled: ', showPassword);
    };

    const togglePasswordVisibility2 = () => {
        setReEnterShowPassword(!showreenterPassword);
    };

    const handleRegistration = async () => {
        const isValid = validateFields();

        if (isValid) {
            // Generate username
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            const generatedUserName = `${firstname.toLowerCase()}${lastname.toLowerCase()}${randomNumber}`;

            // Create a request object with the user's data
            const requestData = {
                email: email,
                firstName: firstname,
                lastName: lastname,
                password: password,
                mobileNumber: mobilenumber,
                userName: generatedUserName,

            };

            console.log('API request:', requestData)

            try {
                const response = await axios.post(
                    // 'https://wealthmagnate.onrender.com/user/create'
                    `${API_BASE_URL}/user/create`
                    , requestData);

                if (response.status === 201) {
                    const userData = response.data.user;
                    Alert.alert('User registered successfully');
                    // console.log('API response:', response);

                    // Store user data and mobile OTP in AsyncStorage
                    AsyncStorage.setItem('userData', JSON.stringify(userData))
                        .then(() => {
                            console.log('User registered successfully:', userData);

                        })
                        .catch((error) => {
                            console.error('Error storing JSON string:', error);
                        });

                    console.log('userData', JSON.stringify(userData));

                    navigation.navigate('VerifyPhoneNumber');

                } else {
                    console.error('Registration failed with status:', response.status);

                    // Handle other response status codes if needed
                    Alert.alert('Error', 'Registration failed. Please try again.');
                }

            } catch (error) {
                console.error('Error during registration:', error);

                // Show an error message
                Alert.alert('Error', 'Registration failed. Please try again.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Handle the error as needed
                        },
                    },
                ]);
            }
        }
    };

    const storeOTP = async (otp) => {
        try {
            await AsyncStorage.setItem('userOTP', otp);
            console.log('OTP stored successfully');
        } catch (error) {
            console.error('Error storing OTP:', error);
        }
    }

    const ToLoginPageBtn = () => {
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
                <ScrollView contentContainerStyle={styles.scrollContent}>

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

                    <View style={styles.textdiv}>


                        <Text style={styles.logintext}>
                            Enter details
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/images/user.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder={firstnameError
                                ? '' : 'Enter first name'}
                            keyboardType="default"
                            placeholderTextColor="#A4A4A4"
                            value={firstname}
                            onChangeText={text => {
                                setFirstname(text);
                                setFirstnameError('');
                            }}
                            editable={true}
                        />

                    </View>

                    <Text style={styles.errorText}>{firstnameError}</Text>

                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/images/user.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder={lastnameError
                                ? '' : 'Enter Last name'}
                            keyboardType="default"
                            placeholderTextColor="#A4A4A4"
                            value={lastname}
                            onChangeText={text => {
                                setLastname(text);
                                setLastnameError('');
                            }}
                            editable={true}
                        />

                    </View>

                    <Text style={styles.errorText}>{lastnameError}</Text>

                    <View style={styles.inputpasswordContainer}>
                        <Image
                            source={require('../assets/images/mobile.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter Password"
                            keyboardType="default"
                            placeholderTextColor="#A4A4A4"
                            value={password}
                            onChangeText={handlePasswordChange} // Use the handlePasswordChange function
                            secureTextEntry={!showPassword}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}

                        />
                        {isFocused && (
                            <PasswordValidationTooltip
                                messages={[
                                    {
                                        text: 'Your password must meet the requirements.',
                                        style: { color: 'black', marginBottom: 5, marginTop: 5, },
                                    },
                                    {
                                        text: 'Password must be at least eight (8) characters .',
                                        style: { color: password.length >= 8 ? 'green' : 'red', marginBottom: 5, padding: 5 },
                                        icon: password.length >= 8 ? '✓' : '',
                                    },
                                    {
                                        text: 'Password must contain at least one lowercase letter.',
                                        style: { color: /[a-z]/.test(password) ? 'green' : 'red', marginBottom: 5, padding: 5 },
                                        icon: /[a-z]/.test(password) ? '✓' : '',
                                    },
                                    {
                                        text: 'Password must contain at least one uppercase letter.',
                                        style: { color: /[A-Z]/.test(password) ? 'green' : 'red', marginBottom: 5, padding: 5 },
                                        icon: /[A-Z]/.test(password) ? '✓' : '',
                                    },
                                    {
                                        text: 'Password must contain at least one (1) number.',
                                        style: { color: /\d/.test(password) ? 'green' : 'red', marginBottom: 5, padding: 5 },
                                        icon: /\d/.test(password) ? '✓' : '',
                                    },
                                ]}
                            />
                        )}

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

                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/images/mobile.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Re-enter Password"
                            keyboardType="default"
                            placeholderTextColor="#A4A4A4"
                            value={reenterpassword}
                            onChangeText={handleReenterPasswordChange}
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

                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/images/phone.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter Mobile Number"
                            keyboardType="numeric"
                            placeholderTextColor="#A4A4A4"
                            value={mobilenumber}
                            onChangeText={text => setMobileNumber(text)}
                        />

                    </View>

                    <Text style={styles.errorText}>{mobilenumberError}</Text>

                    <TouchableOpacity style={styles.lastcontain}>

                        <Text style={[commonStyles.center, styles.fontstyle]}>
                            <Text style={styles.textwhite}>Already have an account?</Text> {' '}
                            <Text style={styles.textgolden}
                                onPress={ToLoginPageBtn}
                            >
                                Login Now
                            </Text>

                        </Text>
                    </TouchableOpacity>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={styles.resetbtn1}
                            activeOpacity={0.7}
                            onPress={handleRegistration}>
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

    scrollContent: {
        width: width,
        alignItems: 'center',
        backgroundColor: colors.bgblack,
        zIndex: 0,
        paddingBottom: height * .15,

    },
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
    },

    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: height * .03,
        width: width * .8,
        color: 'red',
        zIndex: -1,
    },

    inputpasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: height * .03,
        width: width * .8,
        color: 'red',
    },

    inputContainer2: {
        marginTop: height * .04,
    },

    inputicon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 10,
        zIndex: 0,
    },

    textinput: {
        flex: 1,
        paddingVertical: 10,
        color: colors.gray,
        zIndex: 0,
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
        marginBottom: 90,
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
    },

    errorText: {
        color: "red",
    },


});

export default Signupform;
