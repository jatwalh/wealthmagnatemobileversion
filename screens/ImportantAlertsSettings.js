import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, StyleSheet, Text, View, Image,
    Dimensions, TouchableOpacity, TouchableWithoutFeedback,
    Keyboard, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import Footer from '../Components/Footer';
import { API_BASE_URL } from "../constants/constants";
import axios from "axios";


function ImportantAlertsSetting() {
    const navigation = useNavigation();
    const [strategyNameOptions, setStrategyNameOptions] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [stocksOptions, setStocksOptions] = useState([]);
    const [selectedStocksValue, setSelectedStocksValue] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false);

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
            const userID = user._id;
            const allStocksNames = user.stocks;
            const allStrategyNames = user.strategies;
            const selectedStrategyy = allStrategyNames.filter(strategy => selectedStrategy.includes(strategy.strategyName));

            const selectedStocks = allStocksNames.filter(stock => selectedStocksValue.includes(stock.stockName));
            const uniqueStockNames = [...new Set(selectedStocks.map(stock => stock._id))];
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
                                            <Text style={[commonStyles.textwhite, styles.textwidth,]}>
                                                Important Alerts
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.textwithinput}>

                                        <View style={[commonStyles.containerflex]}>
                                            <Text style={[commonStyles.textwhite, styles.textwidth]}>
                                                Strategy
                                            </Text>
                                        </View>
                                        <View style={[commonStyles.containerflex,
                                        styles.alertinputbox2
                                        ]} >
                                            <SelectDropdown

                                                data={strategyNameOptions}
                                                defaultButtonText="Select"
                                                search={true}
                                                searchPlaceholder="Search Strategy"
                                                onSelect={(selectedItem, index) => {
                                                    setSelectedStrategy(selectedItem);
                                                    setStocksOptions();
                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return selectedItem;
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item;
                                                }}
                                                dropdownStyle={styles.dropdownContainer}
                                                buttonStyle={styles.dropdownButton}
                                                rowStyle={styles.dropdownRow}
                                                rowTextStyle={styles.dropdownRowText}
                                                searchStyle={styles.dropdownSearch}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.textwithinput}>
                                        <View style={[commonStyles.containerflex]}>
                                            <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                                Stocks
                                            </Text>
                                        </View>
                                        <View style={[commonStyles.containerflex,
                                        styles.alertinputbox2

                                        ]}>
                                            <SelectDropdown
                                                data={stocksOptions}
                                                multi={true}
                                                search={true}
                                                searchPlaceholder="Search Stocks"
                                                // searchPlaceholderTextColor="gray"
                                                onSelect={(selectedItems, index) => {
                                                    setSelectedStocksValue((pre) => [...pre, selectedItems])
                                                }}
                                                buttonTextAfterSelection={(selectedItems, index) => {
                                                    return selectedItems;
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item;
                                                }}
                                                dropdownStyle={styles.dropdownContainer}
                                                buttonStyle={styles.dropdownButton}
                                                rowStyle={styles.dropdownRow}
                                                rowTextStyle={styles.dropdownRowText}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.textwithinput}>
                                        <View style={[commonStyles.containerflex]}>
                                            <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                                Selected Stocks
                                            </Text>
                                        </View>
                                        <View style={[commonStyles.containerflex,
                                        styles.alertinputbox2

                                        ]}>
                                            <SelectDropdown
                                                data={selectedStocksValue}
                                                defaultButtonText={"See Selected Stocks"}
                                                onSelect={(selectedItems, index) => {

                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return selectedItem;
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item;
                                                }}

                                                dropdownStyle={styles.dropdownContainer}
                                                buttonStyle={styles.dropdownButton}
                                                rowStyle={styles.dropdownRow}
                                                rowTextStyle={styles.dropdownRowText}
                                            />
                                        </View>
                                    </View>


                                    <View style={[commonStyles.buttonContainer2,]}>
                                        <TouchableOpacity
                                            style={[commonStyles.btnbgcolor]}
                                            activeOpacity={0.7}
                                            onPress={handleApplyButtonPress}
                                        >
                                            <Text style={[commonStyles.continuebtntext]}>Apply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>


                            <View style={[commonStyles.width100,
                            commonStyles.mt1,
                            commonStyles.marginLeft1,

                            ]}
                            >
                                <View style={[commonStyles.widget2,
                                commonStyles.paddingleft1
                                ]}
                                >
                                    <View style={styles.textwithinput}>
                                        <View style={[commonStyles.containerflex]}>
                                            <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                                Deployed important alerts
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 0.5 }]}>S No.</Text>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>Strategy Name</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]}>View</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]}>Delete</Text>
                                        </View>

                                        {importantAlerts == [] ? (
                                            <Text style={[styles.tableCell, { flex: 1 }]}>No important alerts found</Text>
                                        ) : (
                                            // {
                                            importantAlerts.map((item, index) => (
                                                <View style={styles.tableRow} key={index}>
                                                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                                                    <Text style={[styles.tableCell, { flex: 2 }]}>{item.ISstrategyID.strategyName}</Text>
                                                    <TouchableOpacity onPress={() => viewStocks(item)} style={styles.buttonContainer}>
                                                        <Text style={[styles.viewcontainer, styles.tableCell, styles.tableCellTwo]}>
                                                            View
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={[styles.deletecontainer, styles.tableCell, styles.tableCellTwo]}
                                                        onPress={() => deleteImportantAlerts(item._id)}
                                                    >
                                                        Delete
                                                    </Text>
                                                </View>
                                            )))
                                        }
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
        width: width * .4,
        marginTop: height * .05,
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
    dropdownSearch: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 6,
        marginRight: 3,
    },
    viewcontainer: {
        borderRadius: 10,
        backgroundColor: colors.bggreen,
        padding: 10,
        color: 'white',
    },
    deletecontainer: {
        borderRadius: 10,
        backgroundColor: colors.bgred,
        padding: 10,
        color: 'white',
    },

});


export default ImportantAlertsSetting;