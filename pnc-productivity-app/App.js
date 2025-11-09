import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { WorkspaceProvider } from './src/context/WorkspaceContext';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/styles/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <WorkspaceProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" backgroundColor="#0069AA" />
          </NavigationContainer>
        </WorkspaceProvider>
      </AuthProvider>
    </PaperProvider>
  );
}