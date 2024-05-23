import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { commonStyles } from '../assets/colors/style';
import SelectDropdown from 'react-native-select-dropdown';
import { API_BASE_URL } from "../constants/constants";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View, Alert,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


function Profiledetails() {

    const navigation = useNavigation();

    const [userName, setUserName] = useState('');
    const [expertiseLevel, setExpertiseLevel] = useState('');
    const [dob, setDOB] = useState('');
    const [country, setCountry] = useState('');
    const [newsletterSubscription, setNewsletterSubscription] = useState(true);
    const [termsAndConditions, setTermsAndConditions] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const options = ['Beginner', 'Intermediate', 'Expert'];

    const [isOpencountry, setIsOpenCountry] = useState(false);
    const [selectedValueCountry, setSelectedValueCountry] = useState(null);
    const Countryoptions = ['India', 'United States', 'Dubai'
        , 'South Korea', 'North Korea', 'China', 'Japan', 'Saudi Arabia'
        , 'Turkey', 'France', 'Iran', 'Canada', 'Germany', 'Africa'
        , 'Australia'];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        setSelectedValue(option);
        setIsOpen(false);
    };

    const toggle2Dropdown = () => {
        setIsOpenCountry(!isOpencountry);
    };

    const selectCountryOption = (option) => {
        setSelectedValueCountry(option);
        setIsOpenCountry(false);
    };

    const [isChecked, setIsChecked] = useState(true);
    const toggleCheckbox = () => {
    };

    const [isChecked2, setIsChecked2] = useState(false);
    const toggleCheckbox2 = () => {
        setIsChecked2(!isChecked2);
    };

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isValidDOB, setIsValidDOB] = useState(true);

    const calculateAge = (birthdate) => {
        const currentDate = new Date();
        const birthDate = new Date(birthdate);
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        // Check if the user is at least 18 years old
        if (age < 18) {
            setIsValidDOB(false);
        } else {
            setIsValidDOB(true);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Hide the date picker
        if (selectedDate) {
            setDOB(selectedDate);
            calculateAge(selectedDate);
        }
    };

    const handlesubmitbtn = async () => {
        try {
            // Get the user's _id from AsyncStorage
            const userId = await AsyncStorage.getItem('userData').then((jsonString) => {
                const user = JSON.parse(jsonString);
                console.log('userId---', user._id)
                return user._id;
            });

            // Define the request body for profile update
            const requestBody = {
                userName: userName,
                expertiseLevel,
                DOB: dob,
                country,
                newsLetterSubscription: newsletterSubscription,
                termsAndConditions,
            };

            console.log('request:', requestBody);

            const response = await fetch(
                // `https://wealthmagnate.onrender.com/user/profileupdate/${userId}`, 
                `${API_BASE_URL}/user/profileupdate/${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

            if (response.ok) {
                const data = await response.json();
                console.log('response:', response);

                navigation.navigate('Loader');
            } else {
                if (response.status === 409) {
                    Alert.alert('Error', 'The chosen username is already taken. Please select a different username.');
                    // Customize your response message here.
                } else {
                    console.log('Received a non-ok response:', response.status);
                    const errorData = await response.json();
                    console.error('Error response data:', errorData);
                    Alert.alert('Error', 'Failed to update user profile');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while updating the user profile');
        }
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

                            <Text style={[commonStyles.title2, commonStyles.poppinsfontsb]}>
                                Profile details
                            </Text>

                        </View>
                    </View>


                    <View style={[commonStyles.h2text, commonStyles.poppinsfontm]}>
                        <Text style={commonStyles.createaccounttext}>
                            Create account
                        </Text>
                    </View>


                    <View style={[commonStyles.inputContainer, styles.mt, commonStyles.poppinsfontm]}>
                        <Image
                            source={require('../assets/images/user.png')} // Replace with your email inputicon
                            style={styles.inputicon}
                        />
                        <TextInput
                            style={styles.textinput}
                            placeholder="Enter username"
                            keyboardType="default"
                            placeholderTextColor="#A4A4A4"
                            value={userName}
                            onChangeText={(text) => setUserName(text)}
                        />

                    </View>


                    <View style={[commonStyles.inputContainerwidthborder, styles.dropdowninput]}>
                        {/* <Image
                            source={require('../assets/images/down-arrow.png')}
                            style={[styles.levelofexpertiseicon]}
                        /> */}
                        <SelectDropdown
                            data={options}
                            onSelect={(selectedOption) => {
                                setExpertiseLevel(selectedOption);
                            }}
                            defaultButtonText="Level of expertise"
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdownButton}
                            buttonTextStyle={[styles.buttonText, commonStyles.textwhitewithoutbold, styles.marginright10, commonStyles.textgray]}
                            dropdownStyle={styles.dropdownOptions}
                            renderDropdownIcon={() => (
                                <Image
                                    source={require('../assets/images/down-arrow.png')}
                                    style={[styles.levelofexpertiseicon]}
                                />
                            )}
                        />

                    </View>


                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <View style={[commonStyles.inputContainer, commonStyles.poppinsfontm]}>

                            <Image
                                source={require('../assets/images/Calendar.png')} // Replace with your calendar icon
                                style={styles.inputicon}
                            />

                            <TextInput
                                style={styles.textinput}
                                placeholder="Enter DOB"
                                keyboardType="email-address"
                                placeholderTextColor="#A4A4A4"
                                value={dob ? dob.toISOString().split('T')[0] : ''}
                                editable={false}
                            />

                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dob || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => handleDateChange(event, selectedDate)}
                        />
                    )}

                    {!isValidDOB && (
                        <Text style={styles.errorText}>You must be at least 18 years old.</Text>
                    )}


                    <View style={[commonStyles.inputContainerwidthborder, styles.dropdowninput]}>

                        <SelectDropdown
                            data={Countryoptions}
                            onSelect={(selectedOption) => {
                                setCountry(selectedOption);
                                selectCountryOption(selectedOption);
                            }}
                            defaultButtonText="Select Country"
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdownButton}
                            buttonTextStyle={[styles.buttonText, commonStyles.textwhite, styles.marginright10, commonStyles.textgray]}
                            dropdownStyle={[styles.dropdownOptions, { backgroundColor: 'black' }]} // Set background color here
                            renderDropdownIcon={() => (
                                <Image
                                    source={require('../assets/images/down-arrow.png')}
                                    style={[styles.levelofexpertiseicon]}
                                />
                            )}

                        />

                    </View>

                    <TouchableOpacity onPress={toggleCheckbox}
                        style={commonStyles.inputContainer3}>
                        <View style={[styles.checkbox, isChecked ? styles.checked : null]}>
                            {isChecked && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={[commonStyles.colors, commonStyles.textwhite, commonStyles.poppinsfontm]}>
                            {isChecked
                                ? 'Subscribe to newsletter'
                                : 'Unchecked'
                            }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleCheckbox2}
                        style={commonStyles.inputContainer3}>
                        <View style={[styles.checkbox, isChecked2 ? styles.checked : null]}>
                            {isChecked2 && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={[commonStyles.colors, commonStyles.textwhite, commonStyles.poppinsfontm]}>
                            {isChecked2
                                ? 'Agree to the terms & conditions'
                                : 'Agree to the terms & conditions'
                            }
                        </Text>

                    </TouchableOpacity>

                    {/* Buttons */}
                    <View style={[commonStyles.buttonContainer]}>
                        <TouchableOpacity
                            style={styles.resetbtn1}
                            activeOpacity={0.7}
                            onPress={handlesubmitbtn}>
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

    marginright10: {
        position: 'relative',
        left: 10,
    },

    buttonText: {
        fontSize: 16,
    },

    levelofexpertiseicon: {
        width: 16,
        height: 16,
        position: 'relative',
        left: 10,
        resizeMode: 'contain',
    },

    downarrowimage: {
        width: 8,
        height: 8,
        position: 'absolute',
        right: 2,
        top: 5,
        resizeMode: 'contain',
    },


    dropdowninput: {
        marginTop: height * .03
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: width * .8,
        position: 'relative',
        height: height * .06,
        backgroundColor: '#151413',
        // zIndex:999
    },



    dropdownOptions: {
        position: 'absolute',
        top: height * .047,
        right: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
        width: width * .8,
        fontsize: 5,

    },
    optionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },






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
        // height: height,
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


    // checkbox code
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    },
    errorText: {
        color: "red",
    }

});

export default Profiledetails;
