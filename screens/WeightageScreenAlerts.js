import React, { useState, useEffect } from 'react';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    ScrollView, StyleSheet,
    Text, View, Image, Dimensions,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../Components/Footer';

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString('en-US', options);
}
function WeightageScreenAlerts({ route, navigation, emailAlerts, }) {

    const [alerts, setAlerts] = useState([]);
    const [alertsData, setAlertsData] = useState([]);
    const [flag, setFlag] = useState(false);

    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const userData = async () => {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            // const userAlerts = await JSON.parse(jsonString2);
            const userAlertsData = await JSON.parse(jsonString2);

            const resultArray = await route.params.selectedAlerts;
            console.log(typeof (resultArray.index));
            setAlertsData(resultArray)

            const selectedindex = resultArray.index;
            const strategy = resultArray.strategy;
            const strategyWithSpace = strategy + " ";
            const selectedStock = resultArray.stock;
            const mode = resultArray.mode;

            var filteredStrategyAlerts;
            if (strategy === "PB ATR") {
                filteredStrategyAlerts = userAlertsData.filter(item => item.header.subject[0].includes("PB ATR"));
            } else {
                filteredStrategyAlerts = userAlertsData.filter(item => item.header.subject[0].includes(strategy))
                    && userAlertsData.filter(item => item.header.subject[0].split(' ').includes(strategy));
            }

            const filteredStockAlert = filteredStrategyAlerts.filter(alert => {
                const words = alert.text.toLowerCase().split(' ');
                const subjectsWords = alert.header.subject[0].toLowerCase().split(' ');
                // console.log(words)
                return words.includes(selectedStock.toLowerCase()) || subjectsWords.includes(selectedStock.toLowerCase());
            });

            let filteredModeAlert;
            if (mode === "BUY") {
                filteredModeAlert = filteredStockAlert.filter(alert =>
                    alert.text.toLowerCase().includes("buy") ||
                    alert.text.toLowerCase().includes("highest") ||
                    alert.text.toLowerCase().includes("bullish")
                );
            } else {
                filteredModeAlert = filteredStockAlert.filter(alert =>
                    alert.text.toLowerCase().includes("sell") ||
                    alert.text.toLowerCase().includes("lowest") ||
                    alert.text.toLowerCase().includes("bearish")
                );
            }

            const slicedAlerts = filteredModeAlert.slice(0, 2);
            console.log(slicedAlerts);

            if (selectedindex === 1) {
                setAlerts([slicedAlerts[0]])
            } else {
                setAlerts([slicedAlerts[1]])
            }
            setFlag(true);
            return
        };
        userData()
    }, []);

    // useEffect(() => {
    //     console.log("typeof selectedItem, selectedItem");
    // }, [alertsData, flag]);

    // console.log(alerts);

    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);

    const toggleMenu = () => {
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

    useEffect(() => {
        const getUserData = async () => {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUserData();
    }, [flag]);

    return (

        <View style={styles.container}>

            <View style={[styles.navbarcontainer]}>

                <View style={[commonStyles.leftItem]}
                    onTouchEnd={handleBackButtonPress}>
                    <Image source={require('../assets/images/backarrow.png')}
                        style={[commonStyles.backarrow1]} />
                </View>

                <View style={[commonStyles.centerItem]}>
                    <Image source={require('../assets/images/logo.png')}
                        style={[commonStyles.logoimage]} />
                </View>

                <TouchableOpacity onPress={toggleMenu} style={commonStyles.rightItem}>
                    <Image
                        source={require('../assets/images/profileimage.png')}
                        style={commonStyles.imagesize}
                    />
                </TouchableOpacity>
                {isMenuVisible && (
                    <View style={[styles.menuContainer, { zIndex: 999, position: 'absolute' }]}>
                        <Text style={styles.usernametext}>{userData?.userName}</Text>
                        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                            <Text style={styles.logouttext}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <ScrollView contentContainerStyle={[styles.scrollViewContent, commonStyles.paddingbottom2, commonStyles.paddingtop]}>
                <View style={marginBottom = 20} >
                    <View style={{ marginBottom: 20 }}>

                        {flag === false ? (<View>
                            <Text style={styles.body}>Wait</Text>
                        </View>) : (<>
                            {alerts.map((item, index) => (
                                <View key={index} style={styles.whiteBorder}>
                                    <Text style={styles.subject}>{
                                        item.header.subject[0]}</Text>
                                    <View>
                                        <Text style={styles.body}>{item.text}</Text>
                                    </View>
                                    <Text style={styles.DateFormat}>{formatDate(item.receivedTime)} {formatTime(item.receivedTime)}</Text>
                                </View>
                            ))}
                        </>
                        )}

                    </View>
                </View>
            </ScrollView >
            <Footer navigation={navigation} />
        </View >
    );
}

;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgblack, },
    whiteBorder: { marginLeft: 15, marginRight: 15 },
    stockDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    DateFormat: { fontSize: 10, color: "white" },
    menuButton: { flex: 1, },
    profileImage: { flex: 1, alignItems: 'flex-end', },
    profilecontainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, },
    subject: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: 'white', },
    from: { fontSize: 18, color: 'gray', marginBottom: 8, },
    body: { fontSize: 16, color: '#fff', },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center', },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 300 },
    navbarcontainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgblack,
        paddingTop: height * 0.001, paddingBottom: height * 0.001, zIndex: 1,
    },
    menuContainer: {
        top: 25, right: 25, backgroundColor: 'lightgray', borderRadius: 3,
        elevation: 5, shadowColor: 'black', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, marginTop: 35, marginRight: 10, padding: 15,
    },
    menuItem: { padding: 3, },
    logouttext: {
        color: "black", fontSize: 15,
        backgroundColor: 'white', borderRadius: 3, padding: 5
    },
    usernametext: { color: "black", fontSize: 15, marginBottom: 10, }
});

export default WeightageScreenAlerts;

