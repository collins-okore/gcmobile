import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Icon from '../Common/Icon';
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
        <Icon name="plus" size={24} color={colors.darkFont} />
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
    paddingHorizontal: 0,
    backgroundColor: colors.whiteBg,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginLeft: 16,
  },
  addButton: {
    // padding: 0,
    // paddingRight: 16,
    // paddingLeft: 16,
    // paddingVertical: 10,
    // backgroundColor: 'red',

    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});

export default TopBar;
