import React, { useState, useEffect } from 'react';
import axios from 'axios';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Text, View, Image, Dimensions,
    ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Components/Footer';


function NewsScreen({ route }) {

    const activeScreen = route.name;

    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();




    const handleNewsAlert = (item) => {
        navigation.navigate("NewsBody", { newsBody: item })
    }

    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        setSelectedNews(route.params.newsBody);
    }, [route.params]);

    const handleBackButtonPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };






    return (

        <SafeAreaView style={[commonStyles.maincontainer]}>

            <View style={[styles.container]}>
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

                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.container2}>
                        <Text style={[styles.additionalText,
                        commonStyles.fontsize15,
                        commonStyles.textwhite,
                        commonStyles.marginLeft1,
                        { marginBottom: 10 }
                        ]}>
                            News
                        </Text>

                        <View>
                            <Text style={{ color: "white" }}>{selectedNews?.Name}</Text>
                            <Text style={{ color: "white" }}>{selectedNews?.Country}</Text>
                            <Image
                                source={require('../assets/images/mobileimage.png')}
                                style={[styles.newsimage]}
                            />
                            <Text style={{ color: "white" }}>{selectedNews?.Currency}</Text>
                            <Text style={styles.NewsPara}>
                                It is a long established fact that a reader will be distracted by the readable content of a
                                page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
                                normal distribution of letters, as opposed to using 'Content here, content here', making it
                                look like readable English. Many desktop publishing packages and web page editors now use Lorem
                                Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites
                                still in their infancy. Various versions have evolved over the years, sometimes by accident,
                                sometimes on purpose injected humour and the like.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Section */}
                <Footer navigation={navigation} activeScreen={activeScreen} />
            </View>
        </SafeAreaView>

    );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgblack,
        paddingTop: 10,

    },
    NewsPara: {
        textAlign: 'justify',
        // textAlignLast: 'justify',
        color: "white"
    },

    notificationbox: {
        padding: 5,
        width: "100%",
        marginTop: 1,

    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#484848',
        borderRadius: 30,
        paddingLeft: 20,
        margin: 20,
        height: 50,
        zIndex: 1,

    },

    searchInput: {
        flex: 4,
        color: 'white',
        fontSize: 16,
    },

    searchInputContainer: {
        flex: 4,
        color: 'white',
        fontSize: 16,
    },

    menuButton: {
        flex: 1,
    },
    profileImage: {
        flex: 1,
        alignItems: 'flex-end',
    },

    profilecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
    },

    subjectandbody: {
        marginLeft: 10,
        flex: 1
    },

    dateandtime: {
        marginRight: 5
    },

    imagesizeaaa: {
        // position: 'relative',
        width: width * .08,
        height: height * .09,
        resizeMode: 'contain',
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    avatarText: {
        color: "#fff",
        fontSize: 16,
    },

    additionalText: {
        color: '#d1d1d1',
    },

    mtop: {
        marginTop: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    container2: {

        padding: 16,
    },

    boxcontainer: {
        flexDirection: 'row', // Arrange children in a row
        alignItems: 'center', // Center vertically
        backgroundColor: '#212121',
        borderRadius: 8,
        padding: 16,
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    boxleftSide: { marginRight: 8, width: '60%', },
    rightSide: { marginLeft: 8, width: '40%', },
    newstitle: { fontSize: 19, color: 'white', textAlign: 'left', },
    newspara: { fontSize: 16, color: 'white', textAlign: 'left', },
    newsimage: { width: '100%', height: 100, resizeMode: 'cover', },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 300 },
});


export default NewsScreen;




























