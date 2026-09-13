import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { RoomLobbyScreen } from '../screens/RoomLobbyScreen';
import { BbrControllerScreen } from '../screens/BbrControllerScreen';
import { GyroTestScreen } from '../screens/GyroTestScreen';
import { FindPcScreen } from '../screens/FindPcScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QrScannerScreen } from '../screens/QrScannerScreen';

export type RootStackParamList = {
  Home: undefined;
  RoomLobby: undefined;
  BbrController: undefined;
  GyroTest: undefined;
  FindPc: undefined;
  Settings: undefined;
  QrScanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0f172a' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoomLobby" component={RoomLobbyScreen} />
        <Stack.Screen name="BbrController" component={BbrControllerScreen} options={{ orientation: 'landscape' }} />
        <Stack.Screen name="GyroTest" component={GyroTestScreen} />
        <Stack.Screen name="FindPc" component={FindPcScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
