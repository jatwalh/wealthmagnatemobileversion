
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, Dimensions,
  TouchableOpacity, ScrollView, Animated, PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


const Sidebar = ({ handleToggleSidebar, selectedItem, handleSelectItem, colors, countAlerts, emailAlerts, userData }) => {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const [slideIndex, setSlideIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleSidebarWithAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    toggleSidebarWithAnimation();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx }) => {
      const screenWidth = Dimensions.get('window').width;
      const offset = dx / screenWidth;
      setSlideIndex((prevIndex) => Math.max(0, Math.min(prevIndex + offset, 2)));
    },
    onPanResponderRelease: (_, { vx }) => {
      const screenWidth = Dimensions.get('window').width;
      const velocity = vx / screenWidth;

      if (velocity >= 0.5) {
        setSlideIndex((prevIndex) => Math.min(prevIndex + 1, 2));
      } else if (velocity <= -0.5) {
        setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    },
  });

  // Use countAlerts function to get counts for each item
  const getCountForItem = (item) => countAlerts(item);

  const currentSelectedItem = selectedItem || 'Trading';
  const [sType, setType] = useState([])
  const [sName, setSName] = useState([]);
  const [allUnread, setAllunread] = useState()

  const navigation = useNavigation();

  useEffect(() => {
    const mydata = async () => {
      const jsonString = await AsyncStorage.getItem('userData');
      const userData = await JSON.parse(jsonString);
      const allStrategyTypes = userData.strategyOBJ.filter(
        strategy => strategy.strategyID.strategyType);
      const strategyType = allStrategyTypes.map(data => (
        { nameType: data.strategyID.strategyType }
      ));
      const uniqueSNames = [...new Set(strategyType.map(obj => obj.nameType))];
      setType(uniqueSNames);
      const strategyNames = allStrategyTypes.map(data => ({
        nameStrategy: data.strategyID.strategyName
      }));
      setSName(strategyNames);
      const jsonString2 = await AsyncStorage.getItem('alertsData');
      const userAlerts = await JSON.parse(jsonString2);
      const readTrueArray = userAlerts.filter(item => item.read === true);
      const readFalseArray = userAlerts.filter(item => item.read === false);
      setAllunread(readFalseArray.length)
      // console.log(readTrueArray.length, readFalseArray.length)
      // const modifiedData = strategyNames.map(item => ({ nameStrategy: item.nameStrategy + ' ' }));
      // return console.log(modifiedData);

    }
    mydata();

  }, [userData])

  return (
    <PanGestureHandler {...panResponder.panHandlers}>
      <Animated.View style={[styles.sidebarContainer, { opacity: fadeAnim },
      { transform: [{ translateX: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }] }]} >
        {/* <ScrollView style={{ height:500 }}> */}
        <View style={styles.sidebarHeader}>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.closeContainer} >
            <Text style={styles.alerttext}>Alerts</Text>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.sidebarContent, selectedItem.includes('Trading') && { backgroundColor: colors.bgblack }]} >
          <TouchableOpacity onPress={() => handleSelectItem('All', "allalerts")}>
            <View style={styles.sidebarItemContainer}>
              <Text style={styles.sidebarItem}>All Alerts</Text>
              <Text style={[styles.sidebarItemNumber,]}>
                {allUnread}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {sType.map((item, index) => (
          <View key={index} style={[styles.sidebarContent, selectedItem === `${item}` && { backgroundColor: colors.bgblack }]}>
            <TouchableOpacity onPress={() => handleSelectItem(item, "Types")}>
              <View style={styles.sidebarItemContainer}>
                <Text style={styles.sidebarItem}>{`${item} Strategy Alerts`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {sName.map((item, index) => (
          <View key={index} style={[styles.sidebarStrategySection, selectedItem === `${item.nameStrategy}` && { backgroundColor: colors.bgblack }]} >
            <TouchableOpacity onPress={() => handleSelectItem(item.nameStrategy)}>
              <View style={styles.sidebarItemContainer}>
                <Text style={styles.sidebarItem}>{item.nameStrategy}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <View style={[styles.sidebarContent, selectedItem.includes('Weightage') && { backgroundColor: colors.bgblack }]} >
          <TouchableOpacity onPress={() => { navigation.navigate('WeightageScreen') }}>
            <View style={styles.sidebarItemContainer}>
              <Text style={styles.sidebarItem}>Weightage</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.sidebarContent, selectedItem.includes('Important Alerts') && { backgroundColor: colors.bgblack }]} >
          <View style={styles.impcontainer}>
            <TouchableOpacity onPress={() => { handleSelectItem("Important", 'importantalerts') }} >
              <View style={styles.sidebarItemContainer}>
                <Text style={styles.sidebarItem}>Important Alerts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('ImportantAlertsSetting') }} >
              <View style={styles.sidebarItemContainer}>
                <Image source={require('./../assets/images/setting.png')} style={styles.settingsIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.sidebarContent, selectedItem.includes('Notification Settings') && { backgroundColor: colors.bgblack }]} >
          <View style={styles.impcontainer}>
            <TouchableOpacity onPress={() => { handleSelectItem('Notification Settings') }}>
              <View style={styles.sidebarItemContainer}>
                <Text style={styles.sidebarItem}>Notification Settings</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('NotificationsAlertsSetting') }} >
              <View style={styles.sidebarItemContainer}>
                <Image source={require('./../assets/images/setting.png')} style={styles.settingsIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={[styles.sidebarContent, selectedItem.includes('Combination Alerts') && { backgroundColor: colors.bgblack }]} >
            <View style={styles.impcontainer}>
              <TouchableOpacity onPress={() => { handleSelectItem("Combination", 'combinationalerts') }}>
                <View style={styles.sidebarItemContainer}>
                  <Text style={styles.sidebarItem}>Combination Settings</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.navigate('CombinationsAlertsSetting') }} >
                <View style={styles.sidebarItemContainer}>
                  <Image source={require('./../assets/images/setting.png')} style={styles.settingsIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View> */}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {/* </ScrollView> */}
      </Animated.View>
    </PanGestureHandler>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

  closeContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 2, borderBottomColor: '#d1d1d1',
    paddingHorizontal: 5, paddingVertical: 20,
  },
  closeButton: {
    fontSize: 20, fontWeight: 'bold', color: '#d1d1d1',
    alignSelf: 'flex-end', marginRight: 10,
  },
  alerttext: {
    flexDirection: 'row', color: '#d1d1d1', fontSize: 20,
    marginLeft: 35, fontWeight: 'bold',
  },
  sidebarContainer: {
    backgroundColor: '#272424',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height, left: -25,
    top: -15, position: 'absolute', zIndex: 2,
  },
  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  sidebarItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
  sidebarContent: { marginLeft: 20, marginTop: 10, justifyContent: 'center', },
  sidebarStrategySection: { marginLeft: 20, marginTop: 10, justifyContent: 'center', },
  sidebarItemContainer3: { flexDirection: 'row', alignItems: 'center', },
  sidebarItem: {
    color: '#d1d1d1', textAlign: 'left',
    fontSize: 16, padding: 2,
  },
  sidebarItemNumber: {
    color: '#d1d1d1', fontSize: 16,
    padding: 5, marginRight: 10,
  },
  settingsIcon: {
    width: width * 0.05, height: height * 0.05,
    resizeMode: 'contain', marginRight: 10,
  },
  impcontainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  logoutText: {
    color: "white", fontSize: 22,
    padding: 5, marginBottom: 35, marginLeft: 20,
  },

});
export default Sidebar;