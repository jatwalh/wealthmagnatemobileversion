import React, { useState, useEffect } from 'react';
import colors from './assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from './assets/colors/style';
import fonts from './assets/colors/color';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, Switch,
    useColorScheme,
    View, Alert,
    Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView,
    Keyboard, Button, ImageBackground
} from 'react-native';








function Filters() {



    // const [activeTab, setActiveTab] = useState(0);

    // const tabs = [
    //   'Tab 1',
    //   'Tab 2',
    //   'Tab 3',
    //   'Tab 4',
    //   'Tab 5',
    // ];

    // const handleTabPress = (index) => {
    //   setActiveTab(index);
    // };

    // const [activeTab, setActiveTab] = useState(1);

    // const tabs = [
    //     { title: 'Quick Filters 1', content: 'Content for Tab 1', content: 'Content for Tab efsrae'},
    //     { title: 'Tab 2', content: 'Content for Tab 2' },
    //     { title: 'Tab 3', content: 'Content for Tab 3' },
    // ];


    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            title: 'Quick Filters 56',
            content1: 'Today',
            content2: '6713',
            content3: 'Yesterday',
            content4: '54545',
            content5: '2 day ago',
            content6: '232',
            content7: '3 day ago',
            content8: '3454',


        },
        {
            title: 'Time',
            content1: 'Yes',
            content2: '6713',
            content3: 'No',
            content4: '54545',
            content5: 'Go',
            content6: '232',
            content7: 'Hello',
            content8: '3454',
        },
        {
            title: 'Category',
            content1: 'Yesterday',
            content2: '54545',
            content3: 'No',
            content4: '54545',
            content5: 'Go',
            content6: '232',
            content7: 'Hello',
            content8: '3454',

        },
        {
            title: 'Seen / unseen',
            content1: 'Seen',
            content2: '32',
            content3: 'UnSeen',
            content4: '4321',
            content5: 'Go',
            content6: '4321',
            content7: 'Hello',
            content8: '653',
        },
    ];


    return (
        <SafeAreaView style={[commonStyles.maincontainer]}>

            {/* <Header /> */}

            <View style={[, { width: width, padding: 16 }]}>
                <ScrollView >

                    <View style={[commonStyles.flexDirectionrow, styles.borderbottom]}>
                        <View style={[commonStyles.containerflex]}>
                            <Text style={[commonStyles.textwhite, commonStyles.fontsize16]}>
                                Filters
                            </Text>
                        </View>

                        <View style={[commonStyles.containerflex]}>
                            <Text style={[commonStyles.textred, commonStyles.textright, commonStyles.fontsize16]}>
                                Clear all
                            </Text>
                        </View>
                    </View>


                    <View style={[styles.container, commonStyles.mtlesthan1]}>

                        <View style={[styles.tabContainer]}>
                            {tabs.map((tab, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[commonStyles.textred,
                                    styles.tabItem,
                                    activeTab === index ? styles.activeTab : null,
                                    ]}
                                    onPress={() => setActiveTab(index)}
                                >
                                    <Text style={[styles.tabTitle, commonStyles.textblack]}>{tab.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>


                        <View style={[styles.contentContainer]}>


                            {/* 1st */}
                            <View style={styles.contentRow}>

                                <View style={[, { flexDirection: 'row' }]}>
                                    <Image source={require('./assets/images/tick.png')} style={styles.tickimg} />
                                    <Text style={[styles.contentText, commonStyles.marginLeft1]}>{tabs[activeTab].content1}</Text>
                                </View>

                                <View>
                                    <Text style={styles.contentText}>{tabs[activeTab].content2}</Text>
                                </View>
                            </View>

                            {/* 2nd */}
                            <View style={[styles.contentRow, commonStyles.mtlesthan1]}>

                                <View style={[, { flexDirection: 'row' }]}>
                                    <Image source={require('./assets/images/tick.png')} style={styles.tickimg} />
                                    <Text style={[styles.contentText, commonStyles.marginLeft1]}>{tabs[activeTab].content1}</Text>
                                </View>

                                <View>
                                    <Text style={styles.contentText}>{tabs[activeTab].content2}</Text>
                                </View>
                            </View>


                            {/* 3rd */}
                            <View style={[styles.contentRow, commonStyles.mtlesthan1]}>

                                <View style={[, { flexDirection: 'row' }]}>
                                    <Image source={require('./assets/images/tick.png')} style={styles.tickimg} />
                                    <Text style={[styles.contentText, commonStyles.marginLeft1]}>{tabs[activeTab].content1}</Text>
                                </View>

                                <View>
                                    <Text style={styles.contentText}>{tabs[activeTab].content2}</Text>
                                </View>
                            </View>


                            {/* 4th */}
                            <View style={[styles.contentRow, commonStyles.mtlesthan1]}>


                                <View style={[, { flexDirection: 'row' }]}>
                                    <Image source={require('./assets/images/tick.png')} style={styles.tickimg} />
                                    <Text style={[styles.contentText, commonStyles.marginLeft1]}>{tabs[activeTab].content3}</Text>
                                </View>

                                <View>
                                <Text style={styles.contentText}>{tabs[activeTab].content4}</Text>
                                </View>

                            </View>




                        </View>
                    </View>



                  <View style={[commonStyles.mt1]}>

                  <View style={[commonStyles.buttonContainer2]}>
                        <TouchableOpacity style={[commonStyles.btnbgcolor,commonStyles.btnbgwhite]} activeOpacity={0.7} onPress={() => console.log('Button pressed')}>
                            <Text style={[commonStyles.continuebtntext,commonStyles.textblack]}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[commonStyles.buttonContainer2]}>
                        <TouchableOpacity style={[commonStyles.btnbgcolor]} activeOpacity={0.7} onPress={() => console.log('Button pressed')}>
                            <Text style={[commonStyles.continuebtntext]}>Apply</Text>
                        </TouchableOpacity>
                    </View>



                  </View>



                </ScrollView >
            </View>

        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({


    container: {
        flex: 1,
        flexDirection: 'row',
    },

    borderbottom: {
        borderBottomColor: colors.borderbottomwhite,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },

    tickimg: {
        width: width * .03,
        height: height * .03,
        resizeMode: 'contain',

    },
    tabContainer: {
        width: width * .3, // Adjust the width as needed
        backgroundColor: colors.bglightwhite,
        borderRadius: 5
    },
    tabItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderbottomcolor,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    activeTab: {
        backgroundColor: colors.yellow,
        color: 'white',
    },

    tabTitle: {
        fontWeight: 600,
        marginTop: height * .01,

    },
    contentContainer: {
        flex: 1,
        padding: 10,

    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentText: {
        fontSize: 16,
        color: 'white',
    },
});


export default Filters;
