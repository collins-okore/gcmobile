/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import UndrawVintage from '../../assets/images/undraw_vintage.svg';
import UndrawFans from '../../assets/images/undraw_fans.svg';

const QuickAccess = () => {
  const navigation = useNavigation();

  const handleVisitsPress = () => {
    // Navigate to Guests tab
    navigation.navigate('ResidentGuests' as never);
  };

  const handleVehiclesPress = () => {
    // Navigate to Vehicles screen
    navigation.navigate('ResidentVehicles' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.item, {marginRight: 8}]}
          activeOpacity={0.7}
          onPress={handleVisitsPress}>
          {/* @ts-ignore */}
          <UndrawFans width={100} height={60} />
          <Text style={styles.itemText}>Visits</Text>
          <Text style={styles.itemSubText}>View & book visits</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.item, {marginLeft: 8}]}
          activeOpacity={0.7}
          onPress={handleVehiclesPress}>
          {/* @ts-ignore */}
          <UndrawVintage width={100} height={60} />
          <Text style={styles.itemText}>Vehicles</Text>
          <Text style={styles.itemSubText}>Register vehicles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.whiteBg,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginTop: 8,
  },
  itemSubText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 4,
  },
});

export default QuickAccess;
