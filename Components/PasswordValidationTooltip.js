import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PasswordValidationTooltip = ({ messages }) => {
  return (
    <View style={styles.tooltipContainer}>
      <View style={styles.arrowUp} />
      {messages.map((message, index) => (
        <View style={styles.messageContainer} key={index}>
          {message.icon ? (
            <Text style={styles.icon}> {message.icon}</Text>
          ) : null}
          <Text style={message.style}>{message.text}</Text>
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
    tooltipContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      padding: 6,
      borderRadius: 10,
      top: '100%',
      width: '100%',
      height: 260,
      alignItems: 'center',
      marginLeft: 10,
      zIndex:99999, 
    },
    
    arrowUp: {
      position: 'relative',
      top: -20, 
      marginLeft: -10, 
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 15, 
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'white', 
    },

    tooltipText: {
      color: 'black',
      fontSize: 13,
      marginBottom: 5, 
    },

    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    icon: {
      fontSize: 15,
      marginRight: 5, 
    },
    });

export default PasswordValidationTooltip;