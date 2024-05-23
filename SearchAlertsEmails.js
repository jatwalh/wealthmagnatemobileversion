import React, { useState, useEffect } from 'react';
import axios from 'axios';
import colors from './assets/colors/color';
import { commonStyles } from './assets/colors/style';
import fonts from './assets/colors/color';
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
  Keyboard,
  Button,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
// import searchEmailUsingMicScreen from './searchEmailUsingMic';
import { connect } from 'react-redux';
import {
  setEmailAlerts,
  toggleEmailReadState,
} from './actions/emailActions';


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


const ModalComponent = ({ isVisible, handleDateFilterSelect }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={() => handleDateFilterSelect(null)} // Handle modal close when tapping outside
  >
    <View style={styles.modalContainer}>
      {/* Modal content */}
      <View style={styles.modalContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleDateFilterSelect(null)}>
            <Text
              style={styles.closeButtonText}>&times;</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Date</Text>
        </View>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('anyTime')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle}
              onPress={() => handleDateFilterSelect('anyTime')}
            />
            <Text style={styles.modalText}>Any time</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('olderThanWeek')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle}
              onPress={() => handleDateFilterSelect('olderThanWeek')}
            />
            <Text style={styles.modalText}>Older than a week</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('olderThanMonth')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle}
              onPress={() => handleDateFilterSelect('olderThanMonth')}
            />
            <Text style={styles.modalText}>Older than a month</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('olderThan6Months')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle}
              onPress={() => handleDateFilterSelect('olderThan6Months')}
            />
            <Text style={styles.modalText}>Older than 6 months</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('olderThanYear')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle}
              onPress={() => handleDateFilterSelect('olderThanYear')}
            />
            <Text style={styles.modalText}>Older than a year</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDateFilterSelect('customRange')}>
          <Text style={styles.modalcustomText}>Custom range</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

let userId = null;

function SearchAlertsEmails({
  emailAlerts,
  setEmailAlerts, // Step 2: Map Redux actions to component props
  toggleEmailReadState,
}) {

  const navigation = useNavigation();

  // const [emailAlerts, setEmailAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [refresh, setRefresh] = useState(false);
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
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    setResults([]);
    //  setDisabled(true)
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setStarted('√');
    setshowGif(true)
  };

  const onSpeechEnd = e => {
    //    setDisabled(false)
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setEnd('√');
    setshowGif(false);
    setLoading(false);
  };

  const onSpeechError = e => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setLoading(false);
  };

  const onSpeechResults = async e => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    setResults(e.value[0]);
    // setSavedSearches([...savedSearches, e.value[0]]);
    // setSavedSearches(prevSearches => [...prevSearches, e.value[0]]);

    const spokenText = e.value[0];

    // Update the searchText state with the recognized speech
    setSearchText(spokenText);

    getUserIdFromStorage()
      .then((userId) => {
        if (userId) {
          fetchEmailData(userId, spokenText);
        }
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
    // if(e.value.length===1){
    //   console.log(e.value[0])
    //   onClickEventDropDown(e.value[0])
    // }
  };

  const onSpeechPartialResults = e => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = e => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    console.log('start');
    //Starts listening for speech for a specific locale
    try {
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };


  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function formatTime(timeString) {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(timeString).toLocaleTimeString('en-US', options);
  }

  // Fetch the user ID from AsyncStorage
  const getUserIdFromStorage = async () => {
    try {
      const jsonString = await AsyncStorage.getItem('userData');
      const user = JSON.parse(jsonString);
      return user._id;
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
      return null;
    }
  };


  const saveSearchedEmails = async (searchText, emailAlerts) => {
    try {
      const searchKey = `searchedEmails:${searchText}`;
      await AsyncStorage.setItem(searchKey, JSON.stringify(emailAlerts));
      console.log(`Saved email search for "${searchText}"`);

      // Only add to savedSearches if it's not already in the array
      if (!savedSearches.includes(searchText)) {
        setSavedSearches([...savedSearches, searchText]);
      }
    } catch (error) {
      console.error('Error saving searched emails to AsyncStorage:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const recentSearchesData = await AsyncStorage.getItem('recentSearches');
      if (recentSearchesData) {
        const parsedData = JSON.parse(recentSearchesData);
        console.log('Loaded recent searches:', parsedData);
        setRecentSearches(parsedData);
      } else {
        console.log('No recent searches found in storage.');
      }
    } catch (error) {
      console.error('Error loading recent searches from AsyncStorage:', error);
    }
  };

  const deleteRecentSearch = (index) => {
    console.log("deleteRecentSearch called");
    if (index >= 0 && index < savedSearches.length) {
      const deletedSearch = savedSearches[index];
      const updatedRecentSearches = [...savedSearches];
      updatedRecentSearches.splice(index, 1);

      setRecentSearches(updatedRecentSearches);

      // Now update the savedSearches state to reflect the changes
      setSavedSearches(updatedRecentSearches);

      deleteSearchFromLocalStorage(deletedSearch);

      // Add a console log to verify that the search is being deleted
      console.log(`Deleted recent search: ${deletedSearch}`);

      // Set refresh to true to trigger a re-render
      setRefresh(true);

      console.log('Recent Searches after update:', updatedRecentSearches);
    }

    console.log('Recent Searches before update:', savedSearches);
  };

  useEffect(() => {
    loadRecentSearches();
    setRefresh(true);
  }, []);

  const deleteSearchFromLocalStorage = async (searchText) => {
    try {
      const searchKey = `searchedEmails:${searchText}`;
      await AsyncStorage.removeItem(searchKey);
      console.log(`Deleted email search for "${searchText}" from local storage`);
    } catch (error) {
      console.error('Error deleting search from AsyncStorage:', error);
    }
  };

  const loadSearchedEmails = async (searchText) => {
    try {
      const searchKey = `searchedEmails:${searchText}`;
      const savedEmails = await AsyncStorage.getItem(searchKey);
      if (savedEmails) {
        setEmailAlerts(JSON.parse(savedEmails));
        console.log(`Loaded email search for "${searchText}"`);
      } else {
        console.log(`No saved email search found for "${searchText}"`);
      }
    } catch (error) {
      console.error('Error loading searched emails from AsyncStorage:', error);
    }
  };

  const handleDateFilterPress = () => {
    setIsDatePickerVisible(true);
  };

  const handleDateFilterSelect = (filter) => {
    setSelectedDateFilter(filter);
    setIsDatePickerVisible(false);

    // Trigger the search with the selected date filter
    getUserIdFromStorage()
      .then((userId) => {
        if (userId) {
          fetchEmailData(userId, searchText, filter);
        }
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
  };

  const handleUnreadFilterPress = () => {
    setUnreadFilterActive(!unreadFilterActive);

    // Trigger the search with the selected date filter and updated unread filter
    getUserIdFromStorage()
      .then((userId) => {
        if (userId) {
          fetchEmailData(userId, searchText, selectedDateFilter);
        }
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
  };

  const fetchEmailData = async (userId, searchText, dateFilter) => {
    setLoading(true);

    try {
      // Define your API URL with the user's ID
      const apiUrl = `https://wealthmagnate.onrender.com/user/alertsall/${userId}?dateFilter=${dateFilter}`;

      // Make an API request to get email data
      const response = await axios.get(apiUrl);

      // Process the email data
      const emailData = response.data;
      const emailAlertsData = emailData.map((email) => ({
        header: {
          subject: email.header.subject[0],
          from: email.header.from[0],
          date: formatDate(email.header.date[0]),
        },
        body: email.text,
        receivedTime: formatTime(email.receivedTime),
        read: false, // Assuming all emails are initially unread
      }));

      console.log('response.data:', response.data);

      // Filter email alerts based on the search text
      const filteredEmailAlerts = emailAlertsData.filter((emailAlert) =>
        emailAlert.header.subject.toLowerCase().includes(searchText.toLowerCase())
      );

      // Update the state with filtered email alerts
      setEmailAlerts(filteredEmailAlerts);

      // Save the searched emails to AsyncStorage
      saveSearchedEmails(searchText, filteredEmailAlerts);
    } catch (error) {
      console.error('Error fetching email data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (searchText !== '') { // Only fetch if searchText is not empty
      getUserIdFromStorage()
        .then((userId) => {
          if (userId) {
            fetchEmailData(userId, searchText, selectedDateFilter);
          }
        })
        .catch((error) => {
          console.error('Error fetching user ID:', error);
        });
    } else {
      setEmailAlerts([]); // Clear the email alerts if searchText is empty
    }
  }, [searchText, selectedDateFilter]);

  const toggleReadState = (index) => {
    // Dispatch the action with the index
    toggleEmailReadState(index);
  };


  const handleAlertsScreen = () => {
    navigation.navigate('AlertsScreen');
  };

  const handlehomeicon = () => {
    navigation.navigate('Dashboard');
  };


  return (

    <SafeAreaView style={commonStyles.maincontainer}>

      {showGif && (
        <View style={[styles.gifcontainer, { height, width }]}>
          <Image
            style={{ width: 100, height: 100 }}
            resizeMode="cover"
            source={require('./assets/images/voice.gif')}
          />
        </View>
      )}

      <View style={styles.container}>

        <View style={styles.searchBarContainer}>
          <View style={styles.menuButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('./assets/images/backarrow.png')}
                style={[styles.backarrow]} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search in emails"
            placeholderTextColor="lightgray"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={() => {
              // Trigger search when the Enter key is pressed
              fetchEmailData(userId, searchText);
            }}
          />

          <View style={[styles.profileImage, commonStyles.marginRight1]}>
            <TouchableOpacity onPress={startRecognizing}>
              <Image source={require('./assets/images/mic.png')}
                style={[styles.imagesizeaaa]}
              />
            </TouchableOpacity>
          </View>

        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent} style={{ flex: 1 }}>

          {/* Add Unread, Date buttons here */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                unreadFilterActive && { backgroundColor: 'blue' }, // Customize the style for the active state
              ]}
              onPress={handleUnreadFilterPress}
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
              {/* <Picker
                style={styles.picker}
                enabled={false}
                mode="dropdown"
              /> */}
            </TouchableOpacity>


            {/* Render the ModalComponent with appropriate props */}
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
          {console.log('savedSearches:', savedSearches)}
          {refresh ? (
            savedSearches.map((search, index) => (
              <View key={search} style={styles.savedSearchItem}>
                <View style={styles.deleteButtonContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('./assets/images/recent-searches.png')}
                      style={styles.recentSearchesimg}
                    />
                    <Text style={styles.savedSearchText}>{search}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteRecentSearch(index)}>
                    <Text style={styles.deleteButton}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : null}


          {loading && searchText && (
            <Spinner visible={true}
              textContent={'Loading...'}
              textStyle={styles.spinnerText}
            />
          )}

          {emailAlerts.length > 0 && (
            emailAlerts.map((item, index) => {
              // Define a function to determine the color based on the subject
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
                      backgroundColor: item.read ? colors.bgblack : '#484848', // Change the background color based on 'read' property

                    },
                  ]}
                  onPress={() => toggleReadState(index)} // Toggle read state on click
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
                        width: Dimensions.get('window').width - 120, // Adjust the width based on your design
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
          )}
        </ScrollView>


        <View style={[commonStyles.footer1, commonStyles.footeralerts]}>

          <View style={[commonStyles.containerflex, styles.marginRight10, commonStyles.Nalignitems]}>
            <TouchableOpacity onPress={handlehomeicon}>
              <Image source={require('./assets/images/Home1.png')}
                style={commonStyles.footerimg} />
            </TouchableOpacity>

            <Text style={[commonStyles.textlightgray, commonStyles.fontsize10]}>Home</Text>
          </View>

          <View style={[commonStyles.containerflex, styles.marginRight3, commonStyles.Nalignitems]}>
            <TouchableOpacity onPress={handleAlertsScreen}>
              <Image source={require('./assets/images/alert.png')}
                style={[commonStyles.footerimg, { tintColor: '#F5D020' }]} />
            </TouchableOpacity>
            <Text style={[commonStyles.textlightgray,
            commonStyles.fontsize10,
            { color: '#F5D020' }
            ]}>
              Alerts
            </Text>
          </View>

          <View style={[commonStyles.containerflex, styles.marginRight3, commonStyles.Nalignitems]}>

            <Image source={require('./assets/images/news.png')} style={commonStyles.footerimg} />
            <Text style={[commonStyles.textlightgray, commonStyles.fontsize10]}>News</Text>

          </View>

          <View style={[commonStyles.containerflex, styles.marginRight3, commonStyles.Nalignitems]}>

            <Image source={require('./assets/images/community.png')} style={commonStyles.footerimg} />
            <Text style={[commonStyles.textlightgray, commonStyles.fontsize10, commonStyles.Nalignitems]}>Community</Text>

          </View>

          <View style={[commonStyles.containerflex, styles.marginRight4, commonStyles.Nalignitems]}>

            <Image source={require('./assets/images/e-learning.png')} style={commonStyles.footerimg} />
            <Text style={[commonStyles.textlightgray, commonStyles.fontsize10]}>E-learning</Text>

          </View>
        </View>

      </View>

    </SafeAreaView>
  );
}


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

  spinnerText: {
    color: "white",
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

});

// Connect the component to Redux
export default connect(mapStateToProps, {
  setEmailAlerts,
  toggleEmailReadState,
})(SearchAlertsEmails);