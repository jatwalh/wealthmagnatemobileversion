// DateFilterModal.js
import React,{useState,} from 'react';
import axios from 'axios';
import colors from '../assets/colors/color';
import { commonStyles } from './../assets/colors/style';
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
    Modal,
} from 'react-native';


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
            <Text style={styles.closeButtonText}>&times;</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Date</Text>
        </View>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={() => handleDateFilterSelect('anyTime')}>
          <View style={styles.circletextcontainer}>
            <View style={styles.circle} />
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
        
        {/* Add other date filter options here */}
        <TouchableOpacity onPress={() => handleDateFilterSelect('customRange')}>
          <Text style={styles.modalcustomText}>Custom range</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set the background color as needed
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

});

export default ModalComponent;
