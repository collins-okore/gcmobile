import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

const SecurityQuickAccess = () => {
  const navigation = useNavigation();

  const handleSearchPress = () => {
    navigation.navigate('Search' as never);
  };

  const handleScanQRPress = () => {
    navigation.navigate('ScanQrCode' as never);
  };

  const handleAddGuestPress = () => {
    navigation.navigate('AddSecurityGuardGuest' as never);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Side-by-Side Cards Container */}
      <View style={styles.container}>
        <TouchableOpacity style={styles.accessItem} onPress={handleSearchPress}>
          <View style={styles.accessItemIcon}>
            <Icon name="search" size={24} color={colors.darkFont} />
          </View>
          <Text style={styles.accessItemTitle}>Search</Text>
          <Text style={styles.accessItemDescription}>
            Search for guests, residents or vehicles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accessItem} onPress={handleScanQRPress}>
          <View style={styles.accessItemIcon}>
            <Icon name="qrcode" size={24} color={colors.darkFont} />
          </View>
          <Text style={styles.accessItemTitle}>Scan QR Code</Text>
          <Text style={styles.accessItemDescription}>
            Scan QR codes for quick check-in
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Full-Width Card */}
      <TouchableOpacity
        style={styles.horizontalAccessItem}
        onPress={handleAddGuestPress}>
        <View style={styles.horizontalAccessItemIcon}>
          <Icon name="user-plus" size={24} color={colors.darkFont} />
        </View>
        <View style={styles.horizontalAccessItemContent}>
          <Text style={styles.horizontalAccessItemTitle}>Add Guest</Text>
          <Text style={styles.horizontalAccessItemDescription}>
            Register a new guest to the estate for quick access
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SecurityQuickAccess;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  accessItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.grayBg,
    borderRadius: 12,
    backgroundColor: colors.whiteBg,
    padding: 16,
    marginVertical: 8,
    width: '48%',
    minHeight: 120,
  },
  accessItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  accessItemTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    textAlign: 'center',
    marginBottom: 8,
  },
  accessItemDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    lineHeight: 18,
  },
  horizontalAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.grayBg,
    borderRadius: 12,
    backgroundColor: colors.whiteBg,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 80,
  },
  horizontalAccessItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  horizontalAccessItemContent: {
    flex: 1,
    flexDirection: 'column',
  },
  horizontalAccessItemTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  horizontalAccessItemDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    lineHeight: 20,
  },
});
