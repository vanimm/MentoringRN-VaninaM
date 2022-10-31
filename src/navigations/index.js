import * as React from 'react';

import auth from '@react-native-firebase/auth';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import TweetDetail from '../screens/TweetDetail';
import Profile from '../screens/Profile';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Setting';
import Search from '../screens/Search';
import Home from '../screens/Home';
import SupportCenter from '../screens/SupportCenter';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';

//layout
import DrawerNav from '../screens/Layout/Drawer';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
    drawerContent={props => <DrawerNav {...props} />}>
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Support Center" component={SupportCenter} />
      <Drawer.Screen
        name="Logout"
        component={() => {
          auth().signOut();
          return null;
        }}
      />
    </Drawer.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{headerShown: false, tabBarStyle: {background: 'red'}}}>
      <Tab.Screen
        name="StackNavigation"
        component={StackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => (
            <AntDesign name="home" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: 'Search',
          tabBarIcon: ({color}) => (
            <Feather name="search" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarBadge: 6,
          title: 'Notifications',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={23}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TweetDetail" component={TweetDetail} />
    </Stack.Navigator>
  );
}

export default function Navigations() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <AuthStack />;
  }

  return <DrawerNavigator />;
}
