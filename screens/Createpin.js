import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/constants";
import {
    SafeAreaView, ScrollView, StatusBar,
    StyleSheet, Text, Image, Dimensions,
    TouchableOpacity, TextInput,
    View, Alert
} from 'react-native';


function Createpin() {

    const navigation = useNavigation();

    const [createPin, setCreatePin] = useState('');
    const [reenterPin, setReenterPin] = useState('');
    const [showCreatePin, setShowCreatePin] = useState(false);
    const [showReenterPin, setShowReenterPin] = useState(false);
    const [CreatePinError, setCreatePinError] = useState('');
    const [ReenterPinError, setReenterPinError] = useState('');

    const [isChecked2, setIsChecked2] = useState(false);
    const toggleCheckbox2 = () => {
        setIsChecked2(!isChecked2);
    };


    const toggleCreatePinVisibility = () => {
        setShowCreatePin(!showCreatePin);
    };

    const toggleReenterPinVisibility = () => {
        setShowReenterPin(!showReenterPin);
    };

    const handleCreatePinChange = (text) => {
        setCreatePin(text);
    };

    const handleReenterPinChange = (text) => {
        setReenterPin(text);
    };

    const handleBackButtonPress = () => {
        navigation.goBack();
    };


    const validateCreatePin = () => {
        if (createPin.length !== 4) {
            setCreatePinError('PIN should be 4 digits');
            return false;
        } else if (!/^\d{4}$/.test(createPin)) {
            setCreatePinError('Invalid PIN format');
            return false;
        }
        setCreatePinError('');
        return true;
    };

    const validateReenterPin = () => {
        if (reenterPin.length !== 4) {
            setReenterPinError('PIN should be 4 digits');
            return false;
        } else if (!/^\d{4}$/.test(reenterPin)) {
            setReenterPinError('Invalid PIN format');
            return false;
        } else if (reenterPin !== createPin) {
            setReenterPinError('PINs do not match');
            return false;
        }
        setReenterPinError('');
        return true;
    };


    const SubmittoDashboardpageBtn = async () => {
        const isCreatePinValid = validateCreatePin();
        const isReenterPinValid = validateReenterPin();

        if (isCreatePinValid && isReenterPinValid) {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                const userId = user._id;
                console.log(userId);

                const response = await axios.post(
                    // `https://wealthmagnate.onrender.com/user/pinupdate/${userId}`,
                    `${API_BASE_URL}/user/pinupdate/${userId}`,
                    {
                        appPin: createPin,
                    }
                );
                console.log("Pin entered:", response);

                if (response.data.message === "App pin updated successfully") {
                    // Show an alert message for successful PIN update
                    Alert.alert('Success', 'PIN has been updated successfully!');
                    navigation.navigate('Dashboard');
                } else {
                    // Handle other responses or errors
                }
            } catch (error) {
                console.error('API request or AsyncStorage error:', error);
            }
        }
    };


    return (
        <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
            <StatusBar />

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.topcontain}>
                        <View style={[, { leftContainer: { flex: 1, } }]}>
                            <TouchableOpacity
                                onPress={handleBackButtonPress}>
                                <Image source={require('../assets/images/backarrow.png')}
                                    style={[commonStyles.backarrow, styles.leftImage]} />
                            </TouchableOpacity>

                        </View>

                        <View style={styles.middleforgottext}>

                            <Text style={[commonStyles.title2, commonStyles.poppinsfontsb]}>
                                Create Pin
                            </Text>

                        </View>
                    </View>

                    <View style={[commonStyles.h2text, commonStyles.poppinsfontm]}>
                        <Text style={commonStyles.createaccounttext}>
                            Create pin for login
                        </Text>
                    </View>

                    <View style={[commonStyles.inputContainer, commonStyles.mt1, commonStyles.poppinsfontm]}>
                        <Image
                            source={require('../assets/images/lock.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter 4 digit pin"
                            keyboardType="numeric"
                            placeholderTextColor="#A4A4A4"
                            value={createPin.toString()}
                            onChangeText={handleCreatePinChange}
                            secureTextEntry={!showCreatePin}
                            autoCompleteType="off"
                            autoCorrect={false}
                        />

                        <TouchableOpacity onPress={toggleCreatePinVisibility}>
                            <Image
                                source={showCreatePin ? require('../assets/images/eye2.png')
                                    : require('../assets/images/eye.png')}
                                style={styles.inputiconeye}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.errorText}>{CreatePinError}</Text>


                    <View style={[commonStyles.inputContainer]}>
                        <Image
                            source={require('../assets/images/lock.png')}
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={[styles.textinput, commonStyles.poppinsfontm]}
                            placeholder="Re-enter PIN"
                            keyboardType="numeric"
                            placeholderTextColor="#A4A4A4"
                            value={reenterPin.toString()}
                            onChangeText={handleReenterPinChange}
                            secureTextEntry={!showReenterPin}
                            autoCompleteType="off"
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={toggleReenterPinVisibility}>
                            <Image
                                source={showReenterPin
                                    ? require('../assets/images/eye2.png')
                                    : require('../assets/images/eye.png')}
                                style={styles.inputiconeye}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.errorText}>{ReenterPinError}</Text>

                    <Text style={styles.errorText}>{CreatePinError}</Text>

                    {/* Buttons */}
                    <View style={[commonStyles.buttonContainer]}>
                        <TouchableOpacity style={styles.resetbtn1}
                            activeOpacity={0.7}
                            onPress={SubmittoDashboardpageBtn}>
                            <LinearGradient
                                colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[commonStyles.subnmitlinearbtn]}>
                                <Text style={commonStyles.submitbtntext}>Submit</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
    },


    middleforgottext: {
        flex: 1,
        alignItems: 'center',
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

    errorText: {
        color: "red",
    }
});

export default Createpin;
