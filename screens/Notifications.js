import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, ScrollView,
    StyleSheet, Text, View,
    Image, Dimensions, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../Components/Footer';


function NotificationScreen({ emailAlerts }) {
    const navigation = useNavigation();
    const [alertsData, setAlertsData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [data, setData] = useState([])

    const handlealertsbutton = () => {
        navigation.navigate('AlertsScreen');
    };
    const handleBackButtonPress = () => {
        navigation.goBack();
    };
    const handlehomeicon = () => {
        navigation.navigate('Dashboard');
    };

    useEffect(() => {

        const test = async () => {
            await setAlertsData(emailAlerts);




            const jsonString = await AsyncStorage.getItem('userData');
            const user = await JSON.parse(jsonString);
            setUserData(user);  // stroe the userData from local Storage.
            const userSelctedStocks = user.importantStocks.map((data) => (
                data.ISstockID.map((sName) => (sName.stockName))
            ));
            const allImpostantStocks = userSelctedStocks.flat();
            const uniqueStockNames = [...new Set(allImpostantStocks)]; // got all important selected stocks 
            const userSelectedStocks = await user.importantStocks.map((data) => {
                const strategyName = data.ISstrategyID.strategyName;
                const strategyType = data.ISstrategyID.strategyType;
                return { strategyName, strategyType };
            });

            const matchingEmails = alertsData.filter(email => {
                const subjectWords = email.header.subject.split(/\s+/);
                return uniqueStockNames.some(stockName => subjectWords.includes(stockName));
            });

            const uniqueUserSelectedStocks = userSelectedStocks.filter((value, index, self) =>
                index === self.findIndex((obj) =>
                    obj.strategyName === value.strategyName && obj.strategyType === value.strategyType
                )
            );
            const selectedStrategy = uniqueUserSelectedStocks.map((data) => (
                data.strategyName
            ))

            setData(matchingEmails);
            console.log("userSelctedStrategy", selectedStrategy);
        }
        test()

    }, []);

    const viewAlert = (item) => {
        navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item })
    };


    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>

            <View style={styles.container}>

                <View style={[commonStyles.navbarcontainer]}>
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


                <ScrollView contentContainerStyle={[styles.scrollViewContent, commonStyles.paddingbottom2, {}]}>
                    {/* <View style={[commonStyles.width100, commonStyles.mt1]}> */}
                    <View style={[commonStyles.mt1, { marginLeft: 20, marginRight: 20 }]}>
                        <View style={[]}>
                            <View style={[styles.additionalTextContainer,]}>
                                <View style={[commonStyles.containerflex]}>
                                    <Text style={[styles.additionalText, commonStyles.fontsize20,
                                    commonStyles.textwhite]}>
                                        Notifications
                                    </Text>
                                </View>
                                <View style={[commonStyles.flexDirectionrow, commonStyles.containerflex, commonStyles.marginRight1,]}>
                                    <Image source={require('../assets/images/filter.png')}
                                        style={[styles.filterimage, styles.flexDirectionrow]} />
                                    <Image source={require('../assets/images/search.png')}
                                        style={[styles.searchimage, styles.flexDirectionrow]} />
                                </View>
                            </View>

                            <View style={[commonStyles.mt1]}>
                                <Text style={[styles.additionalText, commonStyles.fontsize20, commonStyles.fontbold,
                                commonStyles.textwhite]}>
                                    New
                                </Text>
                            </View>
                            {data.map((item, index) => (
                                <TouchableOpacity onPress={() => viewAlert(item)} >
                                    <View
                                        key={index}
                                        style={[commonStyles.mtlesthan1, styles.notificationbox]}>
                                        <Text style={[styles.additionalText, commonStyles.fontsize14, commonStyles.fontbold,
                                        commonStyles.textwhite]}>
                                            {item.header.subject}

                                            {'\n'}
                                        </Text>
                                        <Text style={[styles.additionalText, commonStyles.fontsize12, commonStyles.fontbold,
                                        commonStyles.textlightgray2, commonStyles.fontnormal]}>
                                            Verification successfully done
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
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

    marginRight3: {
        position: 'relative',
        right: 10
    },

    marginRight4: {
        position: 'relative',
        right: 0
    },


    notificationbox: {
        borderRadius: 15,
        backgroundColor: '#484848',
        elevation: 5,
        shadowColor: 'rgba(255, 255, 255, 0.60)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        padding: 10,
        width: width * .9
    },

    filterimage: {
        position: 'absolute',
        right: width * .11,
        top: width * -.07,
        width: width * .05,
        height: height * .035,
        resizeMode: 'contain',
    },
    searchimage: {
        position: 'absolute',
        right: width * -.03,
        width: width * .1,
        top: width * -.07,
        height: height * .035,
        resizeMode: 'contain',
    },

    additionalTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

});

const mapStateToProps = (state) => ({
    emailAlerts: state.email.emailAlerts,
})

export default connect(mapStateToProps)(NotificationScreen);