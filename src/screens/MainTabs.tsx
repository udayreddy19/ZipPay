import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransferScreen from './TransferScreen';
import RazorpayScreen from './RazorpayScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Transfer" component={TransferScreen} />
      <Tab.Screen name="Razorpay" component={RazorpayScreen} />
    </Tab.Navigator>
  );
}