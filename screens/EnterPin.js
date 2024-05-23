import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    SafeAreaView, ScrollView, StatusBar,
    StyleSheet, Text, View, Alert,
    Image, Dimensions, TouchableOpacity, TextInput,
} from 'react-native';


function Enterpin() {

    const navigation = useNavigation();

    const [createPin, setCreatePin] = useState(''); 
    const [showCreatePin, setShowCreatePin] = useState(false);
    const [CreatePinError, setCreatePinError] = useState('');
  
    const [isChecked, setIsChecked] = useState(true); 
     const toggleCheckbox = () => {
    
  };

   const [isChecked2, setIsChecked2] = useState(false);
    const toggleCheckbox2 = () => {
        setIsChecked2(!isChecked2);
    };


    const toggleCreatePinVisibility = () => {
        setShowCreatePin(!showCreatePin);
      };
    
  
    const handleCreatePinChange = (text) => {
        setCreatePin(text);
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
    

    const SubmittoDashboardpageBtn = async () => {
        const isCreatePinValid = validateCreatePin();
    
        if (isCreatePinValid) {
            // Retrieve the stored user data from AsyncStorage
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                if (jsonString) {
                    const userData = JSON.parse(jsonString);
                    const storedPin = userData.appPin;
    
                    if (parseInt(createPin) === storedPin) {
                        Alert.alert('Success', 'PIN has been Verified successfully!');
                        navigation.navigate('Dashboard');
                    } else {
                        Alert.alert('Error', 'Invalid PIN');
                    }
                } else {
                    Alert.alert('Error', 'User data not found in AsyncStorage');
                }
            } catch (error) {
                console.error('AsyncStorage error:', error);
                Alert.alert('Error', 'Failed to retrieve user data');
            }
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
            <StatusBar />

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.topcontain}>
                        <View style={[,{ leftContainer: {flex: 1,}}]}>
                            <TouchableOpacity 
                                onPress={handleBackButtonPress}>
                                <Image source={require('../assets/images/backarrow.png')}
                                style={[commonStyles.backarrow, styles.leftImage]} />
                            </TouchableOpacity>

                        </View>

                        <View style={styles.middleforgottext}>

                            <Text style={[commonStyles.title2, commonStyles.poppinsfontsb]}>
                            Enter Pin
                            </Text>

                        </View>
                    </View>

                    <View style={[commonStyles.h2text,commonStyles.poppinsfontm]}>
                        <Text style={commonStyles.createaccounttext}>
                        Enter pin for login
                        </Text>
                    </View>

                    <View style={[commonStyles.inputContainer,commonStyles.mt1,commonStyles.poppinsfontm]}>
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
        flexDirection: 'row', // Arrange items horizontally
        alignItems: 'center', // Vertically center items

    },


    middleforgottext: {
        flex: 1, // Allow the container to take remaining space
        alignItems: 'center', // Center items horizontally
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

    errorText:{
        color:"red",
    }
});

export default Enterpin;
