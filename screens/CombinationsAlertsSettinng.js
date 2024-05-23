import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, ScrollView, StyleSheet, Text,
    View, Image, Dimensions, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown'
import axios from "axios";
import Footer from '../Components/Footer';
import {API_BASE_URL} from "../constants/constants";


function CombinationsAlertsSetting() {

    const navigation = useNavigation();
    const timeDurationOptions = ["1 hour", "2 hours", "3 hours", "4 hours", "5 hours", "6 hours"];
    const signalOptions = ["BUY", "SELL"];
    const [strategyNameOptions, setStrategyNameOptions] = useState([]);
    const [selectedStrategyOne, setSelectedStrategyOne] = useState(null);
    const [selectedStrategyTwo, setSelectedStrategyTwo] = useState(null);
    const [stocksOptionsOne, setStocksOptionsOne] = useState([]);
    const [stocksOptionsTwo, setStocksOptionsTwo] = useState([]);
    const [stocksOptions, setStocksOptions] = useState([]);
    const [selectedStocksValue, setSelectedStocksValue] = useState(null);
    const [selectedSignalValue, setSelectedSignalValue] = useState(null);
    const [importantAlerts, setImportantAlerts] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false)
    const [timeSelected, setTimeSelected] = useState();

    console.log(selectedSignalValue);

    useEffect(() => {
        const userdataAllocation = async () => {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const allStrategyNames = user.strategyOBJ.map(strategy =>
                strategy.strategyID.strategyName);
            setStrategyNameOptions(allStrategyNames);
            const desiredStrategyOne = user.strategyOBJ.find(strategy => {
                return strategy.strategyID.strategyName === selectedStrategyOne;
            });
            if (desiredStrategyOne === undefined) {
                return null;
            } else {
                const allSubStockss = desiredStrategyOne.allSubStocks.map((data) => (
                    data.stockName || null
                ))
                setStocksOptionsOne(allSubStockss || null);
                setSelectedStocksValue([]);
            }
            const desiredStrategyTwo = user.strategyOBJ.find(strategy => {
                return strategy.strategyID.strategyName === selectedStrategyTwo;
            });
            if (desiredStrategyTwo === undefined) {
                return null;
            } else {
                const allSubStockss = desiredStrategyTwo.allSubStocks.map((data) => (
                    data.stockName || null
                ))
                setStocksOptionsTwo(allSubStockss || null);
                setSelectedStocksValue([]);
            }
            const margedState = [...stocksOptionsOne, ...stocksOptionsTwo];
            const uniqueStockValues = [...new Set(margedState)];
            setStocksOptions(uniqueStockValues);
        }

        userdataAllocation();
    }, [selectedStrategyOne, selectedStrategyTwo]);

    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    const handlehomeicon = () => {
        navigation.navigate('Dashboard');
    };


    const handleSubmit = async () => {
        try {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userID = user._id; // user ID
            // return console.log(userID)
            const allStocksNames = user.stocks;
            const allStrategyNames = user.strategies;
            const selectedStrategyyOne = allStrategyNames.filter(strategy => selectedStrategyOne.includes(strategy.strategyName));
            const selectedStrategyyTwo = allStrategyNames.filter(strategy => selectedStrategyTwo.includes(strategy.strategyName));

            const selectedStocks = allStocksNames.filter(stock => selectedStocksValue.includes(stock.stockName));
            const uniqueStockNames = selectedStocks._id //unique stock ids
            // const uniqueStockNames = [...new Set(selectedStocks.map(stock => stock._id))]; //unique stock ids
            // return console.log("selectedStocksValue", selectedStrategyyOne[0]._id,selectedStrategyyTwo[0]._id, selectedStocks[0]._id );
            const durationInHours = parseInt(timeSelected, 10);
            // return console.log("durationInHours", typeof(durationInHours), durationInHours);
            // const response = await axios.post(`https://wealthmagnate.onrender.com/user/createcombination/${userID}`, {
                const response = await axios.post(`${API_BASE_URL}/user/createcombination/${userID}`, {
                // stockIds: uniqueStockNames,
                // strategyId: selectedStrategyy[0]._id
                stockID: selectedStocks[0]._id,
                strategyOneID: selectedStrategyyOne[0]._id,
                strategyTwoID: selectedStrategyyTwo[0]._id,
                timeDuration: durationInHours,
                signalFor: selectedSignalValue

            });
            console.log(response);
            setUpdateFlag(!updateFlag);
            Alert.alert("Data Submitted");
        } catch (err) {
            console.log("err", err);
            console.error(err)
        }
    }


    useEffect(() => {
        const mytest = async () => {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                const userId = user._id;
                const response = await axios.get(`${API_BASE_URL}/user/getcombinationalerts/${userId}`);
                setImportantAlerts(response.data.combinationAlerts)
                return
            } catch (err) {
                console.log("Error:", err);
            }
        }
        mytest();
    }, [updateFlag]);

    const viewDetails = (itemData) => {
        navigation.navigate('ViewCombination', { selectedStockData: itemData });
    };

    async function deleteCombinationAlerts(objID) {
        try {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const userId = user._id;
            // return console.log(userId, objID)
            const response = await axios.delete(`${API_BASE_URL}/user/deletecombinationalert/${userId}/${objID}`);
            console.log("Response:", response.data);
            setUpdateFlag(!updateFlag);
            if (response.status === 200 && response.data.message === "Combination alert deleted successfully") {
                Alert.alert('Success', 'Item deleted successfully');
            } else {
                Alert.alert('Error', 'Unexpected response from the server');
            }
            setUpdateFlag(!updateFlag);
        } catch (err) {
            console.log("Error:", err);
            Alert.alert('Error', 'An error occurred while deleting the object');
        }
    }

    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>
            <View style={styles.container}>
                <View style={[commonStyles.Dashboardcontainer]}>
                    <View style={[commonStyles.leftItem]} onTouchEnd={handleBackButtonPress}>
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
                                            Combinations Alerts
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.textwithinput}>
                                    <View style={[commonStyles.containerflex]}>
                                        <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                            Strategy one
                                        </Text>
                                    </View>
                                    <View style={[commonStyles.containerflex,
                                    styles.alertinputbox2

                                    ]}>
                                        <SelectDropdown
                                            data={strategyNameOptions}
                                            // defaultButtonText={strategyNameOptions[0]}
                                            search={true}
                                            searchPlaceholder="Search Strategy 1"
                                            onSelect={(selectedItem, index) => {
                                                setSelectedStrategyOne(selectedItem);
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

                                <View style={styles.textwithinput}>
                                    <View style={[commonStyles.containerflex]}>
                                        <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                            Strategy Two
                                        </Text>
                                    </View>
                                    <View style={[commonStyles.containerflex,
                                    styles.alertinputbox2

                                    ]}>
                                        <SelectDropdown
                                            data={strategyNameOptions}
                                            // defaultButtonText={strategyNameOptions[0]}
                                            search={true}
                                            searchPlaceholder="Search Strategy 2"
                                            onSelect={(selectedItem, index) => {
                                                setSelectedStrategyTwo(selectedItem);
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
                                            onSelect={(selectedItems, index) => {
                                                setSelectedStocksValue(selectedItems)
                                                // setSelectedStocksValue((pre) => [...pre, selectedItems])
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

                                <View style={styles.textwithinput}>
                                    <View style={[commonStyles.containerflex]}>
                                        <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                            Signal For
                                        </Text>
                                    </View>
                                    <View style={[commonStyles.containerflex,
                                    styles.alertinputbox2

                                    ]}>
                                        <SelectDropdown
                                            data={signalOptions}
                                            searchPlaceholder="Select One"
                                            onSelect={(selectedItems, index) => {
                                                setSelectedSignalValue(selectedItems)
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

                                <View style={styles.textwithinput}>
                                    <View style={[commonStyles.containerflex]}>
                                        <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                            Tenure
                                        </Text>
                                    </View>
                                    <View style={[commonStyles.containerflex]}>
                                        <View style={[styles.container, styles.alertinputbox2]}>
                                            <SelectDropdown
                                                data={timeDurationOptions}
                                                search={true}
                                                searchPlaceholder="Search Tenure"
                                                onSelect={(selectedItems, index) => {
                                                    setTimeSelected(selectedItems);
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
                                </View>

                                <View style={[commonStyles.buttonContainer2]}>
                                    <TouchableOpacity style={[commonStyles.btnbgcolor]} activeOpacity={0.7} onPress={handleSubmit}>
                                        <Text style={[commonStyles.continuebtntext]}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>


                        <View style={[commonStyles.width100, commonStyles.mt1, commonStyles.marginLeft1]} >
                            <View style={[commonStyles.widget2, commonStyles.paddingleft1]} >
                                <View style={styles.textwithinput}>
                                    <View style={[commonStyles.containerflex]}>
                                        <Text style={[commonStyles.textwhite, styles.textheaders]}>
                                            Deployed Combination alerts
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 0.5 }]}>S No.</Text>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>Strategy One</Text>
                                        <Text style={[styles.tableCell, { flex: 2 }]}>Strategy two</Text>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>View</Text>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>Delete</Text>
                                    </View>

                                    {importantAlerts == [] ? (
                                        <Text style={[styles.tableCell, { flex: 1 }]}>No Combination alerts found</Text>
                                    ) : (
                                        // {
                                        importantAlerts.map((item, index) => (
                                            <View style={styles.tableRow}
                                                key={index}
                                            >
                                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                                                <Text style={[styles.tableCell, { flex: 2 }]}>{item.CAtrategyOne.strategyName}</Text>
                                                <Text style={[styles.tableCell, { flex: 2 }]}>{item.CAstrategyTwo.strategyName}</Text>

                                                <TouchableOpacity onPress={() => viewDetails(item)} style={styles.buttonContainer} >
                                                    <Text style={[styles.viewcontainer, styles.tableCell, styles.tableCellTwo]}>
                                                        View
                                                    </Text>
                                                </TouchableOpacity>

                                                <Text
                                                    style={[styles.deletecontainer, styles.tableCell, styles.tableCellTwo]}
                                                    onPress={() => deleteCombinationAlerts(item._id)}>Delete</Text>

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

export default CombinationsAlertsSetting;





























