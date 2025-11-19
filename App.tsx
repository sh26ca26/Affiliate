import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import LinksScreen from './screens/LinksScreen';
import ConversionsScreen from './screens/ConversionsScreen';
import PayoutsScreen from './screens/PayoutsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';

// Navigation
import { AuthContext } from './services/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Authentication Stack Navigator
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/**
 * App Stack Navigator with Bottom Tabs
 */
function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#14b8a6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
          borderBottomColor: '#334155',
          borderBottomWidth: 1,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'لوحة التحكم',
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: 'الروابط',
          tabBarLabel: 'الروابط',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔗</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Conversions"
        component={ConversionsScreen}
        options={{
          title: 'التحويلات',
          tabBarLabel: 'التحويلات',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>✅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Payouts"
        component={PayoutsScreen}
        options={{
          title: 'المدفوعات',
          tabBarLabel: 'المدفوعات',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'الملف الشخصي',
          tabBarLabel: 'الملف',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 */
function RootNavigator() {
  const { state } = React.useContext(AuthContext);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {state.userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}

/**
 * Main App Component
 */
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (credentials: any) => {
        // TODO: Implement sign in
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      },
      signUp: async (credentials: any) => {
        // TODO: Implement sign up
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data: any) => {
        // TODO: Implement sign up
        dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, dispatch, ...authContext }}>
      <RootNavigator />
    </AuthContext.Provider>
  );
}

import { Text } from 'react-native';

