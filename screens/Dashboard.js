import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import colors from '../assets/colors/color';
import { BarChart, } from "react-native-chart-kit";
import { useRoute } from '@react-navigation/native';
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Alert,
    ActivityIndicator, Image, Dimensions, TouchableOpacity, ImageBackground
} from 'react-native';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../Components/Footer';
import { API_BASE_URL } from "../constants/constants";
import axios from 'axios';
import AlertsWidget from '../Components/AlertsWidget';
import FastImage from 'react-native-fast-image';

const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{ data: [10, 20, 40, 80, 99], }, { data1: [10, 20, 40, 80, 99], },],
};

const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    yAxisLabel: ['10', '50'],
};

function Dashboard() {
    const navigation = useNavigation();
    const route = useRoute();
    const activeScreen = route.name;
    const [isLoading, setIsLoading] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleBackButtonPress = () => {
            Alert.alert(
                'Leaving Soon?',
                'Are you sure you want to leave the app?',
                [
                    {
                        text: 'No',
                        onPress: () => false,
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            BackHandler.exitApp();
                            return true;
                        },
                    },
                ],
                { cancelable: true }
            );
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => backHandler.remove();
    }, []);

    const handleNotificationIcon = () => {
        navigation.navigate('NotificationScreen');
    };
    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }], });
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    };

    useEffect(() => {
        const getNsetUserData = async () => {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                const userID = user._id
                // return console.log("dfyguhijo")
                const res = await axios.get(`${API_BASE_URL}/user/finduser/${userID}`);
                const data = res.data;
                await AsyncStorage.setItem('userData', JSON.stringify(data));
                setUserData(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        getNsetUserData();

        const fetchNewsData = async () => {
            try {
                const response = await axios.get('https://eodhd.com/api/exchanges-list/?api_token=655ef324936fc5.57831952&fmt=json');
                setNewsData(response.data);
            } catch (error) {
                console.error('Error fetching news data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsData();
    }, []);

    const [updateWidget, setUpdateWidget] = useState(false);
    const getUserData = async () => {
        try {
            // const jsonString = await AsyncStorage.getItem('alertsData');
            // const savedAlerts = JSON.parse(jsonString);
            // if (savedAlerts === null) {

            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userID = user._id
            // const response = await axios.get(`${API_BASE_URL}/user/alertsall/${userID}`);
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
            await AsyncStorage.setItem('alertsData', JSON.stringify(result)).then(() => {
                setUpdateWidget(!updateWidget)
            })
            // console.log(result[0])
            // } else {
            //     setUpdateWidget(!updateWidget);
            // }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 500) {
                setIsLoading(false);
                Alert.alert("Internal Server Error")
            } else if (error.response && error.response.status === 404) {
                setIsLoading(false);
                Alert.alert("Stock Are not Assinged Yet")
            }
            else { Alert.alert(error.message) }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserData();
                setIsLoading(false);
            } catch (error) {
                // setIsLoading(false);
                console.error(error);
                // Handle errors appropriately
            }
        };

        fetchData();
    }, [userData, isLoading]);

    return (
        <SafeAreaView style={[commonStyles.maincontainer, { flex: 1 }]}>
            <StatusBar />
            {isLoading && (
                <View style={styles.loaderMain}>
                    <View style={{ flex: 1, position: 'absolute', top: height * 0.42, left: width * 0.31, zIndex: 1 }} >
                        <FastImage source={require('../assets/images/loadergif.gif')} style={{ height: 80, width: 140 }} />
                    </View>
                </View>
            )}
            <View style={[styles.navbarcontainer]}>
                <TouchableOpacity onPress={handleNotificationIcon} style={[commonStyles.leftItem]} >
                    <Image source={require('../assets/images/notification.png')} style={[commonStyles.notficationimg]} />
                </TouchableOpacity>
                <View style={[commonStyles.centerItem]}>
                    <Image source={require('../assets/images/logo.png')} style={[commonStyles.logoimage]} />
                </View>
                <TouchableOpacity onPress={toggleMenu} style={commonStyles.rightItem}>
                    <Image source={require('../assets/images/profileimage.png')} style={commonStyles.imagesize} />
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
            <View style={[styles.container, { flex: 1 }]}>
                <View style={commonStyles.containerflex}>
                    <ScrollView contentContainerStyle={[commonStyles.scrollContent]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bggreen, commonStyles.textItemborderradius]}>+0.5</Text>
                            </View>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bggreen, commonStyles.textItemborderradius]}>+0.5</Text>
                            </View>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bgred, commonStyles.textItemborderradius]}>
                                    -1.5</Text>
                            </View>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bggreen, commonStyles.textItemborderradius]}>+0.5</Text>
                            </View>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bggreen, commonStyles.textItemborderradius]}>+0.5</Text>
                            </View>
                            <View style={[commonStyles.ml]}>
                                <Text style={[commonStyles.textItem]}>Nifty</Text>
                                <Text style={[commonStyles.textItem, commonStyles.fontbold]}>20897.69</Text>
                                <Text style={[commonStyles.textItem, commonStyles.bggreen, commonStyles.textItemborderradius]}>+0.5</Text>
                            </View>
                        </ScrollView>
                        <View style={[commonStyles.rowcenter, commonStyles.mt1]}>
                            <View style={[commonStyles.leftItem]}>
                                <Text style={[commonStyles.textwhite, commonStyles.title]}>NEWS</Text>
                            </View>
                            <View style={[commonStyles.rightItem2]}>
                                <Text style={[commonStyles.textwhite, commonStyles.readmoretext]}>Read more</Text>
                            </View>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                        ) : (
                            newsData.slice(0, 1).map((item, index) => (
                                <TouchableOpacity key={index} style={[commonStyles.containerflex]}
                                    onPress={() => navigation.navigate("NewsBody", { newsBody: item })} >
                                    <ImageBackground
                                        source={require('../assets/images/mobileimage.png')}
                                        style={[commonStyles.imageBackground]} >
                                        <View style={[commonStyles.overlay]}>
                                            <Text style={[commonStyles.overlayText]}> {item.Name} </Text>
                                            <View style={[commonStyles.flexDirectionrow, commonStyles.mt2]}>
                                                <View style={styles.leftSide}>
                                                    <Text style={styles.leftText}> 2 hours ago </Text>
                                                </View>
                                                <View style={styles.rightSide}>
                                                    <Image source={require('../assets/images/savepost.png')} style={[commonStyles.image, styles.image]} />
                                                    <Image source={require('../assets/images/upload.png')} style={styles.image} />
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))
                        )}
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                        ) : (
                            <View style={[commonStyles.widget2, commonStyles.mtlesthan1]}>
                                {newsData.slice(0, 2).map((item, index) => (
                                    <TouchableOpacity key={index} style={[styles.container, commonStyles.blankwidgetbox, commonStyles.mtlesthan1]}
                                        onPress={() => navigation.navigate("NewsBody", { newsBody: item })} >
                                        <View style={styles.lleftSide}>
                                            <Image source={require('../assets/images/mobileimage.png')} style={[styles.image, commonStyles.widget2img]} />
                                        </View>
                                        <View style={[commonStyles.containerflex]}>
                                            <View style={[commonStyles.mtlesthan1]}>
                                                <Text style={[commonStyles.fontsize13, commonStyles.paddingright02, styles.rightSide, commonStyles.textwhite, commonStyles.mtlesthan1]}>
                                                    {item.Name}
                                                </Text>
                                                <Text style={[commonStyles.fontsize13, commonStyles.paddingright02, styles.rightSide, commonStyles.textwhite, commonStyles.mtlesthan1]}>
                                                    {item.Currency}
                                                </Text>
                                                <Text style={[commonStyles.fontsize13, commonStyles.paddingright02, styles.rightSide, commonStyles.textwhite, commonStyles.mtlesthan1]}>
                                                    {item.Country}
                                                </Text>
                                            </View>
                                            <View style={[styles.additionalTextContainer]}>
                                                <Text style={[styles.additionalText, commonStyles.textgray]}>4 hours ago</Text>
                                                <Image source={require('../assets/images/savepost.png')} style={[commonStyles.savepostimg, styles.flexDirectionrow]} />
                                                <Image source={require('../assets/images/upload.png')} style={[commonStyles.uploadimg, styles.flexDirectionrow]} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View style={[commonStyles.flexDirectionrow, commonStyles.marginLeft1, commonStyles.mtlesthan1]}>
                            <View style={[commonStyles.flexDirectionrow, commonStyles.rowcenter, commonStyles.containerflex, commonStyles.textleft]}>
                                <Text style={[commonStyles.textwhite, commonStyles.fontsize20]}>Performance</Text>
                            </View>
                            <View style={[commonStyles.flexDirectionrow, commonStyles.rowcenter, commonStyles.containerflex, commonStyles.textright, commonStyles.marginRight1]}>
                                <Image source={require('../assets/images/setting.png')} style={[commonStyles.imagesize, commonStyles.marginRight3]} />
                                <Text style={[commonStyles.textwhite, commonStyles.marginRight2]}>View Stats</Text>
                            </View>
                        </View>
                        <View style={[commonStyles.widget2, { flex: 1, justifyContent: 'center', alignItems: 'flex-start', }]}>
                            <BarChart data={data} width={width * .84} height={220} yAxisLabel="$" chartConfig={chartConfig} />
                            <View style={[commonStyles.rowcenter, commonStyles.flexDirectionrow, commonStyles.mtlesthan1, commonStyles.paddingleft1]}>
                                <View style={[commonStyles.rowcenter, commonStyles.flexDirectionrow, commonStyles.mtlesthan1, commonStyles.paddingright02]}>
                                    <LinearGradient
                                        colors={['#FFCF31', '#F9AE18', 'rgba(249, 174, 24, 0.00)']}
                                        locations={[0.5519, 0.6473, 0.9992]} style={commonStyles.borderradius1} >
                                        <Text style={[commonStyles.grdientboxsize]}></Text>
                                    </LinearGradient>
                                    <Text style={[commonStyles.textwhite, commonStyles.paddinleft1]}> Open </Text>
                                </View>
                                <View style={[commonStyles.rowcenter, commonStyles.flexDirectionrow, commonStyles.mtlesthan1, commonStyles.paddingright02]}>
                                    <LinearGradient
                                        colors={['#00B2FF', '#73BAD9', 'rgba(255, 255, 255, 0.00)']}
                                        locations={[0.1042, 0.4699, 1.0]} style={commonStyles.borderradius1} >
                                        <Text style={[commonStyles.grdientboxsize]}></Text>
                                    </LinearGradient>
                                    <Text style={[commonStyles.textwhite, commonStyles.paddinleft1]}>
                                        Close</Text>
                                </View>
                                <View style={[commonStyles.rowcenter, commonStyles.flexDirectionrow, commonStyles.mtlesthan1, commonStyles.paddingright02]}>
                                    <LinearGradient
                                        colors={['#DAC1C1', '#BAA6A6', 'rgba(255, 255, 255, 0.66)']}
                                        locations={[-0.9135, 0.059, 0.9997]} style={commonStyles.borderradius1} >
                                        <Text style={[commonStyles.grdientboxsize]}></Text>
                                    </LinearGradient>
                                    <Text style={[commonStyles.textwhite, commonStyles.paddinleft1]}>
                                        Trade</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[commonStyles.paddingbottom2]}>
                            <View style={[commonStyles.flexDirectionrow, commonStyles.marginLeft1, commonStyles.mtlesthan1]}>
                                <View style={[commonStyles.flexDirectionrow, commonStyles.rowcenter, commonStyles.containerflex, commonStyles.textleft]}>
                                    <Text style={[commonStyles.textwhite, commonStyles.fontsize20]}>Alerts </Text>
                                </View>
                                <View style={[commonStyles.flexDirectionrow, commonStyles.rowcenter, commonStyles.containerflex, commonStyles.textright, commonStyles.marginRight1]}>
                                    <Image source={require('../assets/images/setting.png')} style={[commonStyles.imagesize, commonStyles.marginRight3]} />
                                    <Text style={[commonStyles.textwhite, commonStyles.marginRight2]}>View Stats</Text>
                                </View>
                            </View>
                            <AlertsWidget updateWidget={updateWidget} />
                        </View>
                    </ScrollView>
                </View>
                <Footer navigation={navigation} activeScreen={activeScreen} />
            </View>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    additionalTextContainer: { flexDirection: 'row', alignItems: 'flex-end', },
    additionalText: { fontSize: 16, },
    lleftSide: { flex: 1, },
    rrightSide: { flex: 1, },
    image: { width: 100, height: 100, },
    text: { fontSize: 18, },
    belowText: { fontSize: 16, },
    container: { flexDirection: 'row', alignItems: 'center', zIndex: 0 },
    // container: { flexDirection: 'row', alignItems: 'center', padding:10, zIndex: 0 },
    cccontainer: { flexDirection: 'row', },
    leftSide: { flex: 1, justifyContent: 'flex-start', position: 'relative', left: width * .03, },
    rightSide: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', position: 'relative', top: height * - .009, },
    leftText: { fontSize: 20, color: 'white' },
    image: { width: 20, height: 20, margin: 10, resizeMode: 'contain', },
    navbarcontainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgblack,
        paddingTop: height * 0.001, paddingBottom: height * 0.001, zIndex: 1,
    },
    menuContainer: {
        top: 25, right: 25, backgroundColor: 'lightgray', borderRadius: 3, elevation: 5,
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, marginTop: 35, marginRight: 10, padding: 15,
    },
    menuItem: { padding: 3, },
    logouttext: { color: "black", fontSize: 15, backgroundColor: 'white', borderRadius: 3, padding: 5 },
    usernametext: { color: "black", fontSize: 15, marginBottom: 10, },
    loaderMain: {
        position: 'absolute', top: 0, left: 0, height: height,
        width: width, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999
    }
});
export default Dashboard;
