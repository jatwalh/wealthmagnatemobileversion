import React, { useState, useEffect } from 'react';
import axios from 'axios';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
import fonts from '../assets/colors/color';
import Voice from '@react-native-community/voice';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import {
  setEmailAlerts,
  toggleEmailReadState,
} from '../actions/emailActions';
import Footer from '../Components/Footer';
import ModalComponent from '../Components/DateFilterModal';
import Calendar from 'react-native-calendar-range-picker';


function generateAvatarLetter(subject) {
  if (subject && subject.trim() !== "") {
    const subjectLower = subject.toLowerCase();

    if (
      subjectLower.includes('bb') ||
      subjectLower.includes('raw') ||
      subjectLower.includes('oss') ||
      subjectLower.includes('supernova') ||
      subjectLower.includes('pbatr') ||
      subjectLower.includes('pb') ||
      subjectLower.includes('cs5')
    ) {
      return extractFirstLetters(subject, 2).toUpperCase();
    } else if (
      subjectLower.includes('eca') ||
      subjectLower.includes('aph') ||
      subjectLower.includes('cs4')
    ) {
      return extractFirstLetters(subject, 2).toUpperCase();
    } else if (
      subjectLower.includes('pv') ||
      subjectLower.includes('avg') ||
      subjectLower.includes('hphv')
    ) {
      return extractFirstLetters(subject, 2).toUpperCase();
    }
  }

  // If subject is undefined, empty, or doesn't match the pattern, return a default letter
  return '?';
}

function extractFirstLetters(str, count) {
  // Extract the first letters of specific names
  const matches = str.match(/\b(bb|raw|oss|supernova|pbatr|pb|cs5|eca|aph|cs4|pv|avg|hphv)\b/gi);
  return matches ? matches.map(match => match.slice(0, count)).join('') : '';
}

const moment = require('moment');

function parseDate(dateString) {
  const parsedDate = moment(dateString, 'MMM D');

  // Add additional checks or modify the format string as needed

  if (!parsedDate.isValid()) {
    console.log('Warning: Invalid Date Format -', dateString);
    return null;
  }

  return parsedDate.toDate();
}


let userId = null;

function SearchFilter({
  emailAlerts,
  setEmailAlerts,
  toggleEmailReadState,
}) {

  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [savedSearchTerm, setSavedSearchTerm] = useState('');
  const [filteredEmailAlerts, setFilteredEmailAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  const [unreadFilterActive, setUnreadFilterActive] = useState(false);

  const [pitch, setPitch] = useState('');
  const [showGif, setshowGif] = useState(false);
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);


  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    setResults([]);
    console.log('onSpeechStart: ', e);
    setStarted('√');
    setshowGif(true);
  };

  const onSpeechEnd = (e) => {
    console.log('onSpeechEnd: ', e);
    setEnd('√');
    setshowGif(false);
    setLoading(false);
  };

  const onSpeechError = (e) => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setLoading(false);
  };

  const onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
    setSearchTerm(e.value[0]);
  };

  const onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };

  // Using AsyncStorage to save the searched term
  const saveSearchTerm = async () => {
    try {
      await AsyncStorage.setItem('searchTerm', searchTerm);
    } catch (error) {
      console.error('Error saving search term:', error);
    }
  };

  // retrieve the searched term
  const getSavedSearchTerm = async () => {
    try {
      const savedTerm = await AsyncStorage.getItem('searchTerm');
      if (savedTerm !== null) {
        // Set both searchTerm and savedSearchTerm
        setSearchTerm(savedTerm);
        setSavedSearchTerm(savedTerm);
      }
    } catch (error) {
      console.error('Error getting saved search term:', error);
    }
  };

  useEffect(() => {
    // Call the async function to retrieve saved search term
    getSavedSearchTerm();
  }, []);

  useEffect(() => {
    // Check if there's a search term or date filter
    const hasSearchTermOrDateFilter = searchTerm || selectedDateFilter;

    // Only filter and update the alerts if there's a search term or date filter
    if (hasSearchTermOrDateFilter) {
      // Filter email alerts based on the search term 
      const filteredAlerts = emailAlerts.filter((alert) =>
        alert.header.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // date filter
      const filteredByDate = filterEmailsByDate(filteredAlerts, selectedDateFilter);

      console.log('Filtered by date:', filteredByDate);

      setFilteredEmailAlerts(filteredByDate);

      // Save the searched term
      saveSearchTerm();
    } else {
      // No search term or date filter, so don't display emailAlerts
      setFilteredEmailAlerts([]);
    }
  }, [searchTerm, emailAlerts, selectedDateFilter]);


  const handleSearch = () => {
    console.log('Search term:', searchTerm);
    // Save the searched term
    saveSearchTerm();
  };

  const toggleReadState = (index) => {
    // Dispatch the action with the index
    toggleEmailReadState(index);
  };


  const handleDateFilterPress = () => {
    setIsDatePickerVisible(true);
  };

  const handleDateFilterSelect = (filter) => {
    setSelectedDateFilter(filter);
    setIsDatePickerVisible(false);

  };


  const filterEmailsByDate = (alerts, dateFilter) => {
    const today = new Date();

    switch (dateFilter) {
      case 'anyTime':
        console.log('Filtering for any time');
        return alerts;

      case 'olderThanWeek':
        console.log('Filtering for olderThanWeek');
        return alerts.filter((alert) => {
          const rawDate = alert.header.date;
          console.log('Raw Date String:', rawDate);

          // Add logic to handle the specific format of your date strings
          const alertDate = parseDate(rawDate);
          if (alertDate === null) {
            console.log('Invalid Date Format - Skipping:', rawDate);
            return false;
          }

          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return alertDate < weekAgo;
        });

      case 'olderThanMonth':
        console.log('Filtering for olderThanMonth');
        return alerts.filter((alert) => {
          const rawDate = alert.header.date;
          console.log('Raw Date String:', rawDate);

          // Add logic to handle the specific format of your date strings
          const alertDate = parseDate(rawDate);
          if (alertDate === null) {
            console.log('Invalid Date Format - Skipping:', rawDate);
            return false;
          }

          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return alertDate < monthAgo;
        });

      case 'olderThan6Months':
        console.log('Filtering for olderThan6Months');
        return alerts.filter((alert) => {
          const rawDate = alert.header.date;
          console.log('Raw Date String:', rawDate);

          // Add logic to handle the specific format of your date strings
          const alertDate = parseDate(rawDate);
          if (alertDate === null) {
            console.log('Invalid Date Format - Skipping:', rawDate);
            return false;
          }

          const sixMonthsAgo = new Date(today);
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          return alertDate < sixMonthsAgo;
        });

      case 'olderThanYear':
        console.log('Filtering for olderThanYear');
        return alerts.filter((alert) => {
          const rawDate = alert.header.date;
          console.log('Raw Date String:', rawDate);

          // Add logic to handle the specific format of your date strings
          const alertDate = parseDate(rawDate);
          if (alertDate === null) {
            console.log('Invalid Date Format - Skipping:', rawDate);
            return false;
          }

          const yearAgo = new Date(today);
          yearAgo.setFullYear(today.getFullYear() - 1);
          return alertDate < yearAgo;
        });

      case 'customRange':
        console.log('Filtering for customRange');
        return alerts;

      default:
        console.log('Default case');
        return alerts;
    }
  };

  return (

    <SafeAreaView style={[commonStyles.maincontainer]}>

      {showGif && (
        <View style={[styles.gifcontainer, { height, width }]}>
          <Image
            style={{ width: 100, height: 100 }}
            resizeMode="cover"
            source={require('../assets/images/voice.gif')}
          />
        </View>
      )}


      <View style={styles.container}>

        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}>
              <Image source={require('../assets/images/backarrow.png')}
                style={[styles.backarrow]} />
            </TouchableOpacity>

          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search in emails"
            placeholderTextColor="lightgray"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />

          <View style={[styles.profileImage, commonStyles.marginRight1]}>
            <TouchableOpacity onPress={startRecognizing}>
              <Image source={require('../assets/images/mic.png')} style={[styles.imagesizeaaa]} />
            </TouchableOpacity>
          </View>

        </View>

        {/* Added Unread, Date buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              unreadFilterActive && { backgroundColor: 'blue' },
            ]}

          >
            <Text
              style={[styles.buttonText,
              unreadFilterActive && { color: 'white' }
              ]}
            >Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleDateFilterPress}
          >
            <Text style={styles.buttonText}>
              {selectedDateFilter ? selectedDateFilter : 'Date'}
            </Text>

          </TouchableOpacity>

          {/* Rendering the ModalComponent  */}
          <ModalComponent
            isVisible={isDatePickerVisible}
            handleDateFilterSelect={handleDateFilterSelect}
          />

        </View>

        <Text style={[styles.additionalText,
        commonStyles.fontsize15,
        commonStyles.textgray,
        commonStyles.marginLeft0]}>
          Recent Email Searches
        </Text>

        {/* Render the Calendar only when the custom range is selected */}
        {selectedDateFilter === 'customRange' && (
          <View
            style={styles.Calendarcontainer}
          >
            <Calendar
              startDate=""
              endDate=""
              onChange={({ startDate, endDate }) => {
                console.log({ startDate, endDate });
              }}
            />
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContent} style={{ flex: 1 }}>
          {/* Displaying the searched text */}
          <Text style={[styles.additionalText,
          commonStyles.fontsize15,
          commonStyles.textgray,
          commonStyles.marginLeft0,
          { marginTop: 5, }
          ]}>
            {` ${searchTerm}`}
          </Text>

          {loading && searchTerm ? (
            <ActivityIndicator
              size="large"
              color={colors.white}
              style={styles.loader}
            />
          ) : (
            filteredEmailAlerts.length > 0 && (
              filteredEmailAlerts.map((item, index) => {
                // function to determine the color based on the subject
                const getSubjectColor = (subject) => {
                  const subjectLower = subject.toLowerCase();
                  if (subjectLower.includes('bb')
                    || subjectLower.includes('raw')
                    || subjectLower.includes('oss')
                    || subjectLower.includes('supernova')
                    || subjectLower.includes('pbatr')
                    || subjectLower.includes('pb')
                    || subjectLower.includes('cs5')) {
                    return 'blue';
                  } else if (subjectLower.includes('eca')
                    || subjectLower.includes('aph')
                    || subjectLower.includes('cs4')) {
                    return 'red';
                  } else if (subjectLower.includes('pv')
                    || subjectLower.includes('avg')
                    || subjectLower.includes('hphv')) {
                    return 'green';
                  }
                  return 'white';
                };

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      commonStyles.mta,
                      styles.notificationbox,
                      {
                        backgroundColor: item.read ? colors.bgblack : '#484848',

                      },
                    ]}
                    onPress={() => toggleReadState(index)}
                  >
                    <View style={styles.profilecontainer}>
                      {item.profileImage ? (
                        <Image source={{ uri: item.profileImage }} style={styles.avatarImage} />
                      ) : (
                        <View style={[styles.avatar, { backgroundColor: getSubjectColor(item.header.subject) }]}>
                          <Text style={[styles.avatarText,
                          commonStyles.fontbold,
                          ]}>
                            {generateAvatarLetter(item.header.subject)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.subjectandbody}>
                        <Text style={[styles.additionalText,
                        commonStyles.fontsize12,
                        commonStyles.fontbold,
                        {
                          backgroundColor: getSubjectColor(item.header.subject),
                          borderRadius: 3,
                          width: item.header.subject.length * 7,
                        }]}>
                          {item.header.subject}
                        </Text>
                        <Text style={[styles.additionalText,
                        commonStyles.fontsize10,
                        {
                          color: "#F6F6F6",
                          marginTop: 5,
                          width: Dimensions.get('window').width - 120,
                        }]}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.body}
                        </Text>
                      </View>
                      <View style={styles.dateandtime}>
                        <Text style={[styles.additionalText,
                        commonStyles.fontsize10,
                        commonStyles.fontbold,
                        { color: 'gray' }]}>
                          {item.header.date}
                        </Text>
                        <Text style={[styles.additionalText,
                        commonStyles.fontsize10,
                        commonStyles.fontbold,
                        { color: 'gray', marginTop: 10 }]}>
                          {item.receivedTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )
          )}
        </ScrollView>

        {/* Footer Section */}
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const emailAlerts = state.email.emailAlerts;
  console.log('Emails in Redux State:', emailAlerts);
  return {
    emailAlerts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEmailAlerts: (emailAlerts) => dispatch(setEmailAlerts(emailAlerts)),
    toggleEmailReadState: (index) => {
      console.log('Toggling Read State for Index:', index);
      dispatch(toggleEmailReadState(index));
    },
  };
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgblack,
    paddingTop: 10,
    // paddingLeft: 20,
  },

  notificationbox: {
    padding: 5,
    width: "100%",
    marginTop: 1,
    // marginLeft: 20,
    // marginRight: 20,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#484848',
    borderRadius: 30,
    paddingLeft: 20,
    margin: 20,
    height: 50,

  },

  searchInput: {
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
    marginLeft: 10,
    marginRight: 5
  },

  backarrow: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .07,
    height: height * .07,
    resizeMode: 'contain',
  },

  imagesizeaaa: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .04,
    height: height * .06,
    resizeMode: 'contain',
  },

  sendersimagesize:
  {
    position: 'relative',
    // left: width * 0.07,
    width: width * .1,
    height: height * .1,
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


  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    marginLeft: 20,

  },
  gifcontainer: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    padding: 6,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  spinnerText: {
    color: "white",
  },

  picker: {
    // width: 20,
    color: "#fff",

  },

  savedSearchText: {
    marginTop: 12,
    color: 'gray',
    marginLeft: 22,
    fontSize: 20,
  },

  recentSearchesimg: {
    height: 17,
    width: 19,
    marginLeft: 20,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20,

  },

  deleteButton: {
    color: 'white',
    marginTop: 12,

  },

  noAlertsText: {
    color: "white",
    marginLeft: 20,
    marginTop: 20
  },

  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },

  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  closeButton: {
    alignSelf: 'flex-start',

  },

  closeButtonText: {
    fontSize: 24,
    color: 'black',

  },
  modalHeaderText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: 'lightgray',
  },
  modalText: {
    color: 'black',
    fontSize: 16,

  },
  modalcustomText: {
    color: 'blue',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 40,
  },
  circletextcontainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  circle: {
    width: 15,
    height: 15,
    borderRadius: 10, // Make it a circle
    backgroundColor: 'white', // Change the background color as needed
    borderWidth: 1, // Add a black border
    borderColor: 'black', // Set the border color
    marginRight: 8, // Adjust the spacing between the circle and text
  },

  Calendarcontainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginVertical: 30,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
  },
});

// Connect the component to Redux
export default connect(mapStateToProps, {
  setEmailAlerts,
  toggleEmailReadState,
})(SearchFilter);