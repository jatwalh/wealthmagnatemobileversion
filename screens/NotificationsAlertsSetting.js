import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, StyleSheet,
    Text, View, Image,
    Dimensions, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard,
    Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import SelectDropdown from 'react-native-select-dropdown';
import Footer from '../Components/Footer';
import axios from "axios";
import { API_BASE_URL } from "../constants/constants";

function NotificationsAlertsSetting() {
    const navigation = useNavigation();

    const [selectedValue, setSelectedValue] = useState(null);
    const [strategyNameOptions, setStrategyNameOptions] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [stocksOptions, setStocksOptions] = useState([]);
    const [selectedStocksValue, setSelectedStocksValue] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false)

    useEffect(() => {
        const userdataAllocation = async () => {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString)
            const allStrategyNames = user.strategyOBJ.map(strategy =>
                strategy.strategyID.strategyName)
            setStrategyNameOptions(allStrategyNames);
            const desiredStrategy = user.strategyOBJ.find(strategy => {
                return strategy.strategyID.strategyName === selectedStrategy;
            });
            if (desiredStrategy === undefined) {
                return null;
            } else {
                const allSubStockss = desiredStrategy.allSubStocks.map((data) => (
                    data.stockName || null
                ))
                setStocksOptions(allSubStockss || null);
                setSelectedStocksValue([]);
            }
        }
        userdataAllocation();
    }, [selectedStrategy]);

    useEffect(() => {
        const mytest = async () => {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                const userId = user._id;
                console.log("User ID:", userId);

                // const response = await axios.get(`https://wealthmagnate.onrender.com/user/getimportantalerts/${userId}`);
                const response = await axios.get(`${API_BASE_URL}/user/getimportantalerts/${userId}`);
                // console.log("Response:", response.data);
                setImportantAlerts(response.data.importantStocks)
                return
            } catch (err) {
                console.log("Error:", err);
            }
        }
        mytest();
    }, [updateFlag]);

    console.log("selectedStocksValue", selectedStocksValue)

    const handleApplyButtonPress = async () => {
        try {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userID = user._id; // user ID
            const allStocksNames = user.stocks;
            const allStrategyNames = user.strategies; // user ID 
            const selectedStrategyy = allStrategyNames.filter(strategy => selectedStrategy.includes(strategy.strategyName));
            // return console.log(selectedStrategyy[0]._id);

            const selectedStocks = allStocksNames.filter(stock => selectedStocksValue.includes(stock.stockName));
            const uniqueStockNames = [...new Set(selectedStocks.map(stock => stock._id))]; //unique stock ids

            //    return console.log("dtrfytg", userID, typeof(selectedStrategyy[0]._id), typeof(uniqueStockNames[0]));

            // const response = await axios.post(`https://wealthmagnate.onrender.com/user/markimportantalert/${userID}`, {
            const response = await axios.post(`${API_BASE_URL}/user/markimportantalert/${userID}`, {
                stockIds: uniqueStockNames,
                strategyId: selectedStrategyy[0]._id
            });
            console.log(response);
            setUpdateFlag(true);

            Alert.alert("Data Submitted");
        } catch (err) {
            console.log("err", err);
            console.error(err)
        }

    };


    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    const handlehomeicon = () => {
        navigation.navigate('Dashboard');
    };

    const viewStocks = (itemData) => {
        // return console.log("test", itemData);
        // { selectedEmail: itemData }
        navigation.navigate('ViewStocks', { selectedStockData: itemData });
    };

    const [importantAlerts, setImportantAlerts] = useState([]);

    async function deleteImportantAlerts(objID) {
        try {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userId = user._id;
            // const response = await axios.delete(`https://wealthmagnate.onrender.com/user/deleteimportantalert/${userId}/${objID}`);
            const response = await axios.delete(`${API_BASE_URL}/user/deleteimportantalert/${userId}/${objID}`);
            console.log("Response:", response.data);
            if (response.status === 200 && response.data.message === "Object deleted successfully") {
                Alert.alert('Success', 'Item deleted successfully');
            } else {
                Alert.alert('Error', 'Unexpected response from the server');
            }
            setUpdateFlag(true);
        } catch (err) {
            console.log("Error:", err);
            Alert.alert('Error', 'An error occurred while deleting the object');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[commonStyles.maincontainer]}>
                <View style={styles.container}>
                    <View style={[commonStyles.Dashboardcontainer]}>
                        <View style={[commonStyles.leftItem]}
                            onTouchEnd={handleBackButtonPress}>
                            <Image source={require('../assets/images/backarrow.png')}
                                style={[commonStyles.backarrow1]} />
                        </View>
                        <View style={[commonStyles.centerItem]}>
                            <Image source={require('../assets/images/logo.png')}
                                style={[commonStyles.logoimage]} />
                        </View>
                        <View style={[commonStyles.rightItem]}>
                            <Image source={require('../assets/images/profileimage.png')}
                                style={[commonStyles.imagesize]} />
                        </View>
                    </View>

                    <ScrollView >
                        <View style={[commonStyles.paddingbottom2, commonStyles.paddingtop]}>
                            <View style={[commonStyles.width100, commonStyles.mtlesthan1, commonStyles.marginLeft1]}>
                                <View style={[commonStyles.widget2, commonStyles.paddingleft1]} >

                                    <View style={styles.textwithinput}>
                                        <View style={[commonStyles.containerflex,]}>
                                            <Text
                                                style={[commonStyles.textwhite, styles.textwidth,]}
                                            >
                                                Page is Under Development
                                            </Text>
                                        </View>
                                    </View>


                                </View>
                            </View>


                        </View>
                    </ScrollView>

                    {/* Footer Section */}
                    <Footer navigation={navigation} />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgblack,
    },
    alertinputbox2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * .07,
        marginBottom: height * .01,
        width: width * .32,
        position: 'relative',
        right: width * .01,
    },
    alertinputbox3: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * .03,
        marginBottom: height * .002,
        width: width * .32,
        position: 'relative',
        right: width * .068,
    },
    selectedText: {
        fontsize: 5,
    },
    option: {
        padding: 10,
    },
    textwithinput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textheaders: {
        width: width * .4,
        marginTop: height * .03,
    },
    textwidth: {
        width: width,
        marginTop: height * .05, fontSize: 25
    },
    container3: {
        justifyContent: 'space-between',
    },
    leftcontainer3: {
        flex: 1,
        marginRight: 8,
    },
    rightContainer3: {
        flexShrink: 0,
        marginLeft: 8,
    },
    text: {
        fontSize: 18,
    },

    dropdownButton: {
        backgroundColor: '#F4F4F4',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        width: '90%',
        height: 45,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },

    dropdownContainer: {
        borderRadius: 8,
    },

    dropdownRow: {
        padding: 10,
    },

    dropdownRowText: {
        color: 'black',
        fontSize: 16,
    },

    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'black',
        paddingVertical: 8,
        marginTop: 20,
    },

    tableCell: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        flexWrap: 'nowrap',
        marginBottom: 20,
    },

    tableCellTwo: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        flexWrap: 'nowrap',
        marginBottom: 20,
        marginLeft: 10,
    },

    viewcontainer: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: colors.bggreen,
        padding: 10,
        color: 'white',

    },
    deletecontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.bgred,
        color: 'white',
        marginLeft: 8,
        marginRight: 3,
    },

});


export default NotificationsAlertsSetting;
