
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import {
  ScrollView, StyleSheet,
  Text, View, Image, Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { setEmailAlerts, toggleEmailReadState } from '../actions/emailActions';
import Footer from '../Components/Footer';

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(timeString).toLocaleTimeString('en-US', options);
}

function EmailAlertsBodyScreen({ route, navigation, activeScreen }) {
  const { selectedEmailId } = route.params;
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    setSelectedEmail(route.params.selectedEmail);
  }, [route.params]);

  if (!selectedEmail) {
    return (
      <View style={styles.container}>
        <Text>Error: Email not found</Text>
      </View>
    );
  }

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={[commonStyles.navbarcontainer]}>
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.emailContent}>
          <Text style={styles.subject}>{selectedEmail?.header.subject}</Text>
          <View style={styles.stockDetails}>
            <Text style={styles.text}>{selectedEmail?.text}</Text>
          </View>
          <Text style={styles.DateFormat}>{formatDate(selectedEmail?.header.date)} {formatTime(selectedEmail?.header.date)}</Text>
        </View>
      </ScrollView>
      <View style={styles.footerSection}>
        <Footer navigation={navigation} activeScreen={activeScreen} />
      </View>
      {/* <Footer navigation={navigation} activeScreen={activeScreen} /> */}
    </View>
  );
}

const mapStateToProps = (state) => ({
  emailAlerts: state.email.emailAlerts || [],
});

const mapDispatchToProps = (dispatch) => ({
  setEmailAlerts: (emailAlerts) => dispatch(setEmailAlerts(emailAlerts)),
  toggleEmailReadState: (index) => dispatch(toggleEmailReadState(index)),
});

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgblack, paddingTop: 20 },
  text: { color: "white", fontSize: 15, },
  menuButton: { flex: 1, },
  profileImage: { flex: 1, alignItems: 'flex-end', },
  profilecontainer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginLeft: 10, marginRight: 10,
  },
  subjectandbody: { marginLeft: 10, flex: 1, },
  dateandtime: { marginRight: 5 },
  imagesizeaaa: {
    position: 'relative', width: width * .08,
    height: height * .09, resizeMode: 'contain',
  },
  sendersimagesize: {
    position: 'relative', width: width * .1,
    height: height * .1, resizeMode: 'contain',
  },
  footerSection: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', opacity: 1, height: 'auto' },
  avatar: {
    width: 40, height: 40,
    borderRadius: 30, justifyContent: 'center',
    alignItems: 'center', marginBottom: 10,
  },
  avatarText: { color: "white", fontSize: 16, },
  spinnerText: { color: "white" },
  noAlertsText: { color: "white", marginLeft: 20, marginTop: 20 },
  scrollView: { flex: 1, backgroundColor: colors.bgblack, },
  scrollViewContent: {
    justifyContent: 'center', alignItems: 'center',
    padding: 20, marginTop: 40,
  },
  emailContent: { width: '100%', },
  subject: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#fff', },
  body: { fontSize: 18, lineHeight: 24, color: '#fff', },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', },
  stockDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  DateFormat: { fontSize: 10, color: "white" }
});

export default connect(mapStateToProps, mapDispatchToProps)(EmailAlertsBodyScreen);
