import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Visits from './Visits';

const Stack = createNativeStackNavigator();

const GuestsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResidentGuests"
        component={Visits}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default GuestsStack;
