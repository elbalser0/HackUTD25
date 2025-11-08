import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Screens
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import DocumentsScreen from '../screens/DocumentsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#005A9C',
      tabBarInactiveTintColor: '#757575',
    }}
  >
    <Tab.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{
        tabBarLabel: 'AI Assistant',
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🤖</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="Documents" component={DocumentsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return <LoadingSpinner message="Initializing PNC Productivity App..." />;
  }

  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;