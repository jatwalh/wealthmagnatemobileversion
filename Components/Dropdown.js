import React from 'react';
import { StyleSheet , View, Text,  } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../assets/colors/color';
import { commonStyles } from '../assets/colors/style';

const SelectBox = ({
    label,
    value,
    iconName,
    error,
    data,
    onFocus = () => { },
     placeholderStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = React.useState(false)
    return (
        <View style={{ marginBottom: 10 }}>
        {label &&
            <Text style={style.label}>{label}</Text>
        }
        <View style={[
            style.inputContainer,
            {
                borderWidth:error 
                ? 1:0,
                borderColor: error
                    ? colors.bgred
                    : isFocused
                        ? 'blue'
                        : '',
            },
        ]}>
            {iconName &&
                <MaterialCommunityIcons
                    name={iconName}
                    style={{
                        fontSize: 22,
                        color: colors.bgred,
                        marginLeft: 10
                    }} />
            }
            <Dropdown
              style={[style.dropdown, isFocused && { borderColor: 'blue' }]}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={data}
              value={value}
              //   search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocused ? 'Select Target Weight' : 'Weight'}
              searchPlaceholder="Search..."
             // value={name}
              onFocus={() => {
                onFocus();
                setIsFocused(true)
            }}
            onBlur={() => {
                setIsFocused(false)
            }}
              onChange={() => {
                setIsFocused(true);
              }}
            />
        </View>
        {error &&
            <Text style={{ color: colors.bgred,marginHorizontal: 10 }}>{error}</Text>
        }
    </View>
    )
}

const style = StyleSheet.create({
    dropdown: 
    {
        backgroundColor: '#F4F4F4',
        width: '100%',
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    placeholderStyle1:
    {
        color: colors.bgblack,
        fontWeight: '600',
    },

    placeholderStyle: {
        color: colors.bgwhite,
        fontWeight: '600',
    },
    selectedTextStyle: 
    {
        color: colors.bgblack,
    },

    selectedStrategyInput: 
    {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        color: 'white',
        width: '100%',
},


});

export default SelectBox;