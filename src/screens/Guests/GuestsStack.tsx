import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Guests from './Guests';

const Stack = createNativeStackNavigator();

const GuestsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResidentGuests"
        component={Guests}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default GuestsStack;
