import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView,
    StyleSheet,
    Text, 
    View, 
    Image,
    Dimensions,
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert
} from 'react-native';
import Footer from '../Components/Footer';


function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
 
  function formatTime(timeString) {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString('en-US', options);
  }

function ViewStocks({ route }) {
    const navigation = useNavigation();

    const [selectedStock, setSelectedStock] = useState([]);

    useEffect(() => {
        setSelectedStock(route.params.selectedStockData);
    }, [route.params]);
    
    console.log("selectedStock", selectedStock);


    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    const handlehomeicon = () => {
        navigation.navigate('Dashboard');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[commonStyles.maincontainer]}>
                <View style={styles.container}>
                    <View style={[commonStyles.navbarcontainer]}>
                        <View style={[commonStyles.leftItem]}
                            onTouchEnd={handleBackButtonPress}
                        >
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

                    <View style={[commonStyles.paddingbottom2, commonStyles.paddingtop]}>
                        <View style={[commonStyles.width100, commonStyles.mtlesthan1, commonStyles.marginLeft1]}>
                            <View style={[commonStyles.widget2, commonStyles.paddingleft1]} >
                            <View style={styles.textwithinput}>
                                <View style={[commonStyles.containerflex]}>
                                <Text style={[commonStyles.textwhite, styles.textwidthA]}>
                                    Important Stock Details
                                </Text>
                                </View>
                            </View>

                            {/* Table structure */}
                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                    <Text style={commonStyles.textgolden}>Strategy Name:</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={[commonStyles.textwhite]}>
                                        {selectedStock.ISstrategyID ? selectedStock.ISstrategyID.strategyName : 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                <Text style={commonStyles.textgolden}>Stocks Name:</Text>
                                </View>
                                <View style={styles.tableCell}>
                                <Text style={[commonStyles.textwhite,]}>
                                    {selectedStock.ISstockID?.map(stock => stock.stockName).join(', ') || 'N/A'}
                                </Text>
                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                <Text style={commonStyles.textgolden}>Created At:</Text>
                                </View>
                                <View style={styles.tableCell}>
                                <Text style={[commonStyles.textwhite,]}>
                                    {selectedStock.createdAt &&
                                        `${formatDate(selectedStock.createdAt)} ${formatTime(selectedStock.createdAt)}`
                                    }
                                </Text>

                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                <Text style={commonStyles.textgolden}>Description:</Text>
                                </View>
                                <View style={styles.tableCell}>
                                <Text style={[commonStyles.textwhite]}>
                                    {selectedStock.ISstrategyID && selectedStock.ISstrategyID.description
                                    ? selectedStock.ISstrategyID.description
                                    : 'N/A'
                                    }
                                </Text>
                                </View>
                            </View>

                            </View>
                        </View>
                    </View>


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
        right: width * .068,
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
        marginBottom: 10,
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
    dropdown: {
        backgroundColor: '#F4F4F4',
        width: '100%',
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 8,
        zIndex: 1,
    },
    placeholderStyle1: {
        color: colors.bgblack,
        fontWeight: '600',
    },
    placeholderStyle: {
        color: colors.bgwhite,
        fontWeight: '600',
    },
    selectedTextStyle: {
        color: colors.bgblack
    },
    selectedStrategyInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        color: 'white',
        width: '100%',
    },

    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1, // Horizontal line
        borderColor: 'black',
        paddingVertical: 8,
      },
      tableCell: {
        flex: 1,
        textAlign: 'center',
        borderWidth: 1, // Vertical line
        borderColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        flexWrap: 'nowrap',
        fontSize: 18,
        padding: 8, // Adjust the padding to set cell size
      },
      textwidthA: {
        width: '100%',
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
      },

});


export default ViewStocks;