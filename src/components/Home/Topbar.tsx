import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
//  import MaleAvatarSvg from '../../assets/images/male_avatar.svg';
import Icon from '../Common/Icon';
import {useAuth} from '../../contexts/AuthContext';

const Topbar = () => {
  const {user} = useAuth();

  // Format user name
  const userName = user
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`.trim()
    : 'Guest';

  // Format address - prioritize resident data, fallback to direct properties
  const userAddress = user
    ? user.resident?.houseNumber && user.resident?.blockCourt
      ? `House ${user.resident.houseNumber}, Block ${user.resident.blockCourt}`
      : user.houseNumber && user.blockCourt
      ? `House ${user.houseNumber}, Block ${user.blockCourt}`
      : 'Address not available'
    : 'Loading address...';

  // Estate name
  const estateName = user?.estateName || 'Estate';

  return (
    <>
      <View style={styles.estateContainer}>
        <Icon name="map-marker-alt" size={15} color={colors.primary} />
        <Text style={styles.estateName}>{estateName}</Text>
      </View>
      <View style={styles.topBar}>
        <View style={styles.left}>
          <View style={styles.details}>
            <Text style={styles.residentName}>Hi, {userName}</Text>
            <Text style={styles.residentAddress}>
              You are currently listed to {userAddress}
            </Text>
          </View>
          {/* <View style={styles.details}>
            <Text style={styles.residentName}>Collins Okore</Text>
            <Text style={styles.residentAddress}>House A45, Block A</Text>
          </View> */}
        </View>
        {/* <View style={styles.avatar}>
          <MaleAvatarSvg width={45} height={45} />
        </View> */}
        {/* <View style={styles.notification}> */}
        {/* <BellIcon color={colors.darkFont} size={24} /> */}
        {/* </View> */}
      </View>
      {/* <View style={styles.details}>
        <Text style={styles.residentName}>Hi, Collins Okore</Text>
        <Text style={styles.residentAddress}>
          You are currently listed to House A45, Block A
        </Text>
        <View style={styles.estateContainer}>
          <Icon name="map-marker-alt" size={15} color={colors.primary} />
          <Text style={styles.estateName}>Greenfield Estate</Text>
        </View>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 28,
    marginTop: 8,
    marginBottom: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteBg,
    // borderWidth: 1,
    // borderColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'column',
    // marginLeft: 16,
    marginBottom: 16,
  },
  residentName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  residentAddress: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    flexWrap: 'wrap',
    maxWidth: '100%',
    lineHeight: 22,
  },
  estateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  estateName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginLeft: 4,
  },
});

export default Topbar;
