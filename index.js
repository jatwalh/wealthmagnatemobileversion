import React, { useState, useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store/store';
import FrontScreen from './screens/FrontScreen';
import EnterPinandBiometricScreen from './screens/EnterPinandBiometricScreen';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import VerifyEmailAuthentication from './screens/EmailAuthentication';
import LoadertoScreenUnLock from './screens/LoadertoScreenUnLockPage';
import Enterpin from './screens/EnterPin';
import Forgot from './screens/ForgotPasswordScreen';
import Entermobilenumberforotp from './screens/ForgetPasswordEnterMobieNumber';
import EnterMobileOtp from './screens/ForgetPWEnterotp';
import ResetPassword from './screens/ResetPasswordScreen';
import Resetbylink from './screens/ResetByLink';
import ResetPasswordbylink from './screens/ResetPasswordbylink';
import Signup from './screens/SignUp';
import Signupform from './screens/SignUpForm';
import Verifyphonenumber from './screens/VerifyPhoneNumber';
import Verifyscreen from './screens/VerifyEmailscreen';
import Profiledetails from './screens/ProfileDetails';
import Loader from './screens/LoaderPage';
import Createpin from './screens/Createpin';
import Dashboard from './screens/Dashboard';
import NotificationScreen from './screens/Notifications';
import AlertsScreen from './screens/Alerts';
import AlertsTwo from './screens/AlertsTwo';
import SearchAlertsEmails from './SearchAlertsEmails';
import EmailAlertsBodyScreen from './screens/EmailAlertsBody';
import WeightageScreen from './screens/Weightage';
import WeightageScreenAlerts from './screens/WeightageScreenAlerts';
import ImportantAlertsSetting from './screens/ImportantAlertsSettings';
import ViewStocks from './screens/ViewImportantStocks';
import NotificationsAlertsSetting from './screens/NotificationsAlertsSetting';
import CombinationsAlertsSetting from './screens/CombinationsAlertsSettinng';
import ViewCombination from './screens/ViewCombination';
import NewsBody from "./screens/NewsBody";
import NewsScreen from './screens/NewsScreen';

import SearchFilter from './screens/SearchFilter';

import { name as AppName } from './app.json';



const Stack = createStackNavigator();

const linking = {
  prefixes: ['wealthmagnet://'],
  config: {
    screens: {
      ResetPasswordbylink: 'reset/:token', // Define a route for the reset password link
    },
  },
};


function App() {

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        {/* <DrawerNavigator /> */}
        <Stack.Navigator initialRouteName='FrontScreen'>
          {/* <Stack.Navigator initialRouteName='Dashboard'> */}

          <Stack.Screen
            name="FrontScreen"
            component={FrontScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="EnterPinandBiometricScreen"
            component={EnterPinandBiometricScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Signupform"
            component={Signupform}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="VerifyPhoneNumber"
            component={Verifyphonenumber}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="VerifyEmailscreen"
            component={Verifyscreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Profiledetails"
            component={Profiledetails}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Loader"
            component={Loader}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Createpin"
            component={Createpin}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="AlertsScreen"
            component={AlertsScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="AlertsTwo"
            component={AlertsTwo}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="SearchAlertsEmails"
            component={SearchAlertsEmails}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="EmailAlertsBodyScreen"
            component={EmailAlertsBodyScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="WeightageScreen"
            component={WeightageScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="WeightageScreenAlerts"
            component={WeightageScreenAlerts}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="ImportantAlertsSetting"
            component={ImportantAlertsSetting}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="ViewStocks"
            component={ViewStocks}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="NotificationsAlertsSetting"
            component={NotificationsAlertsSetting}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="CombinationsAlertsSetting"
            component={CombinationsAlertsSetting}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="ViewCombination"
            component={ViewCombination}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Login" component={Login}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="VerifyEmailAuthentication"
            component={VerifyEmailAuthentication}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="LoadertoScreenUnLock"
            component={LoadertoScreenUnLock}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Enterpin"
            component={Enterpin}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Forgot"
            component={Forgot}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Entermobilenumberforotp"
            component={Entermobilenumberforotp}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="EnterMobileOtp"
            component={EnterMobileOtp}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Resetbylink"
            component={Resetbylink}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="ResetPasswordbylink"
            component={ResetPasswordbylink}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="NewsScreen"
            component={NewsScreen}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="SearchFilter"
            component={SearchFilter}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="NewsBody"
            component={NewsBody}
            options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

AppRegistry.registerComponent(AppName, () => App);




// WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
// WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.