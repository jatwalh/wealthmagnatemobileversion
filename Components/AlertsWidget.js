import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { commonStyles } from '../assets/colors/style';
import colors from '../assets/colors/color';
import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const AlertsWidget = ({updateWidget}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [flag, setFlag] = useState(false);

    const determineAction = (text) => {
        const lowerCaseText = text.toLowerCase();
        if (lowerCaseText.includes('buy')) {
            return 'Buy';
        } else if (lowerCaseText.includes('sell')) {
            return 'Sell';
        } else if (lowerCaseText.includes('lowest')) {
            return 'Buy';
        } else if (lowerCaseText.includes('highest')) {
            return 'Sell';
        } else if (lowerCaseText.includes('bullish')) {
            return 'Buy';
        } else if (lowerCaseText.includes('bearish')) {
            return 'Sell';
        } else {
            return 'Unknown';
        }
    };

    const calculateTimeDifference = (receivedTime) => {
        const now = new Date();
        const receivedDate = new Date(receivedTime);
        const timeDifference = now - receivedDate;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        if (minutesDifference < 60) {
            return `${minutesDifference} min ago`;
        } else {
            const hoursDifference = Math.floor(minutesDifference / 60);
            return `${hoursDifference} hours ago`;
        }
    };

    const fetchData = async () => {
        try {
            const jsonString = await AsyncStorage.getItem('alertsData');
            const savedAlerts = JSON.parse(jsonString);

            if (savedAlerts === null) {
                // If savedAlerts is null, show loading
                setData(null);
                setFlag(false);
            } else {
                // If savedAlerts is available, set data and update flag
                setData(savedAlerts);
                setFlag(true);
            }
        } catch (error) {
            console.error('Error fetching alerts data:', error);
            setError('Error fetching alerts data');
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(fetchData, 60000);
        return () => {
            clearInterval(intervalId);
          };
    }, [updateWidget]);

    return (
        <View style={[commonStyles.widget2, commonStyles.paddingleft1, { height: 315 }]}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.headerText}>{error}</Text>
                </View>
            ) : (
                <SafeAreaView>
                    {flag === false ? (
                        <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                    ) : (
                        <>
                            {data === null ? (
                                <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
                            ) : (
                                <>
                                    {data.slice(0, 4).map((item, index) => (
                                        <View key={index}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item });
                                            }}>
                                                <View style={[commonStyles.flexDirectionrow, commonStyles.rowcenter]}>
                                                    <Image source={require('../assets/images/w-image.png')} style={commonStyles.wiproimg} />
                                                    <View style={[commonStyles.flexDirectionrow, commonStyles.containerflex, commonStyles.marginLeft2]}>
                                                        <Text style={[commonStyles.textwhite, commonStyles.marginRight2, commonStyles.fontsize16]}>
                                                            {item.header.subject[0]}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[commonStyles.rowcenter2, commonStyles.topminus]}>
                                                    <Text style={[commonStyles.textlightgray, commonStyles, commonStyles.marginLeft2]}>
                                                        {determineAction(item.text)}
                                                    </Text>
                                                    <Text style={[commonStyles.textgray, commonStyles.marginRight2]}>
                                                        {calculateTimeDifference(item.receivedTime)}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </SafeAreaView>
            )}
        </View>
    );
};

export default AlertsWidget;

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'red',
        fontSize: 16,
    },
    loader: {
        marginTop: 10,
    },
});






