import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import VerifyScreen from '../screens/VerifyScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useAuth } from '../context/AuthContext';
import DrawerContent from '../components/DrawerContent';

export type RootStackParamList = {
  Home: undefined;
  Verify: undefined;
  About: undefined;
  Contact: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Welcome: undefined;
  AdminDashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

// Explicitly define drawer options to prevent legacy props
const drawerScreenOptions: DrawerNavigationOptions = {
  headerStyle: {
    backgroundColor: '#4F46E5',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  drawerActiveTintColor: '#4F46E5',
  drawerInactiveTintColor: '#6B7280',
  drawerType: 'front',
  sceneContainerStyle: { backgroundColor: '#fff' },
  unmountOnBlur: false,
};

const DrawerNavigator = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={drawerScreenOptions}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('nav.home'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Verify"
        component={VerifyScreen}
        options={{
          title: t('nav.verify'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      {isAuthenticated && (
        <>
          <Drawer.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{
              title: t('nav.admin'),
              drawerIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: t('nav.about'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: t('nav.contact'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // Show a friendly welcome screen for unauthenticated users.
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Home" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
