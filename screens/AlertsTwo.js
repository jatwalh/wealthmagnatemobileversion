import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, Dimensions, StyleSheet, Image, TextInput, ActivityIndicator, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, SafeAreaView, FlatList, RefreshControl
} from 'react-native';
import Footer from '../Components/Footer';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../assets/colors/color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../assets/colors/style';
import Sidebar from '../Components/SideBar';
import { API_BASE_URL } from "../constants/constants";

const extractPrefix = (subject) => {
    if (subject.includes("SUPERNOVA")) {
        return "SN";
    } else if (subject.includes("PB ATR")) {
        return "PB";
    } else if (subject.includes("CS4")) {
        return "C4";
    } else if (subject.includes("CS5")) {
        return "C5";
    } else if (subject.includes("PV ")) {
        return "PV";
    } else if (subject.includes("HPHV")) {
        return "HP";
    } else if (subject.includes("RAW")) {
        return "RA";
    } else if (subject.includes("BB")) {
        return "BB";
    } else if (subject.includes("OSS")) {
        return "OS";
    } else if (subject.includes("ECA")) {
        return "EC";
    } else if (subject.includes("APH")) {
        return "AP";
    }
    else {
        return "NA";
    }
};

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString('en-US', options);
}

const AlertsTwo = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const activeScreen = route.name;
    const footerRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [flag, setFlag] = useState(false);
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const getSubjectColor = (subject) => {
        const subjectLower = subject.toLowerCase();
        if (subjectLower.includes(' bb')
            || subjectLower.includes('raw ')
            || subjectLower.includes('raw')
            || subjectLower.includes('oss ')
            || subjectLower.includes('supernova ')
            || subjectLower.includes('supernova')
            || subjectLower.includes('pbatr ')
            || subjectLower.includes('pb ')
            || subjectLower.includes('cs5 ')) {
            return 'blue';
        } else if (subjectLower.includes('eca ')
            || subjectLower.includes('aph')
            || subjectLower.includes('cs4')) {
            return 'red';
        } else if (subjectLower.includes('pv ')
            || subjectLower.includes('avg ')
            || subjectLower.includes('hphv ')) {
            return 'green';
        }
        return 'red';
    };
    const handleToggleSidebar = () => {
        Keyboard.dismiss();
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleInputFocusBlur = (isFocused) => {
        setIsTextInputFocused(isFocused);
        if (footerRef.current) {
            footerRef.current.setNativeProps({
                style: { opacity: isFocused ? 0 : 1, height: isFocused ? 0 : 'auto' },
            });
        }
    };
    const handleTouchOutside = () => {
        Keyboard.dismiss();
        handleInputFocusBlur(false);
    };

    const toggleMenu = async () => {
        try {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            setUserData(user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        setMenuVisible(!isMenuVisible);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    };

    const fetchDataOne = async () => {
        try {
            const jsForAlertData = await AsyncStorage.getItem('alertsData');
            const oldAlertsData = JSON.parse(jsForAlertData);
            // console.log("oldAlertsDataSet.length", oldAlertsData.length);
            const arrayA = oldAlertsData;

            if (arrayA !== null) {
                setData(arrayA);
                setFlag(!flag);
            } else {
                try {
                    const jsonString = await AsyncStorage.getItem('userData');
                    const user = JSON.parse(jsonString);
                    const userID = user._id
                    const response = await axios.get(`${API_BASE_URL}/user/alertsall/${userID}`);
                    const emailAlertsData = response.data.map((email) => ({
                        header: {
                            subject: [email.header.subject[0]],
                            date: [email.header.date[0]],
                        },
                        text: email.text,
                        receivedTime: email.receivedTime,
                        read: false,
                    }));
                    const uniqueEmailAlerts = new Set(emailAlertsData.map(JSON.stringify));
                    const result = Array.from(uniqueEmailAlerts).map(JSON.parse);
                    await AsyncStorage.setItem('alertsData', JSON.stringify(result));
                    const jsonString2 = await AsyncStorage.getItem('alertsData');
                    const userAlerts = await JSON.parse(jsonString2);
                    setData(userAlerts);
                    setFlag(!flag);
                } catch {
                    console.log(error);
                    if (error.response && error.response.status === 500) {
                        setError('Internal Server Error');
                    } else if (error.response && error.response.status === 404) {
                        setError('Stock Are not Assinged Yet');
                    } else {
                        setError(error.message);
                    }
                }
            }

        } catch (error) {
            console.log(error);
            setError(error);
        }
    };
    const fetchData = async () => {
        try {
            const jsForAlertData = await AsyncStorage.getItem('alertsData');
            const oldAlertsData = JSON.parse(jsForAlertData);
            // console.log("oldAlertsDataSet.length", oldAlertsData.length);
            const arrayA = oldAlertsData;

            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userID = user._id;
            const response = await axios.get(`${API_BASE_URL}/user/alertsall/${userID}`);
            const emailAlertsData = response.data.map((email) => ({
                header: {
                    subject: [email.header.subject[0]],
                    date: [email.header.date[0]],
                },
                text: email.text,
                receivedTime: email.receivedTime,
                read: false,
            }));
            const uniqueEmailAlerts = new Set(emailAlertsData.map(JSON.stringify));
            const result = Array.from(uniqueEmailAlerts).map(JSON.parse);
            const arrayB = result;
            const getDifference = (arrA, arrB) => {
                return arrB.filter((itemB) => {
                    return !arrA.some((itemA) => {
                        return itemA.receivedTime === itemB.receivedTime
                    });
                });
            };
            const differenceArray = getDifference(arrayA, arrayB);

            // console.log("result.length", result.length);
            // console.log("differenceArray", differenceArray.length);

            // const newArrayA = arrayA.concat(differenceArray);
            const newArrayA = differenceArray.concat(arrayA);
            await AsyncStorage.setItem('alertsData', JSON.stringify(newArrayA));
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            setData(userAlerts);
            setFlag(!flag);
            // console.log(newArrayA.length);

        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 500) {
                setError('Internal Server Error');
            } else if (error.response && error.response.status === 404) {
                setError('Stock Are not Assinged Yet');
            } else {
                setError(error.message);
            }
        }
    };

    const fetchDataWithInterval = async () => {
        // Fetch new data
        await fetchData();
    };

    useEffect(() => {
        fetchDataOne();
        const intervalId = setInterval(fetchDataWithInterval, 30000);
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleSelectItem = async (item, type) => {
        // filter for types of strategy,, then important alerts ,, then combination alerts,, then all alerts
        setActiveTab(item);
        if (type === "Types") {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = await JSON.parse(jsonString);
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            let userStrategies = user.strategyOBJ;
            const typesStrategies = userStrategies.filter(obj => obj.strategyID.strategyType === item);
            const strategyNameArray = typesStrategies.map((data) => (
                data.strategyID.strategyName
            ));
            const filteredDataa = userAlerts.filter(item => {
                const subject = item.header.subject[0];
                return strategyNameArray.some(keyword => subject.includes(keyword));
            });
            setData(filteredDataa);
            setIsSidebarOpen(false);
        } else if (type === "importantalerts") {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = await JSON.parse(jsonString);
            const strategyNameArray = user.importantStocks.map((data) => (
                data.ISstrategyID.strategyName
            ));
            const modifiedArray = strategyNameArray.map(element => element + ' ');
            const StockNameArray = user.importantStocks.map((data) => (
                data.ISstockID.map((dataTwo) => (
                    dataTwo.stockName
                ))
            ));
            const singleStockArray = [].concat(...StockNameArray);
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            const filteredStrategyArray = userAlerts.filter(item => {
                const subject = item.header.subject[0];
                return singleStockArray.some(keyword => subject.includes(keyword));
            });
            const filteredStockArray = filteredStrategyArray.filter(item => {
                const subject = item.header.subject[0];
                return modifiedArray.some(keyword => subject.includes(keyword));
            });
            setData(filteredStockArray);
            setIsSidebarOpen(false);
        } else if (type === "combinationalerts") {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = await JSON.parse(jsonString);
            const strategyOne = user.combinationAlerts.map(alert => alert.CAtrategyOne.strategyName);
            const strategyTwo = user.combinationAlerts.map(alert => alert.CAstrategyTwo.strategyName);
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            const combinedStratgies = [].concat(...strategyOne, ...strategyTwo);
            const modifiedArray = combinedStratgies.map(element => element + ' ');  // contains strategyies with space
            const combinationStockName = user.combinationAlerts.map(alert => alert.CAstockID.stockName);  // contains Stock name
            const combinationTanure = user.combinationAlerts.map(alert => alert.timeDuration); // contains time duration
            const combinationSignalFor = user.combinationAlerts.map(alert => alert.signalFor); // contains singal buy/sell
            const filteredStrategyArray = userAlerts.filter(item => {
                const subject = item.header.subject[0];
                return modifiedArray.some(keyword => subject.includes(keyword));
            });
            const filteredStockArray = filteredStrategyArray.filter(item => {
                const subject = item.header.subject[0];
                return combinationStockName.some(keyword => subject.includes(keyword));
            });

            setData(filteredStockArray);
            setIsSidebarOpen(false);
        } else if (type === "allalerts") {
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            setData(userAlerts);
            setIsSidebarOpen(false);
        } else {
   
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            const resultArray = [item];

            const filteredDataa = userAlerts.filter(alertItem => {
                const subject = alertItem.header.subject[0];
                return resultArray.some(keyword => subject.includes(` ${keyword} `) || subject.startsWith(`${keyword} `) || subject.endsWith(` ${keyword}`));
            });

            setData(filteredDataa);
            setIsSidebarOpen(false);

            // }

        }
    };

    var filteredData = data
        ? data.filter((item) =>
            item.header.subject[0].toLowerCase().includes(searchText.toLowerCase()) ||
            item.text.toLowerCase().includes(searchText.toLowerCase()) ||
            formatDate(item.receivedTime).toLowerCase().includes(searchText.toLowerCase())
        ) : [];

    const markAsRead = async (index) => {
        try {
            const newData = [...data];
            newData[index].read = true;
            setData(newData);
            const jsonString = await AsyncStorage.getItem('alertsData');
            const alertsData = JSON.parse(jsonString) || [];
            alertsData[index].read = true;
            await AsyncStorage.setItem('alertsData', JSON.stringify(alertsData));
        } catch (error) {
            console.error('Error updating read status in AsyncStorage:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'} >
            <TouchableWithoutFeedback onPress={() => handleInputFocusBlur(false)}>
                <View style={styles.container}>
                    <View style={styles.sidebarSearchBar}>
                        <View style={styles.alertsHeader}>
                            <TouchableOpacity onPress={handleToggleSidebar}>
                                <Image style={styles.hamburgerButton} source={require('../assets/images/menubr.png')} />
                            </TouchableOpacity>
                            {isSidebarOpen && (
                                <Sidebar
                                    handleToggleSidebar={handleToggleSidebar}
                                    selectedItem={selectedItem}
                                    colors={colors} styles={commonStyles}
                                    handleSelectItem={handleSelectItem}
                                />
                            )}
                            <TextInput
                                style={styles.headerInput}
                                placeholder="Search in Emails"
                                placeholderTextColor="white"
                                value={searchText}
                                onChangeText={handleSearchChange}
                                onFocus={() => handleInputFocusBlur(true)}
                                onEndEditing={handleTouchOutside}
                            />
                            <TouchableOpacity onPress={toggleMenu}>
                                <Image style={styles.profileImage} source={require('../assets/images/profileimage.png')} />
                            </TouchableOpacity>
                            {/* Logout Menu */}
                            {isMenuVisible && (
                                <View style={[styles.menuContainer, { zIndex: 999, position: 'absolute' }]}>
                                    <Text style={styles.usernametext}>{userData?.userName}</Text>
                                    <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                                        <Text style={styles.logouttext}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.alertsSection}>
                        <View>
                            <Text style={styles.pageTitle}>
                                {activeTab} Alerts {filteredData.length}
                            </Text>
                        </View>
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.headerText}>{error}</Text>
                            </View>
                        ) : (
                            <SafeAreaView>
                                {flag === false ? (
                                    <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                                ) : (
                                    <FlatList
                                        data={filteredData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity onPress={() => { markAsRead(index), navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item }) }}>
                                                <View style={[
                                                    styles.alertsBody,
                                                    { backgroundColor: item.read ? colors.footerbg : '#484848' }
                                                ]} key={index}>
                                                    <View style={[styles.avatarText, { backgroundColor: getSubjectColor(item.header.subject[0]) }]}>
                                                        <Text style={styles.avatarTextContant}>
                                                            {extractPrefix(item.header.subject[0])}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.alertsContant}>
                                                        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail" >
                                                            {item.header.subject}
                                                        </Text>
                                                        <Text style={styles.bodyText2} numberOfLines={1} ellipsizeMode="tail" >
                                                            {item.text}
                                                        </Text>
                                                        <View style={styles.timeFormat}>
                                                            <Text style={[styles.headerText2, styles.datetime]} >
                                                                {formatDate(item.receivedTime)}
                                                            </Text>
                                                            <Text style={styles.headerText2}>
                                                                {formatTime(item.receivedTime)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        // refreshControl={<RefreshControl refreshing={!flag} onRefresh={() => { fetchData(); }} />}
                                        windowSize={5}
                                    />
                                )}
                            </SafeAreaView>
                        )}
                    </View>
                    <View ref={footerRef} style={styles.footerSection}>
                        <Footer navigation={navigation} activeScreen={activeScreen} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', backgroundColor: colors.footerbg },
    sidebarSearchBar: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', zIndex: 10 },
    alertsSection: { flex: 6, },
    alertsHeader: {
        flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: '#484848',
        marginTop: 15, borderRadius: 30, margin: 15, paddingLeft: 10, paddingRight: 10,
    },
    alertsBody: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 4, height: 70,
        backgroundColor: '#484848', marginBottom: 2, justifyContent: "flex-start"
    },
    hamburgerButton: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
    headerText: { fontSize: 16, color: 'white', width: width * .6 },
    headerText2: { fontSize: 14, color: 'white' },
    bodyText2: { fontSize: 14, color: 'white', width: width * .6 },
    pageTitle: { fontSize: 16, color: 'white', marginLeft: 15, marginBottom: 15 },
    headerInput: { flex: 1, fontSize: 16, marginLeft: 10, color: 'white' },
    textInputPlaceholder: { fontSize: 16, color: 'white' },
    profileImage: { width: 30, height: 30, resizeMode: 'contain', marginLeft: 10, marginRight: 5 },
    footerSection: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', opacity: 1, height: 'auto' },
    errorContainer: { flex: 1, justifyContent: "Flex-Start", alignItems: 'center', marginTop: 100 },
    avatarText: {
        width: 45, height: 45, justifyContent: 'flex-start', alignItems: 'center',
        borderRadius: 30, marginLeft: 10, color: "#fff", fontSize: 16,
    },
    avatarTextContant: { fontSize: 16, color: 'white', marginTop: 12, justifyContent: 'center', },
    alertsContant: { flex: 1, paddingLeft: 10, justifyContent: 'flex-start', alignItems: 'flex-start' },
    timeFormat: { position: 'absolute', right: 10, top: 0, fontSize: 14 },
    datetime: { fontSize: 14 },
    menuContainer: {
        top: 50, right: 4, backgroundColor: 'lightgray', borderRadius: 3, elevation: 5,
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, padding: 15,
    },
    usernametext: { color: "black", fontSize: 15, marginBottom: 10, },
    menuItem: { padding: 3, },
    logouttext: {
        color: "black", fontSize: 15, backgroundColor: 'white',
        borderRadius: 3, padding: 5
    },
});

export default AlertsTwo;





