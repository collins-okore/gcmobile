import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {PlusIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';

const TopBar = () => {
  const navigation = useNavigation();

  const handleAddGuest = () => {
    (navigation as any).navigate('AddResidentGuest');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guests</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
        <PlusIcon color={colors.darkFont} size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 16,
    backgroundColor: colors.whiteBg,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  addButton: {
    padding: 0,
  },
});

export default TopBar;
