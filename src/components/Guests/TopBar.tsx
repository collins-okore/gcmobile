import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Icon from '../Common/Icon';
import {useNavigation} from '@react-navigation/native';
import {PlusIcon} from 'react-native-heroicons/solid';

interface TopBarProps {
  title?: string;
}

const TopBar = ({title = 'Guests'}: TopBarProps) => {
  const navigation = useNavigation();

  const handleAddGuest = () => {
    (navigation as any).navigate('AddResidentGuest');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
        <PlusIcon size={24} color={colors.whiteBg} />
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
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16, // Consistent padding
    backgroundColor: colors.whiteBg,
  },
  title: {
    fontSize: 28, // Increased size
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  addButton: {
    width: 44, // Slightly larger
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary, // Blue background
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for blue button
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default TopBar;
