import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/color';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../assets/colors/style';
import {
    SafeAreaView,
    ScrollView,
    StatusBar, StyleSheet,
    Text, Switch,
    useColorScheme,
    View, Alert,
    Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView,
    Keyboard, Button, ActivityIndicator
} from 'react-native';

function Loader() {


    const [loading, setLoading] = useState(true);
    const [showSecondContainer, setShowSecondContainer] = useState(false);
    const [showThirdContainer, setShowThirdContainer] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
                setShowSecondContainer(true);
                setTimeout(() => {
                    setShowSecondContainer(false);
                    setShowThirdContainer(true);
                }, 2000);
            }, 1);
        }, 1);

    }, []);


    const navigation = useNavigation();

    const navigatetocreatepinpage = async () => {
        navigation.navigate('Createpin');
    };

    const Dashboardpage = async () => {
        navigation.navigate('Dashboard');
    };

    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#151413', height: height }}>
            <StatusBar />
            {/* <Header /> */}
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#00FF47" />
                        <Text style={commonStyles.textwhite}>
                            Wait a while your account has been created
                        </Text>
                    </View>
                ) : showSecondContainer ? (
                    <View style={styles.newContainer}>
                        <View style={styles.circle}>
                            <View style={styles.innerCircle}>
                                <Text style={styles.tick}>✓</Text>
                            </View>
                        </View>
                        <Text style={[commonStyles.textgreen, styles.circleticktext]}>
                            Your account has been created Successfully
                        </Text>
                    </View>
                )
                    : showThirdContainer ? (
                        <View style={[commonStyles.container2]}>
                            <ScrollView contentContainerStyle={[commonStyles.scrollContent]}>
                                <View style={[commonStyles.backbuttontopcontainer]}>
                                    <View style={[, { leftContainer: { flex: 1, } }]}>
                                        <TouchableOpacity
                                            onPress={handleBackButtonPress}>
                                            <Image source={require('../assets/images/backarrow.png')}
                                                style={[commonStyles.backarrow, styles.leftImage]} />
                                        </TouchableOpacity>

                                    </View>

                                    <View style={[commonStyles.middleforgottext]}>
                                        <Text style={[commonStyles.title2, commonStyles.poppinsfontsb, commonStyles.poppinsfontsb]}>
                                            Screen Locks
                                        </Text>
                                    </View>
                                </View>
                                <View style={[commonStyles.h2text, commonStyles.poppinsfontm]}>
                                    <Text style={[commonStyles.createaccounttext, commonStyles.center]}>
                                        Create pin for login
                                    </Text>
                                </View>

                                {/* Buttons */}
                                <View style={[commonStyles.buttonContainer]}>
                                    <TouchableOpacity style={styles.resetbtn1}
                                        activeOpacity={0.7}
                                        onPress={navigatetocreatepinpage}>
                                        <LinearGradient
                                            colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[commonStyles.subnmitlinearbtn]}>
                                            <Text style={commonStyles.submitbtntext}>
                                                Create pin
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <View style={[commonStyles.buttonContainer]}>
                                    <TouchableOpacity style={styles.resetbtn1}
                                        activeOpacity={0.7}
                                        onPress={() => console.log('Button pressed')}>
                                        <LinearGradient
                                            colors={['#F9C809', 'rgba(255, 0, 0, 0.35)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[commonStyles.subnmitlinearbtn]}>
                                            <View style={[commonStyles.rowcenter]}>
                                                <Text style={commonStyles.usebiometrictext}>
                                                    Use Biometric
                                                </Text>
                                                <Image
                                                    source={require('../assets/images/biometric.png')}
                                                    style={[commonStyles.usebiometricicon]}
                                                />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>


                                <View style={[commonStyles.buttonContainer]}>
                                    <TouchableOpacity
                                        style={[styles.resetbtn1, { backgroundColor: 'transparent' }]}
                                        activeOpacity={0.7}
                                        onPress={Dashboardpage}
                                    >
                                        <View style={[commonStyles.rowcenter]}>
                                            <Text style={commonStyles.submitbtntext}>
                                                Skip
                                            </Text>

                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    ) : null}
            </View>

        </SafeAreaView>
    );
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        // width: 200,
        // height: 200,
    },
    loadertext: {
        position: 'relative',
        marginTop: 1,
        fontSize: 16,
        fontWeight: 'bold'
    },
    newContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tick: {
        fontSize: 30,
        color: colors.bgblack,
        fontWeight: 'bold'
    },
    circleticktext: {
        marginTop: width * .058,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        //    width: width * .8
    },

    jnlnktext: {
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: 20,
    }

});
export default Loader;