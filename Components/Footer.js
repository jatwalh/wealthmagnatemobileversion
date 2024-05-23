// Footer.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import colors from '../assets/colors/color';

const { width } = Dimensions.get('window');

const Footer = ({ navigation, activeScreen }) => {

  const handleAlertsScreen = () => {
    navigation.navigate('AlertsTwo');
  };

  const handleHomeIcon = () => {
    navigation.navigate('Dashboard');
  };

  const handleNewsScreen = () => {
    navigation.navigate('NewsScreen');
  };

  return (
    <View style={styles.footerContainer}>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={handleHomeIcon}
      >
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../assets/images/Home1.png')}
            style={[
              styles.footerIcon,
              { tintColor: activeScreen === 'Dashboard' ? '#F5D020' : colors.white },
            ]}
          />
          <Text
            style={[
              styles.footerText,
              { color: activeScreen === 'Dashboard' ? '#F5D020' : colors.white },
            ]}
          >
            Home
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={handleAlertsScreen}
      >
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../assets/images/alert.png')}
            style={[
              styles.footerIcon,
              { tintColor: activeScreen === 'AlertsScreen' ? '#F5D020' : colors.white },
            ]}
          />
          <Text
            style={[
              styles.footerText,
              { color: activeScreen === 'AlertsScreen' ? '#F5D020' : colors.white },
            ]}
          >
            Alerts
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={handleNewsScreen}
      >
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../assets/images/news.png')}
            style={[
              styles.footerIcon,
              { tintColor: activeScreen === 'NewsScreen' ? '#F5D020' : colors.white },
            ]}
          />
          <Text
            style={[
              styles.footerText,
              { color: activeScreen === 'NewsScreen' ? '#F5D020' : colors.white },
            ]}
          >
            News
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.footerItem}>
        <View style={styles.iconTextContainer}>
          <Image source={require('../assets/images/community.png')} 
          style={styles.footerIcon} />
          <Text 
          style={styles.footerText}>
            Community
            </Text>
        </View>    
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.footerItem}>
        <View style={styles.iconTextContainer}>
          <Image 
          source={require('../assets/images/e-learning.png')} 
          style={styles.footerIcon} />
          <Text 
            style={styles.footerText}>
              E-learning
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: colors.footerbg,
    borderTopWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    bottom: 0,
    // width: width,
    width: '100%', // Set width to '100%' for full width
  },
  footerItem: {
    flex: 1, 
    alignItems: 'center',
  },
  iconTextContainer: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 25,
    height: 20,
    marginBottom: 5,
    // added deepak
    resizeMode: "contain",
  },
  footerText: {
    fontSize: 12,
    color:colors.lightgray
  },
});

export default Footer;
