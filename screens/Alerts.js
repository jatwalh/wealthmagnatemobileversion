import React, { useState, useEffect } from 'react';
import axios from 'axios';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';
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
    KeyboardAvoidingView,
    ActivityIndicator,
  
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../Components/SideBar';
import { connect } from 'react-redux';
import { setEmailAlerts, toggleEmailReadState } from '../actions/emailActions';
import Footer from '../Components/Footer';
import ModalComponent from '../Components/DateFilterModal';
import Calendar from 'react-native-calendar-range-picker';
import Voice from '@react-native-community/voice';
import {API_BASE_URL} from "../constants/constants";


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
  
// function to determine the color based on the subject
const getSubjectColor = (subject) => {
  const subjectLower = subject.toLowerCase();
  if (subjectLower.includes('bb') 
        || subjectLower.includes('raw')
        || subjectLower.includes('oss') 
        || subjectLower.includes('supernova') 
        || subjectLower.includes('pbatr') 
        || subjectLower.includes('pb') 
        || subjectLower.includes('cs5'))
          {
    return 'blue';
  } else if (subjectLower.includes('eca') 
        || subjectLower.includes('aph') 
        || subjectLower.includes('cs4')) 
        {
    return 'red';
  } else if (subjectLower.includes('pv') 
        || subjectLower.includes('avg') 
        || subjectLower.includes('hphv')) 
        {
    return 'green';
  }
  return 'white'; 
};
  
  
function extractFirstLetters(str, count) {
  // Extract the first letters of specific names
  const matches = str.match(/\b(bb|raw|oss|supernova|pbatr|pb|cs5|eca|aph|cs4|pv|avg|hphv)\b/gi);
  return matches ? matches.map(match => match.slice(0, count)).join('') : '';
}
  
  
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(timeString).toLocaleTimeString('en-US', options);
}
  
// Function to use in Otherthanaweek option in Date filter
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


  
function AlertsScreen({ 
    emailAlerts,
    setEmailAlerts,
    toggleEmailReadState,
    userData: propUserData,
  }) {
  
    const navigation = useNavigation();
    const route = useRoute();
    const activeScreen = route.name;
  
    const [userData, setUserData] = useState(null); 
  
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [allAlerts, setAllAlerts] = useState(true);
  
    // Search filter useStates
    const [showSearchFilter, setShowSearchFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [savedSearchTerm, setSavedSearchTerm] = useState('');
    const [filteredEmailAlerts, setFilteredEmailAlerts] = useState([]);

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

    // handling sidebar
    const [tested, setTested] = useState(false);
    

    // Function to count alerts based on the selected category
    const countAlerts = (category) => {
      switch (category) {
        case 'Trading':
          return emailAlerts.length;
        case 'All Strategies':
          // Count alerts for all strategies
          return emailAlerts.filter((item) =>
            userData.strategyOBJ.some((strategy) =>
              item.header.subject.includes(strategy.strategyID.strategyType)
            )
          ).length;
        default:
          // Count alerts for a specific strategy
          return emailAlerts.filter((item) =>
            userData.strategyOBJ.some((strategy) =>
              item.header.subject.includes(strategy.strategyID.strategyName)
            )
          ).length;
      }
    };
  
    
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
  
    // function to fetch emails
    useEffect(() => {
      const fetchEmailDataWithRetries = (retries) => {
        getUserIdFromStorage()
          .then((userId) => {
            console.log(userId);
    
            axios
              // .get(`https://wealthmagnate.onrender.com/user/alertsall/${userId}`)
              .get(`${API_BASE_URL}/user/alertsall/${userId}`)
              .then((response) => {
                if (response.data.message === 'No alerts found') {
                  // Handle the case where no alerts are found
                  setEmailAlerts([]); // Clearing existing email alerts
                  setLoading(false);
                } else {
                  // Extract and process the email data from the response
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
                  console.log(emailAlertsData);
                  // Set the emailAlerts state with the extracted data
                  setEmailAlerts(emailAlertsData); // Update the Redux state with new emails from API
                  setLoading(false);
                }
              })
              .catch((error) => {
                if (retries < maxRetries) {
                  // Retry the request after a delay
                  setTimeout(() => fetchEmailDataWithRetries(retries + 1), retryDelay);
                } else {
                  // Handle the error if retries are exhausted
                  console.error('Error fetching email data:', error);
                  setLoading(false);
                }
              });
          })
          .catch((error) => {
            // Handle any potential errors when fetching the user ID
            console.error('Error fetching user ID:', error);
            setLoading(false);
          });
      };
    
      // Configure the maximum number of retries and delay (in milliseconds)
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second
    
      // Start fetching email data with retries
      fetchEmailDataWithRetries(0);
    }, []);
    
    
    const toggleReadState = (index) => {
        // Dispatch the action with the index
        toggleEmailReadState(index);
        
        // Save the updated emailAlerts to AsyncStorage
    AsyncStorage.setItem('emailAlerts', JSON.stringify(emailAlerts));
    };


    // Search Filter Functions:
    
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
        // Don't set searchTerm here
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
    
    // Clear the search term in the TextInput
    setSearchTerm('');
  };

   // Show Search Filter 
   const handleSearchEmails = () => {
    setShowSearchFilter(true);
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
  
    //Logout menu functions:
    const [isMenuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
    };
  
    const handleLogout = async () => {
        try {
            // Clear user data from local storage
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('alertsData');
    
            // Navigate to the Welcome screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            try {
                const jsonString = await AsyncStorage.getItem('userData');
                const user = JSON.parse(jsonString);
                setUserData(user); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, []);
  

    // Sidebar functions:
    const handleToggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const handleSelectItem = async (item, type) => {
      if (type === "Types") {
        const jsonString = await AsyncStorage.getItem('userData');
        const user = await JSON.parse(jsonString);
        let userStrategies = user.strategyOBJ;
        const shortTermStrategies = userStrategies.filter(obj => obj.strategyID.strategyType === item);
        const strategyNameArray = shortTermStrategies.map((data) => (
          data.strategyID.strategyName
        ));
        setSelectedItem(strategyNameArray);
        setAllAlerts(item === 'Trading');
        setIsSidebarOpen(false);
      } else if (type === "importantalerts") {
        setTested(!tested);
        const jsonString = await AsyncStorage.getItem('userData');
        const user = await JSON.parse(jsonString);
        let userImportStocks = user.importantStocks;
  
        const strategyNameArray = userImportStocks.map((data) => (
          data.ISstrategyID.strategyName
        ));
  
        const StockNameArray = userImportStocks.map((data) => (
          data.ISstockID.map((dataTwo) => (
            dataTwo.stockName
          ))
        ));
        const allImportStocks = [].concat(...StockNameArray, ...strategyNameArray);
        setSelectedItem(allImportStocks);
        setAllAlerts(item === 'Trading');
        setIsSidebarOpen(false);
        return console.log("testing", userImportStocks);
      } else if (type === "combinationalerts") {
        setTested(!tested);
        const jsonString = await AsyncStorage.getItem('userData');
        const user = await JSON.parse(jsonString);
        let userCombination = user.combinationAlerts;
        const strategyOne = userCombination.map(alert => alert.CAtrategyOne.strategyName);
        const strategyTwo = userCombination.map(alert => alert.CAstrategyTwo.strategyName);
        const combinationStockName = userCombination.map(alert => alert.CAstockID.stockName);
        const allCombinationData = [].concat(...strategyOne, ...strategyTwo, ...combinationStockName);
        setSelectedItem(allCombinationData);
        setAllAlerts(item === 'Trading');
        setIsSidebarOpen(false);
        return console.log(strategyOne,strategyTwo, combinationStockName);
  
  
        // const strategyNameArray = userImportStocks.map((data) => (
        //   data.ISstrategyID.strategyName
        // ));
  
        // const StockNameArray = userImportStocks.map((data) => (
        //   data.ISstockID.map((dataTwo) => (
        //     dataTwo.stockName
        //   ))
        // ));
        // const allImportStocks = [].concat(...StockNameArray, ...strategyNameArray);
        // setSelectedItem(allImportStocks);
        // setAllAlerts(item === 'Trading');
        // setIsSidebarOpen(false);
        // return console.log("testing", userImportStocks);
  
      } else {
        const resultArray = [item];
        setSelectedItem(resultArray);
        setAllAlerts(item === 'Trading');
        setIsSidebarOpen(false);
      }
    };
  
    useEffect(() => {
      console.log(typeof selectedItem, selectedItem);
    }, [selectedItem]);


return (
    <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior="padding"
        >
        <SafeAreaView style={[commonStyles.maincontainer]}>
    
        <View style={styles.container}>
            {showSearchFilter ? (

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

                    <View style={styles.searchBarContainer2}>
                        <View style={styles.menuButton}>
                            <TouchableOpacity 
                                onPress={() => {
                                setShowSearchFilter(false); // Set showSearchFilter to false
                                }}
                            >
                                <Image source={require('../assets/images/backarrow.png')} style={[styles.backarrow]} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search in emails"
                            placeholderTextColor="lightgray"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            onSubmitEditing={handleSearch} // Triggered when the user presses the search button
                        />

                        <View style={[styles.profileImage, commonStyles.marginRight1]}>
                            <TouchableOpacity onPress={startRecognizing}>
                            <Image source={require('../assets/images/mic.png')} style={[styles.sendersimagesize]} />
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
                    commonStyles.marginLeft0,
                    {marginBottom:10,}
                    ]}>
                        Recent Email Searches
                    </Text>

                    {/* Rendering the Calendar only when the custom range is selected */}
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
                            { marginTop: 3, }
                        ]}>
                            {` ${searchTerm}`}
                        </Text>

                        {console.log("loading:", loading)}
                        {console.log("searchTerm:", searchTerm)}

                        {loading && searchTerm ? (
                        <ActivityIndicator
                            size="large"
                            color={colors.white}
                            style={styles.loader}
                        />
                        ) : (
                        filteredEmailAlerts.length > 0 && (
                        filteredEmailAlerts.map((item, index) => {
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
                                    <View style={[styles.avatar,
                                     { backgroundColor: getSubjectColor(item.header.subject) }]}>
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
                                    { color:"#F6F6F6",
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

                  </View>
            </SafeAreaView>
    
            ) : (
            <>

            <View style={styles.searchBarContainer}>
            <TouchableOpacity style={styles.hamburgerButton} onPress={handleToggleSidebar}>
                <Image source={require('../assets/images/menubr.png')} style={styles.hamburgerIcon} />
            </TouchableOpacity>
    
            {/* Conditionally rendering the Sidebar */}
            {isSidebarOpen && (
                <Sidebar
                isSidebarOpen={isSidebarOpen}
                handleToggleSidebar={handleToggleSidebar}
                selectedItem={selectedItem}
                handleSelectItem={handleSelectItem}
                colors={colors}
                styles={commonStyles}
                countAlerts={countAlerts}
                />
            )}

            <TouchableOpacity
                onPress={() => {
                // Handle search button press here
                handleSearchEmails();
                }}
                style={styles.searchButton}
            >
                <Text style={styles.searchInput}>Search in emails</Text>
            </TouchableOpacity>

                <TouchableOpacity onPress={toggleMenu} style={commonStyles.rightItemA}>
                    <Image
                    source={require('../assets/images/profileimage.png')}
                    style={commonStyles.imagesize}
                    />
                </TouchableOpacity>
    
                {/* Logout Menu */}
                {isMenuVisible && (
                    <View style={styles.menuContainer}>
                    <Text style={styles.usernametext}>{userData?.userName}</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                        <Text style={styles.logouttext}>Logout</Text>
                    </TouchableOpacity>
                    </View>
                )}
    
            </View>
        
            
    
            <ScrollView contentContainerStyle={styles.scrollViewContent}
                style={{ flex: 1,}}
                >
                <Text style={[styles.additionalText,
                commonStyles.fontsize15, 
                commonStyles.textwhite,
                    commonStyles.marginLeft1,
                {marginBottom: 10}
                    ]}>
                All Alerts ({emailAlerts.length})
                </Text>
    
                {loading ? (
                <ActivityIndicator
                    size="large"
                    color={colors.white}
                    style={styles.loader}
                />
                ) : (
                <View style={{ marginBottom: 95 }}> 
                {emailAlerts.length === 0 ? (
                <Text style={styles.noAlertsText}>No alerts found</Text>
                ) : (
                <>
                    {selectedItem.length === 0 ? (
                    emailAlerts
                        .filter((item) => allAlerts || item.header.subject.toLowerCase().includes(selectedItem.toLowerCase()))
                        .map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                            commonStyles.mta,
                            styles.notificationbox,
                            {
                                backgroundColor: item.read ? colors.bgblack : '#484848',
                            },
                            ]}
                            onPress={() => {
                            toggleReadState(index);
                            navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item });
                            }}
                        >
                            <View style={styles.profilecontainer}>
                            {item.profileImage ? (
                                <Image source={{ uri: item.profileImage }} style={styles.avatarImage} />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: getSubjectColor(item.header.subject) }]}>
                                <Text style={[styles.avatarText, commonStyles.fontbold]}>
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
                                marginTop: 5,
                                width: Dimensions.get('window').width - 120,
                                color: "#F6F6F6",
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
                                { color: 'gray' }]}>
                                {item.receivedTime}
                                </Text>
                            </View>
                            </View>
                        </TouchableOpacity>
                        ))
                    ) : (
                    <>
                        {tested === false ? (
                        <>
                            {selectedItem.map((selectedItemValue, selectedIndex) => (
                            <React.Fragment key={selectedIndex}>{
                                emailAlerts
                                .filter((item) => allAlerts || item.header.subject.includes(selectedItemValue))
                                .map((item, index) => (
                                    <TouchableOpacity
                                    key={index}
                                    style={[
                                        commonStyles.mta,
                                        styles.notificationbox,
                                        {
                                        backgroundColor: item.read ? colors.bgblack : '#484848',
                                        },
                                    ]}
                                    onPress={() => {
                                        toggleReadState(index);
                                        navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item });
                                    }}
                                    >
                                    <View style={styles.profilecontainer}>
                                        {item.profileImage ? (
                                        <Image source={{ uri: item.profileImage }} style={styles.avatarImage} />
                                        ) : (
                                        <View style={[styles.avatar, { backgroundColor: getSubjectColor(item.header.subject) }]}>
                                            <Text style={[styles.avatarText, commonStyles.fontbold]}>
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
                                            marginTop: 5,
                                            width: Dimensions.get('window').width - 120,
                                            color: "#F6F6F6",
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
                                        { color: 'gray' }]}>
                                            {item.receivedTime}
                                        </Text>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                ))}
                            </React.Fragment>
                            ))}
                        </>
                        ) : (
                        <>
                            {selectedItem.map((selectedItemValue, selectedIndex) => (
                            <React.Fragment key={selectedIndex}>{
                                emailAlerts
                                .filter((item) => allAlerts || item.header.subject.includes(selectedItemValue))
                                .map((item, index) => (
                                    <TouchableOpacity
                                    key={index}
                                    style={[
                                        commonStyles.mta,
                                        styles.notificationbox,
                                        {
                                        backgroundColor: item.read ? colors.bgblack : '#484848',
                                        },
                                    ]}
                                    onPress={() => {
                                        toggleReadState(index);
                                        navigation.navigate('EmailAlertsBodyScreen', { selectedEmail: item });
                                    }}
                                    >
                                    <View style={styles.profilecontainer}>
                                        {item.profileImage ? (
                                        <Image source={{ uri: item.profileImage }} style={styles.avatarImage} />
                                        ) : (
                                        <View style={[styles.avatar, { backgroundColor: getSubjectColor(item.header.subject) }]}>
                                            <Text style={[styles.avatarText, commonStyles.fontbold]}>
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
                                            marginTop: 5,
                                            width: Dimensions.get('window').width - 120,
                                            color: "#F6F6F6",
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
                                        { color: 'gray' }]}>
                                            {item.receivedTime}
                                        </Text>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                ))}
                            </React.Fragment>
                            ))}
                        </>
                        )}
                    </>
                    )}
                </>
                )}
            </View>
            )}
            </ScrollView>
    
            {/* Footer Section */}
            <Footer navigation={navigation} activeScreen={activeScreen} />
            </>
            )}
        </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
    );
}

      
const mapStateToProps = (state) => {
const emailAlerts = state.email.emailAlerts || [];
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
    backgroundColor:colors.bgblack,
    paddingTop: 10,
    
    },
    
    notificationbox:{
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
    zIndex:1,
    
    },

    searchBarContainer2:{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#484848',
      paddingLeft: 20,
      marginBottom: 15,
      // height: 60,
      zIndex:1,
    },

    searchButton:{
    marginTop:14,
    marginLeft: 12,
    color: 'lightgray',
    },
    searchInput: {
    flex: 4, 
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

    profilecontainer:{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginLeft:10,
    marginRight:10,
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

    sendersimagesize:
    {
        position: 'relative',
        // left: width * 0.07,
        width: width * .04,
        height: height * .06,
        resizeMode: 'contain',
    },
  
    avatar:{
    width: 40,
    height: 40,
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    },

    avatarText:{
    color:"#fff",
    fontSize: 16,
    },


    additionalText:{
    color: '#d1d1d1',
    },

    noAlertsText:{
    color: "white",
    marginLeft: 20,
    marginTop: 20 
    },
    
    // Search section

    hamburgerButton: {
    zIndex: 1,
    width: width * 0.08,
    height: height * 0.09,
    resizeMode: 'contain',
    marginRight: 10,
    },
    
    hamburgerIcon: {
    width: width * 0.08,
    height: height * 0.09,
    resizeMode: 'contain',
    
    },

    menuButton: {
    flex: 1,
    },

    backarrow: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .07,
    height: height * .07,
    resizeMode: 'contain',
    },

    searchInput: {
    flex: 4,
    color: 'white',
    fontSize: 16,
    },

    imagesizesearch: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .04,
    height: height * .06,
    resizeMode: 'contain',
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
    marginTop:10,
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

    menuContainer: {
    top: 20, 
    right: 20,
    backgroundColor: 'lightgray',
    borderRadius: 3,
    elevation: 5, 
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2,
    marginTop: 35, 
    marginRight:10,
    padding:15,
    zIndex: 999, 
    position: 'absolute'
},
    menuItem: {
    padding: 3,
    
    },
    logouttext:{
    color:"black",
    fontSize:15,
    backgroundColor:'white',
    borderRadius:3,
    padding:5
    },
    usernametext: {
    color:"black",
    fontSize:15,
    marginBottom:10,
    },
    loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
    },


});
        
  


export default connect(mapStateToProps, mapDispatchToProps)(AlertsScreen);