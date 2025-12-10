import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {UserGroupIcon, TruckIcon} from 'react-native-heroicons/outline';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';

const InfoCards = () => {
  return (
    <View style={styles.container}>
      {/* Members Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <UserGroupIcon size={28} color={colors.primary} />
        </View>
        <Text style={styles.countText}>4</Text>
        <Text style={styles.labelText}>Members</Text>
      </View>

      {/* Vehicles Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <TruckIcon size={28} color={colors.primary} />
        </View>
        <Text style={styles.countText}>2</Text>
        <Text style={styles.labelText}>Vehicles</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16, // Use gap for spacing between flex items
  },
  card: {
    flex: 1,
    backgroundColor: colors.whiteBg,
    borderRadius: 20,
    padding: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 2,
    height: 150, // Slightly increased height
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48, // Increased size
    height: 48, // Increased size
    borderRadius: 24,
    backgroundColor: '#F0F7FF', // Light blue bg
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  countText: {
    fontSize: 28, // Increased from 24
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 16, // Increased from 14
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
});

export default InfoCards;
