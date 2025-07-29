import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import fonts from '../../themes/fonts';
import colors from '../../themes/colors';
import {format, isThisYear} from 'date-fns';
import {SecurityGuardGuest} from '../../services/securityGuardGuestService';
import Icon from '../Common/Icon';

interface PastGuestItemProps {
  guest: SecurityGuardGuest;
  onPressItem: (guestId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`; // e.g., "1st Jun · 12:28"
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`; // e.g., "13 May 2022 · 13:30"
};

const PastGuestItem: React.FC<PastGuestItemProps> = ({guest, onPressItem}) => {
  const [iconColor, iconBgColor, iconName] = useMemo(() => {
    if (guest.status === 'pending') {
      return ['#FF9800', '#FFF3E0', 'clock'];
    }
    if (guest.status === 'arrived') {
      return [colors.primary, '#E3F2FD', 'check'];
    }
    if (guest.status === 'cancelled') {
      return ['#F44336', '#FFEBEE', 'ban'];
    }
    if (guest.status === 'departed') {
      return ['#4CAF50', '#E8F5E8', 'walking'];
    }
    return ['#9E9E9E', '#F5F5F5', 'clock'];
  }, [guest]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(guest.id)}>
      <View style={styles.left}>
        <View style={[styles.avatar, {backgroundColor: iconBgColor}]}>
          <Icon name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>
            {formatDate(guest.departureTime || guest.updatedAt)}
          </Text>
          <Text style={styles.name}>
            {guest?.resident?.blockCourt && `${guest?.resident?.blockCourt} - `}
            {guest?.resident?.houseNumber && `${guest?.resident?.houseNumber}`}
          </Text>
          <Text style={styles.purpose}>{guest.purpose}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.plateContainer}>
          <Text style={styles.vehiclePlate}>
            {guest.vehicleLicensePlate && guest.vehicleLicensePlate.trim()
              ? guest.vehicleLicensePlate.toUpperCase()
              : 'No Vehicle'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  details: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  date: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  purpose: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  vehiclePlate: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  right: {
    alignItems: 'center',
  },
  plateContainer: {
    backgroundColor: colors.grayBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});

export default PastGuestItem;
