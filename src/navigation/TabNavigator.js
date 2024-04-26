import React from 'react';
import { Image, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScheduleScreen from '../screens/ScheduleScreen';
import UserProfileScreen from '../screens/UserInfoScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, name }) => {
  let iconSource;
  let labelText;
  let iconOpacity = focused ? 1 : 0.5; // 100% opacity for focused, 50% for unfocused


  switch (name) {
    case 'Schedule':
        iconSource = require('../../assets/images/schedule-icon.jpeg');

      labelText = 'Schedule';
      break;
    case 'UserProfile':
        iconSource = require('../../assets/images/user-profile-icon.jpeg');

      labelText = 'User Profile';
      break;
    // ... other cases for more tabs
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Image source={iconSource} style={{ width: 24, height: 24, opacity: iconOpacity}} resizeMode='contain' />
      <Text style={{ color: focused ? 'black' : 'gray', fontSize: 10, opacity: iconOpacity }}>
        {labelText}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name={route.name} />
          ),
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: () => null, // This hides the default label
          tabBarStyle: {
            paddingBottom: 15,
            height: 90 // Adjust the height as needed
          },
        })}
      >
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="UserProfile" component={UserProfileScreen} />
      </Tab.Navigator>
    );
  }

export default TabNavigator;
