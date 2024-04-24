import React from 'react';
import { Image, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScheduleScreen from '../screens/ScheduleScreen';
import UserProfileScreen from '../screens/UserInfoScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, name }) => {
  let iconSource;
  let labelText;

  switch (name) {
    case 'Schedule':
      iconSource = focused
        ? require('../assets/images/schedule-icon-active.png')
        : require('../assets/images/schedule-icon.png');
      labelText = 'Schedule';
      break;
    case 'UserProfile':
      iconSource = focused
        ? require('../assets/images/user-profile-icon-active.png')
        : require('../assets/images/user-profile-icon.png');
      labelText = 'User Profile';
      break;
    // ... other cases for more tabs
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Image source={iconSource} style={{ width: 24, height: 24 }} />
      <Text style={{ color: focused ? 'tomato' : 'gray', fontSize: 10 }}>
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
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
