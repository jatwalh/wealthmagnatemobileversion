import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, ScrollView, StyleSheet, Text, View, Image,
    Dimensions, TouchableOpacity, Alert, Linking,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import SelectDropdown from 'react-native-select-dropdown';
import FastImage from 'react-native-fast-image';

const isBuyAlert = (text) => (
    text.toLowerCase().includes("buy") ||
    text.toLowerCase().includes("bullish") ||
    text.toLowerCase().includes("highest")
);
const isSellAlert = (text) => (
    text.toLowerCase().includes("sell") ||
    text.toLowerCase().includes("bearish") ||
    text.toLowerCase().includes("lowest")
);

function formatDate(dateString) {  // DD/MM/YYYY for this formate
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// console.log(utils.isBuyAlert("This is a bullish signal")); // Output: true
// console.log(utils.isSellAlert("This is a bearish signal")); // Output: true
// console.log(utils.formatDate("2024-02-07")); // Output: "07/02/2024"


function WeightageScreen({ emailAlerts }) {
    const navigation = useNavigation();
    const [assingedIndustry, setAssingedIndustry] = useState([]);
    const [assingedStocks, setAssingedStocks] = useState([]);
    const [assingedStocksWithoutFilter, setAssingedStocksWithoutFilter] = useState([]);
    const [assingedStrategy, setAssingedStrategy] = useState([]);
    const [allEmailAlerts, setallEmailAlerts] = useState([]);
    const [buttonStates, setButtonStates] = useState({});
    const [buttonStatesTwo, setButtonStatesTwo] = useState({});
    // const [isLoading, setIsLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("")

    const handleBackButtonPress = () => { navigation.goBack(); };

    useEffect(() => {
        const userDataa = async () => {
            const jsonString = await AsyncStorage.getItem('userData');
            const user = JSON.parse(jsonString);
            const UserAssignedindustries = user.strategyOBJ.map(data =>
                data.allSubStocks.map(data => data.industry)
            );
            const singleIndustryArray = UserAssignedindustries.flat();
            const uniqueSetIndustry = new Set(singleIndustryArray);
            const uniqueArrayIndustry = Array.from(uniqueSetIndustry);
            const updatedAssingedIndustry = ['All Industry', ...uniqueArrayIndustry];
            setAssingedIndustry(updatedAssingedIndustry);
            const UserAssignedStockstest = user.strategyOBJ.map(data =>
                data.allSubStocks
            );
            const singleStockArraytest = UserAssignedStockstest.flat();  // flat used to create a single array from subarrays
            const uniqueObjects = Array.from(
                singleStockArraytest.reduce((map, obj) => map.set(obj.stockName, obj), new Map()).values()
            );
            const allStockNamesOnly = uniqueObjects.map(item => item.stockName);
            setAssingedStocksWithoutFilter(allStockNamesOnly); // new 1-30-2024 for excel document stocks without industry filter
            if (selectedIndustry === "All Industry") {
                setAssingedStocks(allStockNamesOnly);
            } else {
                const filteredStockDocuments = uniqueObjects.filter(obj => obj.industry === selectedIndustry).map(obj => obj.stockName);
                setAssingedStocks(filteredStockDocuments);
            }
            const UserAssignedStrategy = user.strategyOBJ.map(data => data.strategyID);
            setAssingedStrategy(UserAssignedStrategy.map(item => item.strategyName));
            const jsonString2 = await AsyncStorage.getItem('alertsData');
            const userAlerts = await JSON.parse(jsonString2);
            await setallEmailAlerts(userAlerts);
            const initialButtonStates = {};
            for (const stock of assingedStocks) {
                for (const strategy of assingedStrategy) {
                    initialButtonStates[`${stock}-${strategy}`] = 0;
                }
            }
            setButtonStates(initialButtonStates);
            setButtonStatesTwo(initialButtonStates)
        };
        userDataa();
    }, [selectedIndustry]);

    const handleButtonClick = (stock, strategy) => {

        var filteredStrategyAlerts
        if (strategy === "PB ATR") {
            filteredStrategyAlerts = allEmailAlerts.filter(item => item.header.subject[0].includes("PB ATR"));
        } else {
            filteredStrategyAlerts = allEmailAlerts.filter(item => item.header.subject[0].includes(strategy))
                && allEmailAlerts.filter(item => item.header.subject[0].split(' ').includes(strategy));
        }
        let filteredStockAlerts;
        if (strategy === "CS4") {
            filteredStockAlerts = filteredStrategyAlerts.filter(item => {
                const subject = item.header.subject[0];
                // const subject = item.text;
                return subject.includes(stock) && subject.split(' ').includes(stock);
            });
        } else {
            filteredStockAlerts = filteredStrategyAlerts.filter(item => {
                // const subject = item.header.subject[0];
                const subject = item.text;
                return subject.includes(stock) && subject.split(' ').includes(stock);
            });
        }
        const slicedEmailAlerts = filteredStockAlerts.slice(0, 2);

        const buyAlerts = slicedEmailAlerts.filter(alert => isBuyAlert(alert.text));
        const saleAlerts = slicedEmailAlerts.filter(alert => isSellAlert(alert.text))

        const stockStrategyKey = `${stock}-${strategy}`;
        setButtonStates(prevState => ({
            ...prevState,
            [stockStrategyKey]: buyAlerts.length,
        }));
        setButtonStatesTwo(prevState => ({
            ...prevState,
            [stockStrategyKey]: saleAlerts.length,
        }));
        return;
    };

    const [updateLoad, setUpdateLoad] = useState(false);
    useEffect(() => {
        const checkButtontwo = async () => {
            setIsLoading(!isLoading);
            for (const stock of assingedStocks) {
                for (const strategy of assingedStrategy) {
                    handleButtonClick(stock, strategy);
                }
            }
            setIsLoading(!isLoading)
        };

        if (isLoading) {
            checkButtontwo();
        }
    }, [updateLoad]);

    const checkButton = async () => {
        setUpdateLoad(!updateLoad);
        setIsLoading(!isLoading);
    };

    function viewAlerts(mode, stock, strategy, index) {
        const dataToSearch = { mode: mode, stock: stock, strategy: strategy, index: index }
        navigation.navigate('WeightageScreenAlerts', { selectedAlerts: dataToSearch })
    }

    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const toggleMenu = () => { setMenuVisible(!isMenuVisible) };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
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
    }, []);

    async function requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage permission granted');
                return true;
            } else {
                console.log('Storage permission denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    async function downloadExcel() {
        try {
            const downloads = RNFS.DownloadDirectoryPath;
            const timestamp = new Date().toISOString().replace(/[-T:]/g, '');
            const fileName = `Weightage_${timestamp}.xlsx`;
            const filePath = `${downloads}/${fileName}`;
            const fileExists = await RNFS.exists(filePath);
            if (fileExists) { await RNFS.unlink(filePath); }
            const combinedData = [];
            const dateStamp = new Date().toLocaleDateString();
            const upperRow = ['', 'Downloading Date:', dateStamp, 'Downloading Time:', new Date().toLocaleTimeString()];
            combinedData.push(upperRow);
            const headerRow = ['Stock'];
            assingedStrategy.forEach((strategy) => {
                headerRow.push(`${strategy} 1st Recent`, `${strategy} 2nd Recent`);
            });
            combinedData.push(headerRow);

            // Filter allEmailAlerts once outside the loop
            const filteredAlertsByStrategy = {};
            for (const strategy of assingedStrategy) {
                filteredAlertsByStrategy[strategy] = strategy === "PB ATR" ?
                    allEmailAlerts.filter(item => item.header.subject[0].includes("PB ATR")) :
                    allEmailAlerts.filter(item => item.header.subject[0].includes(strategy) || item.header.subject[0].split(' ').includes(strategy));
            }

            for (const stock of assingedStocksWithoutFilter) {
                const stockRow = [stock];
                const timeRow = [`${stock} Time`];
                for (const strategy of assingedStrategy) {
                    const filteredStrategyAlerts = filteredAlertsByStrategy[strategy];
                    let filteredStockAlerts;
                    if (strategy === "CS4") {
                        filteredStockAlerts = filteredStrategyAlerts.filter(item => {
                            const subject = item.header.subject[0];
                            return subject.includes(stock) && subject.split(' ').includes(stock);
                        });
                    } else {
                        filteredStockAlerts = filteredStrategyAlerts.filter(item => {
                            const subject = item.text;
                            return subject.includes(stock) && subject.split(' ').includes(stock);
                        });
                    }
                    const slicedEmailAlerts = filteredStockAlerts.slice(0, 2);

                    // Add data to stockRow and timeRow arrays
                    if (slicedEmailAlerts.length === 1 && slicedEmailAlerts[0]) {
                        stockRow.push(isBuyAlert(slicedEmailAlerts[0].text) ? `Buy` : isSellAlert(slicedEmailAlerts[0].text) ? `Sell` : '');
                        stockRow.push('');

                        // timeRow.push(formatDate(slicedEmailAlerts[0].receivedTime));
                        timeRow.push(isBuyAlert(slicedEmailAlerts[0].text) ? `${formatDate(slicedEmailAlerts[0].receivedTime)}` : ''
                            || isSellAlert(slicedEmailAlerts[0].text) ? `${formatDate(slicedEmailAlerts[0].receivedTime)}` : '');
                        timeRow.push('');

                    } else if (slicedEmailAlerts.length === 2 && slicedEmailAlerts[0] && slicedEmailAlerts[1]) {
                        stockRow.push(isBuyAlert(slicedEmailAlerts[0].text) ? `Buy` : isSellAlert(slicedEmailAlerts[0].text) ? `Sell` : '');
                        stockRow.push(isBuyAlert(slicedEmailAlerts[1].text) ? `Buy` : isSellAlert(slicedEmailAlerts[1].text) ? `Sell` : '');


                        timeRow.push(isBuyAlert(slicedEmailAlerts[0].text) ? `${formatDate(slicedEmailAlerts[0].receivedTime)}` : ''
                            || isSellAlert(slicedEmailAlerts[0].text) ? `${formatDate(slicedEmailAlerts[0].receivedTime)}` : '',
                            isBuyAlert(slicedEmailAlerts[1].text) ? `${formatDate(slicedEmailAlerts[1].receivedTime)}` : ''
                                || isSellAlert(slicedEmailAlerts[1].text) ? `${formatDate(slicedEmailAlerts[1].receivedTime)}` : ''
                        );

                        // timeRow.push(formatDate(slicedEmailAlerts[0].receivedTime));
                        // timeRow.push(formatDate(slicedEmailAlerts[1].receivedTime));

                    } else {
                        stockRow.push('', '');
                        timeRow.push('', '');
                    }
                }
                combinedData.push(stockRow);
                combinedData.push(timeRow);
            }

            const sheet = XLSX.utils.aoa_to_sheet(combinedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, 'Weightage Data');
            await RNFS.writeFile(filePath, XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' }), 'base64');
            console.log(`Weightage Excel document downloaded successfully at: ${filePath}`);
            // Consider removing the alert or delaying it to after file operations
            Alert.alert('Download Successful', '', [
                {
                    text: 'Open Excel',
                    onPress: async () => {
                        try {
                            const privateFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                            await RNFS.copyFile(filePath, privateFilePath);
                            const result = await DocumentPicker.pick({
                                type: [DocumentPicker.types.allFiles],
                            });
                            if (result) {
                                const contentUri = result.uri;
                                Linking.openURL(contentUri).catch((error) => {
                                    console.error('Failed to open the Excel file:', error);
                                });
                            }
                        } catch (err) {
                            console.error('Error opening document:', err);
                        }
                    },
                },
            ]);
        } catch (err) {
            console.warn(err);
        }
    }

    const handleDownloadPDF = async () => {
        const permissionGranted = await requestStoragePermission();
        if (permissionGranted) {
            setIsLoading(true);
            await downloadExcel();
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>
            <View style={[commonStyles.navbarcontainer]}>
                <View style={[commonStyles.leftItem]} onTouchEnd={handleBackButtonPress}>
                    <Image source={require('../assets/images/backarrow.png')} style={[commonStyles.backarrow1]} />
                </View>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', zIndex: 1 }}>
                <View>
                    <TouchableOpacity onPress={checkButton} style={[styles.button, styles.buyButton]} >
                        <Text style={styles.buttonText2}>Check Weightage</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={handleDownloadPDF} style={[styles.button, styles.buyButton]} >
                        <Text style={styles.buttonText2}>Download File</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.listContainer}>
                <SelectDropdown
                    data={assingedIndustry}
                    search={true}
                    onSelect={async (selectedItem, index) => {
                        setSelectedIndustry(selectedItem);
                        setButtonStates({});
                        setButtonStatesTwo({});
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

            {isLoading && (
                <View style={styles.loader}>
                    <View style={{ flex: 1, position: 'absolute', top: height * 0.42, left: width * 0.31, zIndex: 1 }} >
                        <FastImage source={require('../assets/images/loadergif.gif')} style={{ height: 80, width: 140 }} />
                    </View>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollViewContainer} horizontal={true} >
                <ScrollView vertical>
                    <View style={[styles.maincontainer, styles.mt]}>
                        <View style={[styles.tableRow]}>
                            <View style={[styles.tableHeaderCell]}>
                                <Text style={styles.textTwo}></Text>
                            </View>
                            {assingedStrategy.map((item, index) => (
                                <View key={index} style={[styles.tableHeaderCell, {
                                    alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={styles.textTwo}>{item}</Text>
                                </View>
                            ))}
                        </View>
                        {assingedStocks.map((stock, rowIndex) => (
                            <View key={rowIndex} style={styles.tableRow}>
                                <View style={[styles.tableHeaderCell,
                                { alignItems: 'left', justifyContent: 'flex-start', }]}>
                                    <Text style={styles.textTwo}>{stock}</Text>
                                </View>
                                {assingedStrategy.map((strategy, strategyIndex) => (
                                    <View key={strategyIndex} style={[styles.tableCell, styles.tableContainer, { width: 300 }]}>
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginRight: 5, alignItems: 'center', }} >
                                            {buttonStates[`${stock}-${strategy}`] === 2 && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <TouchableOpacity
                                                        onPress={() => { handleButtonClick(stock, strategy); viewAlerts("BUY", stock, strategy, 1) }}
                                                        style={[styles.button, styles.buyButton, { backgroundColor: 'green', }]}>
                                                        <Text style={[styles.buttonText,]}> 1</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => { handleButtonClick(stock, strategy); viewAlerts("BUY", stock, strategy, 2) }}
                                                        style={[styles.button, styles.buyButton, { backgroundColor: 'green', marginLeft: 10, }]}>
                                                        <Text style={[styles.buttonText,]}> 2 </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            {buttonStates[`${stock}-${strategy}`] === 1 && (
                                                <TouchableOpacity
                                                    onPress={() => { handleButtonClick(stock, strategy); viewAlerts("BUY", stock, strategy, 1) }}
                                                    style={[styles.button, styles.buyButton, { backgroundColor: 'green' }]}>
                                                    <Text style={[styles.buttonText]}> {buttonStates[`${stock}-${strategy}`]} </Text>
                                                </TouchableOpacity>
                                            )}
                                            {buttonStatesTwo[`${stock}-${strategy}`] === 2 && (
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity
                                                        onPress={() => { handleButtonClick(stock, strategy); viewAlerts("SELL", stock, strategy, 1) }}
                                                        style={[styles.button, styles.buyButton, { backgroundColor: 'red', }]}>
                                                        <Text style={[styles.buttonText]}> 1 </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => { handleButtonClick(stock, strategy); viewAlerts("SELL", stock, strategy, 2) }}
                                                        style={[styles.button, styles.buyButton, { backgroundColor: 'red', marginLeft: 10, }]}>
                                                        <Text style={[styles.buttonText]}> 2 </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            {buttonStatesTwo[`${stock}-${strategy}`] === 1 && (
                                                <TouchableOpacity
                                                    onPress={() => { handleButtonClick(stock, strategy); viewAlerts("SELL", stock, strategy, 1) }}
                                                    style={[styles.button, styles.buyButton, { backgroundColor: 'red', marginLeft: 10, }]}>
                                                    <Text style={[styles.buttonText]}> {buttonStatesTwo[`${stock}-${strategy}`]} </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    text: { fontSize: 18, color: 'white' },
    textTwo: { fontSize: 15, color: 'white' },
    container: { marginBottom: 25, marginTop: 10, flexDirection: 'row', alignItems: 'center', padding: 16, },
    tableContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    leftSide: { flex: 1, justifyContent: 'flex-start', position: 'relative', left: width * .03, },
    rightSide: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', position: 'relative', top: height * - .009, },
    leftText: { fontSize: 20, color: 'white' },
    image: { width: 20, height: 20, margin: 10, resizeMode: 'contain', },
    maincontainer: {
        backgroundColor: '#212121', borderRadius: 10, padding: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4
    },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'white', width: width * 3, },
    tableHeaderCell: {
        flex: 1, paddingVertical: 8, textAlign: 'left', backgroundColor: 'purple',
        borderRightWidth: 1, borderRightColor: 'white', width: width * 3, justifyContent: 'flex-start',
    },
    tableCell: {
        flex: 1, flexDirection: 'column', paddingVertical: 8, alignItems: 'center',
        borderRightWidth: 1, borderRightColor: 'white',
    },
    text: { fontSize: 18, color: 'white', },
    buyButton: { backgroundColor: 'green', },
    saleButton: { backgroundColor: 'red', marginTop: 5, },
    button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignItems: 'center', },
    buttonText: { color: 'white', fontSize: 10, },
    buttonText2: { color: 'white', fontSize: 15, },
    menuContainer: {
        top: 25, right: 25, backgroundColor: 'lightgray', marginRight: 10, shadowOpacity: 0.2,
        borderRadius: 3, elevation: 5, shadowColor: 'black', padding: 15, shadowOffset: { width: 0, height: 2 },
    },
    scrollViewContainer: { marginHorizontal: 15 },
    menuItem: { padding: 3 },
    logouttext: { color: "black", fontSize: 15, backgroundColor: 'white', borderRadius: 3, padding: 5 },
    usernametext: { color: "black", fontSize: 15, marginBottom: 10, },
    listContainer: { justifyContent: "center", paddingVertical: 20, alignItems: "center" },
    dropdownContainer: { borderRadius: 8, },
    dropdownRow: { padding: 10, },
    dropdownRowText: { color: 'black', fontSize: 16, },
    dropdownButton: {
        backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: 'gray',
        borderRadius: 8, width: '85%', height: 45, justifyContent: 'center',
    },
    loader: {
        position: 'absolute', top: 0, left: 0, height: height,
        width: width, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999
    }
});
const mapStateToProps = (state) => ({
    emailAlerts: state.email.emailAlerts,
});

export default connect(mapStateToProps)(WeightageScreen);
